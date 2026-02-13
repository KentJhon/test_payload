import type { PayloadMessage, PaginatedResponse } from '$lib/types/payload';
import { payloadFetch } from './client';

export async function getMessages(
	params?: { limit?: number; page?: number; sort?: string }
): Promise<PaginatedResponse<PayloadMessage>> {
	const searchParams = new URLSearchParams();
	if (params?.limit) searchParams.set('limit', String(params.limit));
	if (params?.page) searchParams.set('page', String(params.page));
	if (params?.sort) searchParams.set('sort', params.sort);

	const query = searchParams.toString();
	return payloadFetch(`/api/messages${query ? `?${query}` : ''}`);
}

export async function sendMessage(
	sender: string,
	content: string
): Promise<PayloadMessage> {
	return payloadFetch<PayloadMessage>('/api/messages', {
		method: 'POST',
		body: JSON.stringify({ sender, content }),
	});
}
