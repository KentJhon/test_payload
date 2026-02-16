import type { BackgroundFitMode } from '$lib/types/ticket';
import { markDirty } from './dirty.svelte';

let zoom = $state(1);
let backgroundImage = $state<string | null>(null);
let backgroundFitMode = $state<BackgroundFitMode>('cover');

export function getZoom() {
	return zoom;
}

export function setZoom(value: number) {
	zoom = Math.max(0.25, Math.min(3, value));
}

export function zoomIn() {
	setZoom(zoom + 0.25);
}

export function zoomOut() {
	setZoom(zoom - 0.25);
}

export function resetZoom() {
	zoom = 1;
}

export function getBackgroundImage() {
	return backgroundImage;
}

export function setBackgroundImage(dataUrl: string | null) {
	backgroundImage = dataUrl;
	markDirty();
}

export function getBackgroundFitMode() {
	return backgroundFitMode;
}

export function setBackgroundFitMode(mode: BackgroundFitMode) {
	backgroundFitMode = mode;
	markDirty();
}
