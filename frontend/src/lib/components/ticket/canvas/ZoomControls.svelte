<script lang="ts">
	import { getZoom, zoomIn, zoomOut, resetZoom } from '$lib/stores/canvas.svelte';

	const zoom = $derived(getZoom());
</script>

<div class="mb-4 flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
	<button onclick={zoomOut} class="cursor-pointer rounded px-2 py-0.5 text-sm font-medium text-gray-600 hover:bg-gray-100" aria-label="Zoom out">−</button>
	<button onclick={resetZoom} class="cursor-pointer rounded px-2 py-0.5 text-xs font-medium text-gray-500 hover:bg-gray-100">
		{Math.round(zoom * 100)}%
	</button>
	<button onclick={zoomIn} class="cursor-pointer rounded px-2 py-0.5 text-sm font-medium text-gray-600 hover:bg-gray-100" aria-label="Zoom in">+</button>
</div>
