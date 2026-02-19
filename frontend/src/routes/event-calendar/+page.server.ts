import type { PageServerLoad } from './$types';

const BASE_URL = import.meta.env.VITE_PAYLOAD_URL || '';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const month = parseInt(url.searchParams.get('month') ?? String(new Date().getMonth()));
	const year = parseInt(url.searchParams.get('year') ?? String(new Date().getFullYear()));

	// Build first/last day of month in YYYY-MM-DD format
	const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
	const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	const endOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

	try {
		// Fetch events that overlap with this month:
		// start_date <= endOfMonth AND end_date >= startOfMonth
		const params = new URLSearchParams({
			'where[start_date][less_than_equal]': endOfMonth,
			'where[end_date][greater_than_equal]': startOfMonth,
			limit: '100',
			sort: 'start_date',
		});

		const res = await fetch(`${BASE_URL}/api/calendar-events?${params}`);
		if (res.ok) {
			const data = await res.json();
			return { events: data.docs, month, year };
		}
	} catch {
		// Payload may not be running
	}

	return { events: [], month, year };
};
