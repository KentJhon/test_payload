import { markDirty } from './dirty.svelte';

let ticketGap = $state(2);

export function getTicketGap() {
	return ticketGap;
}

export function setTicketGap(value: number) {
	ticketGap = Math.max(0, Math.min(20, value));
	markDirty();
}
