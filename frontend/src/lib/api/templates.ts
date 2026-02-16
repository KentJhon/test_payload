import type { PayloadTicketTemplate, PayloadMedia, PaginatedResponse } from '$lib/types/payload';
import { payloadFetch } from './client';

export async function getTemplates(
	params?: { limit?: number; page?: number; sort?: string }
): Promise<PaginatedResponse<PayloadTicketTemplate>> {
	const searchParams = new URLSearchParams();
	searchParams.set('limit', String(params?.limit ?? 100));
	if (params?.page) searchParams.set('page', String(params.page));
	if (params?.sort) searchParams.set('sort', params.sort);

	const query = searchParams.toString();
	return payloadFetch(`/api/ticket-templates${query ? `?${query}` : ''}`);
}

export async function getTemplateById(id: number): Promise<PayloadTicketTemplate> {
	return payloadFetch(`/api/ticket-templates/${id}`);
}

export async function createTemplate(
	data: Omit<PayloadTicketTemplate, 'id' | 'updatedAt' | 'createdAt'>
): Promise<PayloadTicketTemplate> {
	const res = await payloadFetch<{ doc: PayloadTicketTemplate; message: string }>('/api/ticket-templates', {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return res.doc;
}

export async function updateTemplate(
	id: number,
	data: Partial<Omit<PayloadTicketTemplate, 'id' | 'updatedAt' | 'createdAt'>>
): Promise<PayloadTicketTemplate> {
	const res = await payloadFetch<{ doc: PayloadTicketTemplate; message: string }>(`/api/ticket-templates/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
	return res.doc;
}

export async function deleteTemplateById(id: number): Promise<PayloadTicketTemplate> {
	const res = await payloadFetch<{ doc: PayloadTicketTemplate; message: string }>(`/api/ticket-templates/${id}`, {
		method: 'DELETE',
	});
	return res.doc;
}

export async function uploadBackgroundImage(file: File): Promise<PayloadMedia> {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('_payload', JSON.stringify({ alt: `Template background: ${file.name}` }));

	const res = await payloadFetch<{ doc: PayloadMedia; message: string }>('/api/media', {
		method: 'POST',
		body: formData,
	});
	return res.doc;
}
