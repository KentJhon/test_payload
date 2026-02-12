<script lang="ts">
	import type { QrElement, BarcodeFormat } from '$lib/types/ticket';
	import { updateElement } from '$lib/stores/elements.svelte';
	import { getCsvHeaders } from '$lib/stores/csv.svelte';
	import { pushState } from '$lib/stores/history.svelte';

	interface Props {
		element: QrElement;
	}

	const { element }: Props = $props();
	const headers = $derived(getCsvHeaders());

	function update(updates: Partial<QrElement>) {
		pushState();
		updateElement(element.id, updates);
	}

	function updateSettings(updates: Partial<QrElement['codeSettings']>) {
		update({ codeSettings: { ...element.codeSettings, ...updates } });
	}
</script>

<div class="space-y-3">
	<!-- Data Column -->
	<div>
		<label class="mb-1 block text-xs font-medium text-gray-500">Data Column</label>
		<select value={element.placeholder} onchange={(e) => update({ placeholder: (e.target as HTMLSelectElement).value })} class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs">
			{#each headers as header}
				<option value={header}>{header}</option>
			{/each}
		</select>
	</div>

	<!-- Code Type -->
	<div>
		<label class="mb-1 block text-xs font-medium text-gray-500">Type</label>
		<select value={element.codeSettings.codeType} onchange={(e) => updateSettings({ codeType: (e.target as HTMLSelectElement).value as any })} class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs">
			<option value="qr">QR Code</option>
			<option value="barcode">Barcode</option>
		</select>
	</div>

	{#if element.codeSettings.codeType === 'barcode'}
		<div>
			<label class="mb-1 block text-xs font-medium text-gray-500">Barcode Format</label>
			<select value={element.codeSettings.barcodeType || 'CODE128'} onchange={(e) => updateSettings({ barcodeType: (e.target as HTMLSelectElement).value as BarcodeFormat })} class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs">
				<option value="CODE128">CODE128</option>
				<option value="CODE39">CODE39</option>
				<option value="EAN13">EAN-13</option>
				<option value="EAN8">EAN-8</option>
				<option value="UPC">UPC-A</option>
				<option value="ITF14">ITF-14</option>
			</select>
		</div>
	{/if}

	<!-- Colors -->
	<div class="flex gap-2">
		<div class="flex-1">
			<label class="mb-1 block text-xs font-medium text-gray-500">Background</label>
			<input type="color" value={element.codeSettings.background} onchange={(e) => updateSettings({ background: (e.target as HTMLInputElement).value })} class="h-8 w-full cursor-pointer rounded border-0" />
		</div>
		<div class="flex-1">
			<label class="mb-1 block text-xs font-medium text-gray-500">Foreground</label>
			<input type="color" value={element.codeSettings.foreground} onchange={(e) => updateSettings({ foreground: (e.target as HTMLInputElement).value })} class="h-8 w-full cursor-pointer rounded border-0" />
		</div>
	</div>

	<!-- Size -->
	<div class="flex gap-2">
		<div class="flex-1">
			<label class="mb-1 block text-xs font-medium text-gray-500">Width</label>
			<input type="number" value={element.size.width} onchange={(e) => update({ size: { ...element.size, width: Math.max(20, parseInt((e.target as HTMLInputElement).value) || 80) } })} min="20" class="w-full rounded border border-gray-300 px-2 py-1 text-xs" />
		</div>
		<div class="flex-1">
			<label class="mb-1 block text-xs font-medium text-gray-500">Height</label>
			<input type="number" value={element.size.height} onchange={(e) => update({ size: { ...element.size, height: Math.max(20, parseInt((e.target as HTMLInputElement).value) || 80) } })} min="20" class="w-full rounded border border-gray-300 px-2 py-1 text-xs" />
		</div>
	</div>
</div>
