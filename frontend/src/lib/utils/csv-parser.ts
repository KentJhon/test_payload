/**
 * Parse a single CSV line handling quoted fields with embedded commas.
 */
export function parseCSVLine(line: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (inQuotes) {
			if (char === '"') {
				if (i + 1 < line.length && line[i + 1] === '"') {
					current += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				current += char;
			}
		} else if (char === '"') {
			inQuotes = true;
		} else if (char === ',') {
			result.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}
	result.push(current.trim());
	return result;
}

/**
 * Parse CSV text into headers and data rows.
 */
export function parseCSV(text: string): {
	headers: string[];
	data: Record<string, string>[];
} {
	const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');

	if (lines.length === 0) {
		throw new Error('CSV file is empty');
	}

	const headers = parseCSVLine(lines[0]).filter((h) => h !== '');

	if (headers.length === 0) {
		throw new Error('No valid headers found in CSV');
	}

	const data: Record<string, string>[] = [];
	for (let i = 1; i < lines.length; i++) {
		const values = parseCSVLine(lines[i]);
		const row: Record<string, string> = {};
		let hasData = false;

		for (let j = 0; j < headers.length; j++) {
			const value = j < values.length ? values[j] : '';
			row[headers[j]] = value;
			if (value !== '') hasData = true;
		}

		if (hasData) {
			data.push(row);
		}
	}

	if (data.length === 0) {
		throw new Error('CSV file has headers but no data rows');
	}

	return { headers, data };
}
