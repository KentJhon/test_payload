<script lang="ts">
	import { getAllTemplates, getTemplate, saveTemplate, deleteTemplate } from '$lib/stores/templates.svelte';
	import { setAllSettings, getTicketSettings } from '$lib/stores/ticket-settings.svelte';
	import { setElements, getElements, clearElements } from '$lib/stores/elements.svelte';
	import { setBackgroundImage } from '$lib/stores/canvas.svelte';
	import { setLabelBlockWidth, getLabelConfig } from '$lib/stores/labels.svelte';
	import { clearHistory } from '$lib/stores/history.svelte';
	import { showToast } from '$lib/stores/toast.svelte';

	let selectedTemplateId = $state('');
	let templates = $derived(getAllTemplates());

	function loadSelected() {
		if (!selectedTemplateId) return;
		const tmpl = getTemplate(selectedTemplateId);
		if (!tmpl) return;

		setAllSettings(tmpl.ticketSettings);
		setElements(tmpl.elements);
		setBackgroundImage(tmpl.backgroundImage);
		if (tmpl.labelBlock) {
			setLabelBlockWidth(tmpl.labelBlock.width);
		}
		clearHistory();
		showToast('success', 'Template loaded', tmpl.name);
	}

	function saveAsCurrent() {
		const name = prompt('Template name:');
		if (!name) return;

		saveTemplate(
			name,
			null,
			getTicketSettings(),
			getElements(),
			getLabelConfig().labelBlockWidth
		);
		showToast('success', 'Template saved', name);
	}

	function deleteCurrent() {
		if (!selectedTemplateId) return;
		const tmpl = getTemplate(selectedTemplateId);
		if (!tmpl || tmpl.builtIn) return;

		if (confirm(`Delete "${tmpl.name}"?`)) {
			deleteTemplate(selectedTemplateId);
			selectedTemplateId = '';
			showToast('success', 'Template deleted');
		}
	}
</script>

<details class="group rounded-lg border border-gray-200">
	<summary class="flex cursor-pointer items-center justify-between p-3 text-sm font-semibold text-gray-700">
		<span>📋 Templates</span>
		<svg class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</summary>
	<div class="space-y-2 border-t border-gray-100 p-3">
		<select bind:value={selectedTemplateId} class="w-full rounded border border-gray-300 px-2 py-1.5 text-xs">
			<option value="">Select template...</option>
			{#each templates as tmpl}
				<option value={tmpl.id}>{tmpl.name}{tmpl.builtIn ? ' (Built-in)' : ''}</option>
			{/each}
		</select>
		<div class="flex gap-1">
			<button onclick={loadSelected} disabled={!selectedTemplateId} class="flex-1 cursor-pointer rounded bg-indigo-50 px-2 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed">Load</button>
			<button onclick={saveAsCurrent} class="flex-1 cursor-pointer rounded bg-emerald-50 px-2 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">Save Current</button>
			<button onclick={deleteCurrent} disabled={!selectedTemplateId} class="cursor-pointer rounded bg-red-50 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed">Delete</button>
		</div>
	</div>
</details>
