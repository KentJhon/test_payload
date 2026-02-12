import type { TicketTemplate, TicketSettings } from '$lib/types/ticket';

const STORAGE_KEY = 'veenttix_templates';

const BUILT_IN_TEMPLATES: TicketTemplate[] = [
	{
		id: 'blank-ticket',
		name: 'Blank Ticket',
		builtIn: true,
		backgroundImage: null,
		ticketSettings: { type: 'ticket', width: 226.32258, height: 80, fitMode: 'cover' },
		elements: [],
		labelBlock: null
	},
	{
		id: 'blank-convention-id',
		name: 'Blank Convention ID',
		builtIn: true,
		backgroundImage: null,
		ticketSettings: { type: 'convention-id', width: 101.6, height: 152.4, fitMode: 'cover' },
		elements: [],
		labelBlock: null
	},
	{
		id: 'blank-certificate',
		name: 'Blank Certificate',
		builtIn: true,
		backgroundImage: null,
		ticketSettings: { type: 'certificate', width: 297, height: 210, fitMode: 'cover' },
		elements: [],
		labelBlock: null
	}
];

function loadUserTemplates(): TicketTemplate[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		return JSON.parse(raw);
	} catch {
		return [];
	}
}

function saveUserTemplates(templates: TicketTemplate[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function getAllTemplates(): TicketTemplate[] {
	return [...BUILT_IN_TEMPLATES, ...loadUserTemplates()];
}

export function getTemplate(id: string): TicketTemplate | undefined {
	return getAllTemplates().find((t) => t.id === id);
}

export function saveTemplate(
	name: string,
	backgroundImage: string | null,
	ticketSettings: TicketSettings,
	elements: import('$lib/types/ticket').TicketElement[],
	labelBlockWidth: number | null
): TicketTemplate {
	const template: TicketTemplate = {
		id: `user-${Date.now()}`,
		name,
		builtIn: false,
		backgroundImage,
		ticketSettings: { ...ticketSettings },
		elements: JSON.parse(JSON.stringify(elements)),
		labelBlock: labelBlockWidth ? { width: labelBlockWidth } : null
	};
	const userTemplates = loadUserTemplates();
	userTemplates.push(template);
	saveUserTemplates(userTemplates);
	return template;
}

export function deleteTemplate(id: string) {
	const userTemplates = loadUserTemplates().filter((t) => t.id !== id);
	saveUserTemplates(userTemplates);
}
