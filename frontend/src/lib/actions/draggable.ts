export interface DraggableOptions {
	zoom: number;
	onDragStart?: (id: string) => void;
	onDrag?: (id: string, x: number, y: number) => void;
	onDragEnd?: (id: string, x: number, y: number) => void;
	getElementId: () => string;
	getPosition: () => { x: number; y: number };
	disabled?: boolean;
}

export function draggable(node: HTMLElement, initialOptions: DraggableOptions) {
	let options = initialOptions;
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let startPosX = 0;
	let startPosY = 0;

	function getClientPos(e: MouseEvent | TouchEvent): { cx: number; cy: number } {
		if ('touches' in e) {
			return { cx: e.touches[0].clientX, cy: e.touches[0].clientY };
		}
		return { cx: e.clientX, cy: e.clientY };
	}

	function onPointerDown(e: MouseEvent | TouchEvent) {
		if (options.disabled) return;
		const target = e.target as HTMLElement;
		if (target.classList.contains('resize-handle') || target.classList.contains('rotate-handle')) return;

		e.stopPropagation();
		isDragging = true;

		const { cx, cy } = getClientPos(e);
		const pos = options.getPosition();
		startX = cx;
		startY = cy;
		startPosX = pos.x;
		startPosY = pos.y;

		options.onDragStart?.(options.getElementId());

		window.addEventListener('mousemove', onPointerMove);
		window.addEventListener('mouseup', onPointerUp);
		window.addEventListener('touchmove', onPointerMove, { passive: false });
		window.addEventListener('touchend', onPointerUp);
	}

	function onPointerMove(e: MouseEvent | TouchEvent) {
		if (!isDragging) return;
		e.preventDefault();

		const { cx, cy } = getClientPos(e);
		const dx = (cx - startX) / options.zoom;
		const dy = (cy - startY) / options.zoom;

		const newX = Math.max(0, startPosX + dx);
		const newY = Math.max(0, startPosY + dy);

		options.onDrag?.(options.getElementId(), newX, newY);
	}

	function onPointerUp() {
		if (!isDragging) return;
		isDragging = false;

		const pos = options.getPosition();
		options.onDragEnd?.(options.getElementId(), pos.x, pos.y);

		window.removeEventListener('mousemove', onPointerMove);
		window.removeEventListener('mouseup', onPointerUp);
		window.removeEventListener('touchmove', onPointerMove);
		window.removeEventListener('touchend', onPointerUp);
	}

	node.addEventListener('mousedown', onPointerDown);
	node.addEventListener('touchstart', onPointerDown, { passive: false });

	return {
		update(newOptions: DraggableOptions) {
			options = newOptions;
		},
		destroy() {
			node.removeEventListener('mousedown', onPointerDown);
			node.removeEventListener('touchstart', onPointerDown);
		}
	};
}
