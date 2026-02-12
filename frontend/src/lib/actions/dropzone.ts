export interface DropzoneOptions {
	onDrop: (text: string, x: number, y: number) => void;
	zoom: number;
}

export function dropzone(node: HTMLElement, initialOptions: DropzoneOptions) {
	let options = initialOptions;

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		node.classList.add('drop-active');
	}

	function onDragLeave() {
		node.classList.remove('drop-active');
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		node.classList.remove('drop-active');

		const text = e.dataTransfer?.getData('text/plain');
		if (!text) return;

		const rect = node.getBoundingClientRect();
		const x = (e.clientX - rect.left) / options.zoom;
		const y = (e.clientY - rect.top) / options.zoom;

		options.onDrop(text, x, y);
	}

	node.addEventListener('dragover', onDragOver);
	node.addEventListener('dragleave', onDragLeave);
	node.addEventListener('drop', onDrop);

	return {
		update(newOptions: DropzoneOptions) {
			options = newOptions;
		},
		destroy() {
			node.removeEventListener('dragover', onDragOver);
			node.removeEventListener('dragleave', onDragLeave);
			node.removeEventListener('drop', onDrop);
		}
	};
}
