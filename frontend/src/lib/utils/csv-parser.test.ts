import { describe, it, expect } from 'vitest';
import { parseCSVLine, parseCSV } from './csv-parser';

describe('parseCSVLine', () => {
	it('parses a simple comma-separated line', () => {
		expect(parseCSVLine('a,b,c')).toEqual(['a', 'b', 'c']);
	});

	it('handles quoted fields with embedded commas', () => {
		expect(parseCSVLine('a,"b,c",d')).toEqual(['a', 'b,c', 'd']);
	});

	it('handles escaped quotes (double-quote)', () => {
		expect(parseCSVLine('a,"he said ""hi""",c')).toEqual(['a', 'he said "hi"', 'c']);
	});

	it('trims whitespace from unquoted fields', () => {
		expect(parseCSVLine(' a , b , c ')).toEqual(['a', 'b', 'c']);
	});
});

describe('parseCSV', () => {
	it('parses multi-row CSV with headers', () => {
		const csv = 'Name,Age\nAlice,30\nBob,25';
		const result = parseCSV(csv);
		expect(result.headers).toEqual(['Name', 'Age']);
		expect(result.data).toEqual([
			{ Name: 'Alice', Age: '30' },
			{ Name: 'Bob', Age: '25' }
		]);
	});

	it('throws error on empty CSV', () => {
		expect(() => parseCSV('')).toThrow('CSV file is empty');
	});

	it('throws error on headers-only CSV', () => {
		expect(() => parseCSV('Name,Age')).toThrow('CSV file has headers but no data rows');
	});

	it('fills missing values with empty strings', () => {
		const csv = 'A,B,C\n1';
		const result = parseCSV(csv);
		expect(result.data[0]).toEqual({ A: '1', B: '', C: '' });
	});

	it('skips blank rows', () => {
		const csv = 'Name\nAlice\n\n\nBob';
		const result = parseCSV(csv);
		expect(result.data).toHaveLength(2);
	});
});
