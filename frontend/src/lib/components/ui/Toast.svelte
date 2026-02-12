<script lang="ts">
	import type { Toast } from '$lib/types/ticket';
	import { closeToast } from '$lib/stores/toast.svelte';

	interface Props {
		toast: Toast;
	}

	const { toast }: Props = $props();

	const iconMap: Record<string, string> = {
		success: '✓',
		error: '✕',
		warning: '⚠',
		info: 'ℹ'
	};

	const colorMap: Record<string, string> = {
		success: 'bg-emerald-50 border-emerald-400 text-emerald-800',
		error: 'bg-red-50 border-red-400 text-red-800',
		warning: 'bg-amber-50 border-amber-400 text-amber-800',
		info: 'bg-blue-50 border-blue-400 text-blue-800'
	};
</script>

<div
	class="flex items-start gap-3 rounded-lg border-l-4 p-4 shadow-lg {colorMap[toast.type]}"
	role="alert"
>
	<span class="mt-0.5 text-lg font-bold">{iconMap[toast.type]}</span>
	<div class="flex-1">
		<p class="font-semibold">{toast.title}</p>
		{#if toast.message}
			<p class="mt-1 text-sm opacity-80">{toast.message}</p>
		{/if}
	</div>
	<button
		onclick={() => closeToast(toast.id)}
		class="cursor-pointer text-lg opacity-50 transition-opacity hover:opacity-100"
		aria-label="Close"
	>
		✕
	</button>
</div>
