import { parseCSV } from '$lib/utils/csv-parser';
import { markDirty } from './dirty.svelte';

let csvData = $state<Record<string, string>[]>([]);
let csvHeaders = $state<string[]>([]);

export function getCsvData() {
	return csvData;
}

export function getCsvHeaders() {
	return csvHeaders;
}

export function loadCSV(text: string) {
	const result = parseCSV(text);
	csvData = result.data;
	csvHeaders = result.headers;
	markDirty();
}

export function setCsvDirect(data: Record<string, string>[], headers: string[]) {
	csvData = data;
	csvHeaders = headers;
	markDirty();
}

export function clearCSV() {
	csvData = [];
	csvHeaders = [];
	markDirty();
}

export function getCsvRowCount() {
	return csvData.length;
}
