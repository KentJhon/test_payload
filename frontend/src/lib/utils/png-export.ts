import type { TicketElement, BackgroundFitMode, LabelConfig } from '$lib/types/ticket';
import { renderTicketToCanvas } from './canvas-render';

interface ExportOptions {
	width: number;
	height: number;
	quality: number;
	backgroundImage?: string | null;
	fitMode?: BackgroundFitMode;
	labelConfig?: LabelConfig;
}

/**
 * Export all CSV rows as PNG tickets packaged in a ZIP file.
 */
export async function exportAllAsPNG(
	elements: TicketElement[],
	csvData: Record<string, string>[],
	options: ExportOptions,
	onProgress?: (current: number, total: number) => void
): Promise<Blob> {
	const JSZip = (await import('jszip')).default;
	const zip = new JSZip();

	for (let i = 0; i < csvData.length; i++) {
		onProgress?.(i + 1, csvData.length);

		const canvas = await renderTicketToCanvas(elements, csvData[i], options);

		const blob = await new Promise<Blob>((resolve) => {
			canvas.toBlob((b) => resolve(b!), 'image/png');
		});

		const firstValue = Object.values(csvData[i])[0] || `ticket_${i + 1}`;
		const safeName = firstValue.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
		zip.file(`${safeName}.png`, blob);

		// Yield to prevent UI freeze
		if (i % 8 === 0) {
			await new Promise((r) => setTimeout(r, 0));
		}
	}

	return zip.generateAsync({ type: 'blob' });
}
