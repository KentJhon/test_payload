import { describe, it, expect } from 'vitest';
import { formatTextWithData } from './format';

describe('formatTextWithData', () => {
	it('replaces a single placeholder', () => {
		expect(formatTextWithData('{Name}', { Name: 'Alice' })).toBe('Alice');
	});

	it('replaces multiple placeholders', () => {
		expect(formatTextWithData('{First} {Last}', { First: 'A', Last: 'B' })).toBe('A B');
	});

	it('leaves placeholder unchanged when key is missing', () => {
		expect(formatTextWithData('{Missing}', { Name: 'Alice' })).toBe('{Missing}');
	});

	it('returns original string when no placeholders', () => {
		expect(formatTextWithData('hello world', { Name: 'Alice' })).toBe('hello world');
	});

	it('handles empty data object', () => {
		expect(formatTextWithData('{Name}', {})).toBe('{Name}');
	});
});
