import type { TicketElement, TextElement, QrElement } from '$lib/types/ticket';
import { createDefaultTextElement, createDefaultQrElement } from '$lib/types/ticket';
import { markDirty } from './dirty.svelte';

let elements = $state<TicketElement[]>([]);

export function getElements() {
	return elements;
}

export function addTextElement(overrides?: Partial<TextElement>): TextElement {
	const el = createDefaultTextElement(overrides);
	elements.push(el);
	markDirty();
	return el;
}

export function addQrElement(overrides?: Partial<QrElement>): QrElement {
	const el = createDefaultQrElement(overrides);
	elements.push(el);
	markDirty();
	return el;
}

export function updateElement(id: string, updates: Partial<TicketElement>) {
	const idx = elements.findIndex((e) => e.id === id);
	if (idx !== -1) {
		elements[idx] = { ...elements[idx], ...updates } as TicketElement;
		markDirty();
	}
}

export function removeElement(id: string) {
	elements = elements.filter((e) => e.id !== id);
	markDirty();
}

export function removeElements(ids: Set<string>) {
	elements = elements.filter((e) => !ids.has(e.id));
	markDirty();
}

export function clearElements() {
	elements = [];
	markDirty();
}

export function setElements(els: TicketElement[]) {
	elements = [...els];
	markDirty();
}

export function getElementByIndex(idx: number): TicketElement | undefined {
	return elements[idx];
}

export function getElementById(id: string): TicketElement | undefined {
	return elements.find((e) => e.id === id);
}

export function snapshotElements(): TicketElement[] {
	return JSON.parse(JSON.stringify(elements));
}

export function restoreElements(snapshot: TicketElement[]) {
	elements = snapshot;
	markDirty();
}
