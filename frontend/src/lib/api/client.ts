export const BASE_URL = import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

export async function payloadFetch<T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

	const isFormData = options?.body instanceof FormData;

	const res = await fetch(url, {
		...options,
		headers: {
			...(isFormData ? {} : { 'Content-Type': 'application/json' }),
			...options?.headers
		}
	});

	if (!res.ok) {
		const errorBody = await res.text().catch(() => '');
		throw new Error(`API error: ${res.status} ${res.statusText} - ${errorBody}`);
	}

	return res.json();
}
