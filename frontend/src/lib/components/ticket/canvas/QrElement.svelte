<script lang="ts">
	import type { QrElement as QrElementType } from '$lib/types/ticket';
	import { updateElement } from '$lib/stores/elements.svelte';
	import { pushState } from '$lib/stores/history.svelte';
	import { draggable } from '$lib/actions/draggable';
	import { resizable } from '$lib/actions/resizable';
	import { onMount } from 'svelte';

	interface Props {
		element: QrElementType;
		selected: boolean;
		zoom: number;
		previewData: Record<string, string> | null;
		onclick: (e: MouseEvent) => void;
	}

	const { element, selected, zoom, previewData, onclick }: Props = $props();

	let canvasEl: HTMLCanvasElement;

	const codeValue = $derived(
		previewData && element.placeholder
			? (previewData[element.placeholder] || 'SAMPLE')
			: 'SAMPLE'
	);

	$effect(() => {
		if (!canvasEl) return;
		renderCode(codeValue);
	});

	async function renderCode(value: string) {
		if (!canvasEl) return;

		if (element.codeSettings.codeType === 'qr') {
			const QRious = (await import('qrious')).default;
			new QRious({
				element: canvasEl,
				value,
				size: Math.min(element.size.width, element.size.height),
				background: element.codeSettings.background,
				foreground: element.codeSettings.foreground
			});
		} else {
			try {
				const JsBarcode = (await import('jsbarcode')).default;
				JsBarcode(canvasEl, value, {
					format: element.codeSettings.barcodeType || 'CODE128',
					width: 2,
					height: element.size.height * 0.7,
					displayValue: true,
					background: element.codeSettings.background,
					lineColor: element.codeSettings.foreground,
					fontSize: 12
				});
			} catch {
				const ctx = canvasEl.getContext('2d');
				if (ctx) {
					canvasEl.width = element.size.width;
					canvasEl.height = element.size.height;
					ctx.fillStyle = '#f3f4f6';
					ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
					ctx.fillStyle = '#9ca3af';
					ctx.font = '10px Arial';
					ctx.textAlign = 'center';
					ctx.fillText('Invalid barcode', canvasEl.width / 2, canvasEl.height / 2);
				}
			}
		}
	}

	function handleDrag(id: string, x: number, y: number) {
		updateElement(id, { position: { x, y } });
	}

	function handleDragEnd() {
		pushState();
	}

	function handleResize(id: string, width: number, height: number) {
		updateElement(id, { size: { width, height } });
	}

	function handleResizeEnd() {
		pushState();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="absolute cursor-move {selected ? 'ring-2 ring-indigo-500' : ''}"
	style="
		left: {element.position.x}px;
		top: {element.position.y}px;
		width: {element.size.width}px;
		height: {element.size.height}px;
	"
	{onclick}
	onkeydown={() => {}}
	use:draggable={{
		zoom,
		getElementId: () => element.id,
		getPosition: () => element.position,
		onDrag: handleDrag,
		onDragEnd: handleDragEnd
	}}
>
	<canvas
		bind:this={canvasEl}
		class="h-full w-full object-contain"
	></canvas>

	{#if selected}
		<div
			class="resize-handle absolute -right-1.5 -bottom-1.5 z-10 h-3 w-3 cursor-se-resize rounded-sm bg-indigo-600"
			use:resizable={{
				zoom,
				getElementId: () => element.id,
				getSize: () => element.size,
				onResize: handleResize,
				onResizeEnd: handleResizeEnd
			}}
		></div>
	{/if}
</div>
