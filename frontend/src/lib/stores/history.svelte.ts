import type { TicketElement } from '$lib/types/ticket';
import { snapshotElements, restoreElements } from './elements.svelte';

const MAX_UNDO_STATES = 50;

let undoStack = $state<TicketElement[][]>([]);
let redoStack = $state<TicketElement[][]>([]);

export function pushState() {
	undoStack.push(snapshotElements());
	if (undoStack.length > MAX_UNDO_STATES) {
		undoStack.shift();
	}
	redoStack = [];
}

export function undo() {
	if (undoStack.length === 0) return;
	const current = snapshotElements();
	redoStack.push(current);
	const previous = undoStack.pop()!;
	restoreElements(previous);
}

export function redo() {
	if (redoStack.length === 0) return;
	const current = snapshotElements();
	undoStack.push(current);
	const next = redoStack.pop()!;
	restoreElements(next);
}

export function canUndo() {
	return undoStack.length > 0;
}

export function canRedo() {
	return redoStack.length > 0;
}

export function clearHistory() {
	undoStack = [];
	redoStack = [];
}
