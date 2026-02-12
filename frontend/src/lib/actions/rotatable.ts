export interface RotatableOptions {
	onRotate?: (id: string, degrees: number) => void;
	onRotateEnd?: (id: string) => void;
	getElementId: () => string;
	getCenter: () => { x: number; y: number };
}

export function rotatable(node: HTMLElement, initialOptions: RotatableOptions) {
	let options = initialOptions;
	let isRotating = false;

	function onPointerDown(e: MouseEvent | TouchEvent) {
		e.stopPropagation();
		e.preventDefault();
		isRotating = true;

		window.addEventListener('mousemove', onPointerMove);
		window.addEventListener('mouseup', onPointerUp);
		window.addEventListener('touchmove', onPointerMove, { passive: false });
		window.addEventListener('touchend', onPointerUp);
	}

	function onPointerMove(e: MouseEvent | TouchEvent) {
		if (!isRotating) return;
		e.preventDefault();

		const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
		const center = options.getCenter();
		const angle = Math.atan2(clientY - center.y, clientX - center.x);
		let degrees = (angle * 180) / Math.PI + 90;

		// Shift key for 45-degree snapping
		if ('shiftKey' in e && e.shiftKey) {
			degrees = Math.round(degrees / 45) * 45;
		}

		// Normalize to 0-359
		degrees = ((degrees % 360) + 360) % 360;

		options.onRotate?.(options.getElementId(), degrees);
	}

	function onPointerUp() {
		if (!isRotating) return;
		isRotating = false;
		options.onRotateEnd?.(options.getElementId());

		window.removeEventListener('mousemove', onPointerMove);
		window.removeEventListener('mouseup', onPointerUp);
		window.removeEventListener('touchmove', onPointerMove);
		window.removeEventListener('touchend', onPointerUp);
	}

	node.addEventListener('mousedown', onPointerDown);
	node.addEventListener('touchstart', onPointerDown, { passive: false });

	return {
		update(newOptions: RotatableOptions) {
			options = newOptions;
		},
		destroy() {
			node.removeEventListener('mousedown', onPointerDown);
			node.removeEventListener('touchstart', onPointerDown);
		}
	};
}
