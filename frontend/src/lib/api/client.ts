const BASE_URL = import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

export async function payloadFetch<T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		},
		...options
	});

	if (!res.ok) {
		throw new Error(`API error: ${res.status} ${res.statusText}`);
	}

	return res.json();
}
