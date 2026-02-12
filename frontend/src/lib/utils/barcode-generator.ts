import type { BarcodeFormat } from '$lib/types/ticket';

/**
 * Generate a barcode on a canvas element.
 */
export async function generateBarcode(
	canvas: HTMLCanvasElement,
	value: string,
	options: {
		format?: BarcodeFormat;
		width?: number;
		height?: number;
		background?: string;
		foreground?: string;
		displayValue?: boolean;
	} = {}
): Promise<void> {
	const JsBarcode = (await import('jsbarcode')).default;

	try {
		JsBarcode(canvas, value, {
			format: options.format || 'CODE128',
			width: options.width || 2,
			height: options.height || 80,
			displayValue: options.displayValue !== false,
			background: options.background || '#ffffff',
			lineColor: options.foreground || '#000000',
			fontSize: 12
		});
	} catch {
		// Fallback to CODE128 if format fails
		JsBarcode(canvas, value, {
			format: 'CODE128',
			width: options.width || 2,
			height: options.height || 80,
			displayValue: options.displayValue !== false,
			background: options.background || '#ffffff',
			lineColor: options.foreground || '#000000',
			fontSize: 12
		});
	}
}
