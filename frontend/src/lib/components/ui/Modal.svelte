<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title?: string;
		onclose: () => void;
		children: Snippet;
	}

	const { open, title = '', onclose, children }: Props = $props();

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
	>
		<div class="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
			{#if title}
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
					<button
						onclick={onclose}
						class="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
						aria-label="Close"
					>
						✕
					</button>
				</div>
			{/if}
			{@render children()}
		</div>
	</div>
{/if}
