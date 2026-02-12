<script lang="ts">
	import { getCsvHeaders, getCsvRowCount } from '$lib/stores/csv.svelte';
	import { addTextElement } from '$lib/stores/elements.svelte';
	import { pushState } from '$lib/stores/history.svelte';
	import { showToast } from '$lib/stores/toast.svelte';

	const headers = $derived(getCsvHeaders());
	const rowCount = $derived(getCsvRowCount());

	function handleDragStart(e: DragEvent, header: string) {
		e.dataTransfer?.setData('text/plain', `{${header}}`);
	}

	function handleClick(header: string) {
		pushState();
		addTextElement({ textFormat: `{${header}}`, position: { x: 20, y: 20 } });
		showToast('info', 'Element added', `{${header}}`);
	}
</script>

{#if headers.length > 0}
	<details class="group rounded-lg border border-gray-200" open>
		<summary class="flex cursor-pointer items-center justify-between p-3 text-sm font-semibold text-gray-700">
			<span>📊 CSV Headers ({rowCount} rows)</span>
			<svg class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</summary>
		<div class="flex flex-wrap gap-1.5 border-t border-gray-100 p-3">
			{#each headers as header}
				<button
					draggable="true"
					ondragstart={(e) => handleDragStart(e, header)}
					onclick={() => handleClick(header)}
					class="cursor-pointer rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 active:bg-indigo-200"
				>
					{header}
				</button>
			{/each}
		</div>
	</details>
{/if}
