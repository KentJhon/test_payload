import { describe, it, expect } from 'vitest';
import { createDefaultTextElement, createDefaultQrElement, TICKET_PRESETS } from './ticket';

describe('createDefaultTextElement', () => {
	it('returns correct defaults', () => {
		const el = createDefaultTextElement();
		expect(el.type).toBe('text');
		expect(el.position).toEqual({ x: 10, y: 10 });
		expect(el.size).toEqual({ width: 150, height: 30 });
		expect(el.rotation).toBe(0);
		expect(el.textFormat).toBe('{Text}');
		expect(el.styles.fontSize).toBe(16);
		expect(el.styles.color).toBe('#000000');
		expect(el.containInBox).toBe(true);
		expect(el.id).toBeDefined();
	});

	it('applies overrides', () => {
		const el = createDefaultTextElement({ textFormat: '{Name}', rotation: 45 });
		expect(el.textFormat).toBe('{Name}');
		expect(el.rotation).toBe(45);
		expect(el.type).toBe('text');
	});
});

describe('createDefaultQrElement', () => {
	it('returns correct defaults', () => {
		const el = createDefaultQrElement();
		expect(el.type).toBe('qr');
		expect(el.size).toEqual({ width: 80, height: 80 });
		expect(el.placeholder).toBe('');
		expect(el.codeSettings.codeType).toBe('qr');
		expect(el.codeSettings.background).toBe('#ffffff');
		expect(el.codeSettings.foreground).toBe('#000000');
	});

	it('applies overrides', () => {
		const el = createDefaultQrElement({ placeholder: '{ID}' });
		expect(el.placeholder).toBe('{ID}');
		expect(el.type).toBe('qr');
	});
});

describe('TICKET_PRESETS', () => {
	it('has all expected types', () => {
		expect(TICKET_PRESETS).toHaveProperty('ticket');
		expect(TICKET_PRESETS).toHaveProperty('convention-id');
		expect(TICKET_PRESETS).toHaveProperty('certificate');
		expect(TICKET_PRESETS).toHaveProperty('others');
	});
});
