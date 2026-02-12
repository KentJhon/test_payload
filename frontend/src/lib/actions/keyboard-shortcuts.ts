export interface ShortcutHandlers {
	onUndo?: () => void;
	onRedo?: () => void;
	onSelectAll?: () => void;
	onCopy?: () => void;
	onCut?: () => void;
	onPaste?: () => void;
	onDelete?: () => void;
	onZoomIn?: () => void;
	onZoomOut?: () => void;
	onZoomReset?: () => void;
}

export function shortcuts(node: HTMLElement, initialHandlers: ShortcutHandlers) {
	let handlers = initialHandlers;

	function onKeyDown(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
		if (isInput) return;

		const ctrl = e.ctrlKey || e.metaKey;

		if (ctrl && e.key === 'z' && !e.shiftKey) {
			e.preventDefault();
			handlers.onUndo?.();
		} else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
			e.preventDefault();
			handlers.onRedo?.();
		} else if (ctrl && e.key === 'a') {
			e.preventDefault();
			handlers.onSelectAll?.();
		} else if (ctrl && e.key === 'c') {
			e.preventDefault();
			handlers.onCopy?.();
		} else if (ctrl && e.key === 'x') {
			e.preventDefault();
			handlers.onCut?.();
		} else if (ctrl && e.key === 'v') {
			e.preventDefault();
			handlers.onPaste?.();
		} else if (e.key === 'Delete' || e.key === 'Backspace') {
			e.preventDefault();
			handlers.onDelete?.();
		} else if (ctrl && (e.key === '=' || e.key === '+')) {
			e.preventDefault();
			handlers.onZoomIn?.();
		} else if (ctrl && e.key === '-') {
			e.preventDefault();
			handlers.onZoomOut?.();
		} else if (ctrl && e.key === '0') {
			e.preventDefault();
			handlers.onZoomReset?.();
		}
	}

	node.addEventListener('keydown', onKeyDown);

	return {
		update(newHandlers: ShortcutHandlers) {
			handlers = newHandlers;
		},
		destroy() {
			node.removeEventListener('keydown', onKeyDown);
		}
	};
}
