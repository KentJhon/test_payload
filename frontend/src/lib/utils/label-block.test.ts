import { describe, it, expect } from 'vitest';
import { getLabelBlockRenderData } from './label-block';
import type { LabelConfig } from '$lib/types/ticket';

function makeConfig(overrides?: Partial<LabelConfig>): LabelConfig {
	return {
		labelColumn: 'Type',
		labelColors: { VIP: '#ff0000', Regular: '#00ff00' },
		labelBlockWidth: 20,
		rightBlockEnabled: false,
		rightBlockWidth: 20,
		...overrides
	};
}

describe('getLabelBlockRenderData', () => {
	it('returns null when no labelColumn set', () => {
		const result = getLabelBlockRenderData({ Type: 'VIP' }, makeConfig({ labelColumn: '' }));
		expect(result).toBeNull();
	});

	it('returns null when row does not have the label column value', () => {
		const result = getLabelBlockRenderData({ Other: 'x' }, makeConfig());
		expect(result).toBeNull();
	});

	it('returns correct render data with color from config', () => {
		const result = getLabelBlockRenderData({ Type: 'VIP' }, makeConfig());
		expect(result).toEqual({
			left: 0,
			width: 20,
			color: '#ff0000',
			value: 'VIP',
			rightEnabled: false,
			rightWidth: 20
		});
	});

	it('falls back to #cccccc when color not in config', () => {
		const result = getLabelBlockRenderData({ Type: 'Unknown' }, makeConfig());
		expect(result!.color).toBe('#cccccc');
	});

	it('respects rightBlockEnabled and rightBlockWidth', () => {
		const config = makeConfig({ rightBlockEnabled: true, rightBlockWidth: 30 });
		const result = getLabelBlockRenderData({ Type: 'VIP' }, config);
		expect(result!.rightEnabled).toBe(true);
		expect(result!.rightWidth).toBe(30);
	});
});
