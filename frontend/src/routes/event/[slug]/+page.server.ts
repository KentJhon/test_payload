import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const BASE_URL = import.meta.env.VITE_PAYLOAD_URL || '';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const slug = params.slug;

	const res = await fetch(`${BASE_URL}/api/event?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`);

	if (!res.ok) {
		throw error(500, 'Failed to fetch event');
	}

	const data = await res.json();

	if (!data.docs || data.docs.length === 0) {
		throw error(404, 'Event not found');
	}

	return { event: data.docs[0] };
};
