import { describe, it, expect } from 'vitest';
import { computeVerticalY } from './text-fitting';

describe('computeVerticalY', () => {
	const boxY = 100;
	const boxH = 200;
	const contentHeight = 60;

	it('top alignment returns boxY', () => {
		expect(computeVerticalY(boxY, boxH, contentHeight, 1, 'top')).toBe(100);
	});

	it('center alignment returns centered offset', () => {
		expect(computeVerticalY(boxY, boxH, contentHeight, 1, 'center')).toBe(170);
	});

	it('bottom alignment returns bottom offset', () => {
		expect(computeVerticalY(boxY, boxH, contentHeight, 1, 'bottom')).toBe(240);
	});
});
