import type { TicketType, BackgroundFitMode, TicketSettings } from '$lib/types/ticket';
import { TICKET_PRESETS } from '$lib/types/ticket';
import { markDirty } from './dirty.svelte';

let settings = $state<TicketSettings>({
	type: 'ticket',
	width: TICKET_PRESETS.ticket.width,
	height: TICKET_PRESETS.ticket.height,
	fitMode: 'cover'
});

export function getTicketSettings() {
	return settings;
}

export function setTicketType(type: TicketType) {
	settings.type = type;
	if (type !== 'others') {
		const preset = TICKET_PRESETS[type];
		settings.width = preset.width;
		settings.height = preset.height;
	}
	markDirty();
}

export function setCustomSize(width: number, height: number) {
	settings.width = width;
	settings.height = height;
	markDirty();
}

export function setFitMode(mode: BackgroundFitMode) {
	settings.fitMode = mode;
	markDirty();
}

export function setAllSettings(s: TicketSettings) {
	settings.type = s.type;
	settings.width = s.width;
	settings.height = s.height;
	settings.fitMode = s.fitMode;
	markDirty();
}
