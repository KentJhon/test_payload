import type { PayloadMedia, PaginatedResponse } from '$lib/types/payload';
import { payloadFetch } from './client';

export async function getMedia(
	params?: { limit?: number; page?: number }
): Promise<PaginatedResponse<PayloadMedia>> {
	const searchParams = new URLSearchParams();
	if (params?.limit) searchParams.set('limit', String(params.limit));
	if (params?.page) searchParams.set('page', String(params.page));

	const query = searchParams.toString();
	return payloadFetch(`/api/media${query ? `?${query}` : ''}`);
}
