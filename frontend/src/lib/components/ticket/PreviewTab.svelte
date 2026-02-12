<script lang="ts">
	import { getElements } from '$lib/stores/elements.svelte';
	import { getCsvData } from '$lib/stores/csv.svelte';
	import { getTicketSettings } from '$lib/stores/ticket-settings.svelte';
	import { getBackgroundImage, getBackgroundFitMode } from '$lib/stores/canvas.svelte';
	import { getLabelConfig, getUniqueLabelValues } from '$lib/stores/labels.svelte';
	import { showToast } from '$lib/stores/toast.svelte';
	import { renderTicketToCanvas } from '$lib/utils/canvas-render';
	import { calculateLayout } from '$lib/utils/print-layout';
	import { SCALE_FACTOR } from '$lib/types/ticket';
	import Modal from '$lib/components/ui/Modal.svelte';

	const elements = $derived(getElements());
	const csvData = $derived(getCsvData());
	const settings = $derived(getTicketSettings());
	const bg = $derived(getBackgroundImage());
	const fitMode = $derived(getBackgroundFitMode());
	const labelConfig = $derived(getLabelConfig());
	const uniqueLabels = $derived(getUniqueLabelValues(csvData));

	let gap = $state(2);
	let filterLabel = $state('all');
	let previewImages = $state<string[]>([]);
	let generating = $state(false);
	let showPrintModal = $state(false);

	const filteredData = $derived(
		filterLabel === 'all'
			? csvData
			: csvData.filter((row) =>
				labelConfig.labelColumn ? row[labelConfig.labelColumn] === filterLabel : true
			)
	);

	const layout = $derived(calculateLayout(settings.width, settings.height, gap, settings.type, filteredData.length));

	async function generatePreview() {
		if (filteredData.length === 0) {
			showToast('warning', 'No data', 'Upload CSV data first');
			return;
		}

		generating = true;
		previewImages = [];

		try {
			const images: string[] = [];
			for (let i = 0; i < filteredData.length; i++) {
				const canvas = await renderTicketToCanvas(elements, filteredData[i], {
					width: settings.width * SCALE_FACTOR,
					height: settings.height * SCALE_FACTOR,
					quality: 1,
					backgroundImage: bg,
					fitMode,
					labelConfig
				});
				images.push(canvas.toDataURL('image/png'));

				if (i % 8 === 0) await new Promise((r) => setTimeout(r, 0));
			}
			previewImages = images;
			showToast('success', 'Preview generated', `${images.length} tickets`);
		} catch (err) {
			showToast('error', 'Preview failed', (err as Error).message);
		} finally {
			generating = false;
		}
	}

	function handlePrint() {
		showPrintModal = true;
	}

	function doPrint() {
		showPrintModal = false;

		const printWindow = window.open('', '_blank');
		if (!printWindow) return;

		const isLandscape = layout.orientation === 'landscape';
		const pageW = isLandscape ? 297 : 210;
		const pageH = isLandscape ? 210 : 297;

		let html = `<!DOCTYPE html><html><head><style>
			@page { size: ${isLandscape ? 'landscape' : 'portrait'}; margin: 0; }
			* { margin: 0; padding: 0; box-sizing: border-box; }
			body { width: ${pageW}mm; }
			.page { width: ${pageW}mm; height: ${pageH}mm; position: relative; page-break-after: always; padding: 10mm; }
			.ticket { position: absolute; }
			img { display: block; }
		</style></head><body>`;

		let ticketIdx = 0;
		for (let p = 0; p < layout.totalPages; p++) {
			html += '<div class="page">';
			for (let row = 0; row < layout.ticketsPerCol; row++) {
				for (let col = 0; col < layout.ticketsPerRow; col++) {
					if (ticketIdx >= previewImages.length) break;
					const x = col * (settings.width + gap);
					const y = row * (settings.height + gap);
					html += `<div class="ticket" style="left:${x}mm;top:${y}mm;width:${settings.width}mm;height:${settings.height}mm;">`;
					html += `<img src="${previewImages[ticketIdx]}" style="width:100%;height:100%;" />`;
					html += '</div>';
					ticketIdx++;
				}
			}
			html += '</div>';
		}

		html += '</body></html>';
		printWindow.document.write(html);
		printWindow.document.close();
		printWindow.onload = () => printWindow.print();
	}
</script>

<div class="flex h-full flex-col">
	<!-- Controls Bar -->
	<div class="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-4 py-3">
		<div class="flex items-center gap-2">
			<label class="text-xs font-medium text-gray-600">Gap (mm):</label>
			<input type="number" bind:value={gap} min="0" max="20" step="0.5" class="w-16 rounded border border-gray-300 px-2 py-1 text-xs" />
		</div>

		{#if uniqueLabels.length > 0}
			<div class="flex flex-wrap gap-1">
				<button
					onclick={() => (filterLabel = 'all')}
					class="cursor-pointer rounded-full px-3 py-1 text-xs font-medium {filterLabel === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
				>All</button>
				{#each uniqueLabels as label}
					<button
						onclick={() => (filterLabel = label)}
						class="cursor-pointer rounded-full px-3 py-1 text-xs font-medium {filterLabel === label ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
					>{label}</button>
				{/each}
			</div>
		{/if}

		<div class="ml-auto flex gap-2">
			<button
				onclick={generatePreview}
				disabled={generating}
				class="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
			>
				{generating ? 'Generating...' : 'Generate Preview'}
			</button>
			{#if previewImages.length > 0}
				<button
					onclick={handlePrint}
					class="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
				>
					Print
				</button>
			{/if}
		</div>
	</div>

	<!-- Stats -->
	{#if previewImages.length > 0}
		<div class="flex gap-4 bg-gray-50 px-4 py-2 text-xs text-gray-500">
			<span>Tickets: {filteredData.length}</span>
			<span>Pages: {layout.totalPages}</span>
			<span>Per page: {layout.ticketsPerPage}</span>
			<span>Layout: {layout.ticketsPerRow}x{layout.ticketsPerCol}</span>
		</div>
	{/if}

	<!-- Preview Grid -->
	<div class="flex-1 overflow-auto bg-gray-200 p-6">
		{#if previewImages.length > 0}
			<div class="mx-auto grid max-w-5xl gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
				{#each previewImages as src, i}
					<div class="overflow-hidden rounded-lg bg-white shadow-sm">
						<img {src} alt="Ticket {i + 1}" class="w-full" />
						<p class="p-2 text-center text-xs text-gray-400">#{i + 1}</p>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex h-full items-center justify-center">
				<div class="text-center text-gray-400">
					<p class="text-lg">No preview yet</p>
					<p class="mt-1 text-sm">Click "Generate Preview" to see your tickets</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Print Reminder Modal -->
<Modal open={showPrintModal} title="Print Settings Reminder" onclose={() => (showPrintModal = false)}>
	<div class="space-y-4">
		<p class="text-sm text-gray-600">
			For best results, please set your printer margins to <strong>None</strong>
			in the print dialog that will open.
		</p>
		<div class="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
			Settings → More Settings → Margins → None
		</div>
		<div class="flex justify-end gap-2">
			<button onclick={() => (showPrintModal = false)} class="cursor-pointer rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">Cancel</button>
			<button onclick={doPrint} class="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">Continue to Print</button>
		</div>
	</div>
</Modal>
