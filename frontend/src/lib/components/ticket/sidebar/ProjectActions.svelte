<script lang="ts">
	import { getElements, setElements, clearElements } from '$lib/stores/elements.svelte';
	import { getCsvData, getCsvHeaders, loadCSV, clearCSV } from '$lib/stores/csv.svelte';
	import { getTicketSettings, setAllSettings } from '$lib/stores/ticket-settings.svelte';
	import { getBackgroundImage, setBackgroundImage } from '$lib/stores/canvas.svelte';
	import { getLabelConfig, setAllLabelConfig } from '$lib/stores/labels.svelte';
	import { clearSelection } from '$lib/stores/selection.svelte';
	import { clearHistory } from '$lib/stores/history.svelte';
	import { showToast } from '$lib/stores/toast.svelte';
	import type { ProjectData } from '$lib/types/ticket';

	function exportProject() {
		const project: ProjectData = {
			version: '1.0',
			timestamp: new Date().toISOString(),
			csvData: getCsvData(),
			csvHeaders: getCsvHeaders(),
			backgroundImage: getBackgroundImage(),
			ticketSettings: getTicketSettings(),
			printSettings: { ticketGap: 2 },
			labelSettings: getLabelConfig(),
			elements: JSON.parse(JSON.stringify(getElements()))
		};

		const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		const now = new Date();
		a.href = url;
		a.download = `ticket_project_${now.toISOString().slice(0, 10)}.veenttix`;
		a.click();
		URL.revokeObjectURL(url);

		showToast('success', 'Project exported');
	}

	function importProject(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const project: ProjectData = JSON.parse(ev.target?.result as string);

				setAllSettings(project.ticketSettings);
				setElements(project.elements);
				setBackgroundImage(project.backgroundImage);
				setAllLabelConfig(project.labelSettings);
				clearHistory();
				clearSelection();

				showToast('success', 'Project imported');
			} catch {
				showToast('error', 'Import failed', 'Invalid project file');
			}
		};
		reader.readAsText(file);
		input.value = '';
	}

	function clearProject() {
		if (!confirm('Clear all? This cannot be undone.')) return;
		clearElements();
		clearCSV();
		setBackgroundImage(null);
		clearSelection();
		clearHistory();
		showToast('info', 'Project cleared');
	}
</script>

<details class="group rounded-lg border border-gray-200">
	<summary class="flex cursor-pointer items-center justify-between p-3 text-sm font-semibold text-gray-700">
		<span>💾 Project</span>
		<svg class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</summary>
	<div class="space-y-2 border-t border-gray-100 p-3">
		<div class="flex gap-1">
			<button onclick={exportProject} class="flex-1 cursor-pointer rounded bg-indigo-50 px-2 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100">Export</button>
			<label class="flex flex-1 cursor-pointer items-center justify-center rounded bg-indigo-50 px-2 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100">
				Import
				<input type="file" accept=".veenttix" onchange={importProject} class="hidden" />
			</label>
			<button onclick={clearProject} class="cursor-pointer rounded bg-red-50 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Clear</button>
		</div>
	</div>
</details>
