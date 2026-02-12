<script lang="ts">
	import { getElements, removeElement } from '$lib/stores/elements.svelte';
	import { select, isSelected, clearSelection } from '$lib/stores/selection.svelte';
	import { pushState } from '$lib/stores/history.svelte';

	const elements = $derived(getElements());

	function handleSelect(id: string) {
		select(id);
	}

	function handleRemove(e: Event, id: string) {
		e.stopPropagation();
		pushState();
		removeElement(id);
		clearSelection();
	}

	function getLabel(el: (typeof elements)[0]): string {
		if (el.type === 'text') return el.textFormat;
		return `QR: {${el.placeholder || '?'}}`;
	}
</script>

{#if elements.length > 0}
	<details class="group rounded-lg border border-gray-200" open>
		<summary class="flex cursor-pointer items-center justify-between p-3 text-sm font-semibold text-gray-700">
			<span>🧩 Elements ({elements.length})</span>
			<svg class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</summary>
		<div class="max-h-40 space-y-0.5 overflow-y-auto border-t border-gray-100 p-2">
			{#each elements as el, i}
				<div
					role="button"
					tabindex="0"
					onclick={() => handleSelect(el.id)}
					onkeydown={(e) => e.key === 'Enter' && handleSelect(el.id)}
					class="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs transition-colors {isSelected(el.id) ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-50 text-gray-600'}"
				>
					<span class="truncate">
						<span class="font-mono text-gray-400">{i + 1}.</span>
						{el.type === 'text' ? '📝' : '📱'}
						{getLabel(el)}
					</span>
					<button
						onclick={(e) => handleRemove(e, el.id)}
						class="ml-2 flex-shrink-0 cursor-pointer text-gray-400 hover:text-red-500"
						aria-label="Remove element"
					>
						✕
					</button>
				</div>
			{/each}
		</div>
	</details>
{/if}
