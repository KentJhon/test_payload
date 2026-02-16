import { describe, it, expect } from 'vitest';
import { calculateLayout, getCutLinePositions } from './print-layout';

describe('calculateLayout', () => {
	it('ticket type: 2x4, landscape', () => {
		const layout = calculateLayout(226, 80, 2, 'ticket', 10);
		expect(layout.ticketsPerRow).toBe(2);
		expect(layout.ticketsPerCol).toBe(4);
		expect(layout.orientation).toBe('landscape');
	});

	it('convention-id type: 2x2, portrait', () => {
		const layout = calculateLayout(101.6, 152.4, 2, 'convention-id', 4);
		expect(layout.ticketsPerRow).toBe(2);
		expect(layout.ticketsPerCol).toBe(2);
		expect(layout.orientation).toBe('portrait');
	});

	it('certificate type: 1x1, landscape', () => {
		const layout = calculateLayout(297, 210, 0, 'certificate', 3);
		expect(layout.ticketsPerRow).toBe(1);
		expect(layout.ticketsPerCol).toBe(1);
		expect(layout.orientation).toBe('landscape');
	});

	it('others type: dynamic calculation', () => {
		const layout = calculateLayout(50, 50, 2, 'others', 20);
		expect(layout.ticketsPerRow).toBeGreaterThanOrEqual(1);
		expect(layout.ticketsPerCol).toBeGreaterThanOrEqual(1);
		expect(layout.orientation).toBe('portrait');
	});

	it('calculates total pages correctly', () => {
		const layout = calculateLayout(226, 80, 2, 'ticket', 10);
		expect(layout.ticketsPerPage).toBe(8);
		expect(layout.totalPages).toBe(2);
	});
});

describe('getCutLinePositions', () => {
	it('returns correct number of vertical and horizontal lines', () => {
		const layout = calculateLayout(226, 80, 2, 'ticket', 8);
		const lines = getCutLinePositions(226, 80, 2, layout);
		expect(lines.vertical).toHaveLength(3);
		expect(lines.horizontal).toHaveLength(5);
	});

	it('positions include margins', () => {
		const layout = calculateLayout(226, 80, 2, 'ticket', 8);
		const lines = getCutLinePositions(226, 80, 2, layout);
		// First line: MARGIN + 0*(ticketWidth+gap) - gap/2 = 10 - 1 = 9
		expect(lines.vertical[0]).toBe(9);
		expect(lines.horizontal[0]).toBe(9);
	});
});
