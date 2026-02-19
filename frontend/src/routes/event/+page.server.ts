import type { PageServerLoad } from './$types';

const BASE_URL = import.meta.env.VITE_PAYLOAD_URL || '';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const search = url.searchParams.get('search') || '';
    const sort = url.searchParams.get('sort') || 'nearest';

    try {
        const params = new URLSearchParams();
        params.set('depth', '1');
        params.set('limit', '100');

        if (search) {
            params.set('where[title][contains]', search);
        }

        params.set('sort', sort === 'farthest' ? '-event_date' : 'event_date');

        const res = await fetch(`${BASE_URL}/api/event/?${params.toString()}`);
        if (res.ok) {
            const data = await res.json();
            return { event: data.docs, search, sort };
        }
    } catch {
        // Payload may not be running
    }
    return { event: [], search, sort };
};
