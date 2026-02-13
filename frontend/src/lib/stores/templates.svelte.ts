import type { TicketTemplate, TicketSettings, TicketElement, LabelConfig } from '$lib/types/ticket';
import type { PayloadTicketTemplate } from '$lib/types/payload';
import {
	getTemplates,
	createTemplate,
	deleteTemplateById,
	uploadBackgroundImage
} from '$lib/api/templates';

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

let userTemplates = $state<PayloadTicketTemplate[]>([]);
let isLoading = $state(false);
let hasFetched = $state(false);

export function getBuiltInTemplates(): TicketTemplate[] {
	return BUILT_IN_TEMPLATES;
}

export function getUserTemplates(): PayloadTicketTemplate[] {
	return userTemplates;
}

export function getIsLoading() {
	return isLoading;
}

export function getHasFetched() {
	return hasFetched;
}

export function getBuiltInTemplate(id: string): TicketTemplate | undefined {
	return BUILT_IN_TEMPLATES.find((t) => t.id === id);
}

export async function fetchUserTemplates(): Promise<void> {
	if (isLoading) return;
	isLoading = true;
	try {
		const response = await getTemplates({ limit: 100, sort: 'name' });
		userTemplates = response.docs;
		hasFetched = true;
	} catch (err) {
		console.error('Failed to fetch templates:', err);
		hasFetched = true;
	} finally {
		isLoading = false;
	}
}

function dataUrlToFile(dataUrl: string, filename: string): File {
	const [header, base64] = dataUrl.split(',');
	const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
	const bytes = atob(base64);
	const arr = new Uint8Array(bytes.length);
	for (let i = 0; i < bytes.length; i++) {
		arr[i] = bytes.charCodeAt(i);
	}
	return new File([arr], filename, { type: mime });
}

export async function saveTemplateToBackend(
	name: string,
	backgroundImageDataUrl: string | null,
	ticketSettings: TicketSettings,
	elements: TicketElement[],
	labelConfig: LabelConfig,
	csvData: Record<string, string>[],
	csvHeaders: string[]
): Promise<PayloadTicketTemplate> {
	let backgroundImageId: number | null = null;

	if (backgroundImageDataUrl) {
		const file = dataUrlToFile(backgroundImageDataUrl, `template-bg-${Date.now()}.png`);
		const media = await uploadBackgroundImage(file);
		backgroundImageId = media.id;
	}

	const template = await createTemplate({
		name,
		backgroundImage: backgroundImageId,
		ticketSettings,
		elements: JSON.parse(JSON.stringify(elements)),
		labelConfig,
		csvData: csvData.length > 0 ? csvData : null,
		csvHeaders: csvHeaders.length > 0 ? csvHeaders : null
	});

	userTemplates = [...userTemplates, template];
	return template;
}

export async function deleteTemplateFromBackend(id: number): Promise<void> {
	await deleteTemplateById(id);
	userTemplates = userTemplates.filter((t) => t.id !== id);
}
