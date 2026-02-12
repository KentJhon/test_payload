export interface ResizableOptions {
	zoom: number;
	onResize?: (id: string, width: number, height: number) => void;
	onResizeEnd?: (id: string) => void;
	getElementId: () => string;
	getSize: () => { width: number; height: number };
}

export function resizable(node: HTMLElement, initialOptions: ResizableOptions) {
	let options = initialOptions;
	let isResizing = false;
	let startX = 0;
	let startY = 0;
	let startW = 0;
	let startH = 0;

	function onPointerDown(e: MouseEvent | TouchEvent) {
		e.stopPropagation();
		e.preventDefault();
		isResizing = true;

		const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
		const size = options.getSize();
		startX = clientX;
		startY = clientY;
		startW = size.width;
		startH = size.height;

		window.addEventListener('mousemove', onPointerMove);
		window.addEventListener('mouseup', onPointerUp);
		window.addEventListener('touchmove', onPointerMove, { passive: false });
		window.addEventListener('touchend', onPointerUp);
	}

	function onPointerMove(e: MouseEvent | TouchEvent) {
		if (!isResizing) return;
		e.preventDefault();

		const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
		const dx = (clientX - startX) / options.zoom;
		const dy = (clientY - startY) / options.zoom;

		const newW = Math.max(50, startW + dx);
		const newH = Math.max(20, startH + dy);

		options.onResize?.(options.getElementId(), newW, newH);
	}

	function onPointerUp() {
		if (!isResizing) return;
		isResizing = false;
		options.onResizeEnd?.(options.getElementId());

		window.removeEventListener('mousemove', onPointerMove);
		window.removeEventListener('mouseup', onPointerUp);
		window.removeEventListener('touchmove', onPointerMove);
		window.removeEventListener('touchend', onPointerUp);
	}

	node.addEventListener('mousedown', onPointerDown);
	node.addEventListener('touchstart', onPointerDown, { passive: false });

	return {
		update(newOptions: ResizableOptions) {
			options = newOptions;
		},
		destroy() {
			node.removeEventListener('mousedown', onPointerDown);
			node.removeEventListener('touchstart', onPointerDown);
		}
	};
}
