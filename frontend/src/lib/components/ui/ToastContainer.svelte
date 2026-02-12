<script lang="ts">
	import Toast from './Toast.svelte';
	import { getToasts } from '$lib/stores/toast.svelte';

	const toasts = $derived(getToasts());
</script>

{#if toasts.length > 0}
	<div class="fixed right-4 top-20 z-[9999] flex w-80 flex-col gap-2">
		{#each toasts as toast (toast.id)}
			<Toast {toast} />
		{/each}
	</div>
{/if}
