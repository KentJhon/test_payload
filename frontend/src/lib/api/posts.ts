import type { PayloadPost, PaginatedResponse } from '$lib/types/payload';
import { payloadFetch } from './client';

export async function getPosts(
	params?: { limit?: number; page?: number; sort?: string }
): Promise<PaginatedResponse<PayloadPost>> {
	const searchParams = new URLSearchParams();
	if (params?.limit) searchParams.set('limit', String(params.limit));
	if (params?.page) searchParams.set('page', String(params.page));
	if (params?.sort) searchParams.set('sort', params.sort);

	const query = searchParams.toString();
	return payloadFetch(`/api/posts${query ? `?${query}` : ''}`);
}

export async function getPost(id: number): Promise<PayloadPost> {
	return payloadFetch(`/api/posts/${id}`);
}
