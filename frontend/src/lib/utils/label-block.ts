import type { LabelConfig, LabelBlockRenderData } from '$lib/types/ticket';

/**
 * Get label block render data for a specific row, or null if no label column is set.
 */
export function getLabelBlockRenderData(
	rowData: Record<string, string>,
	config: LabelConfig
): LabelBlockRenderData | null {
	if (!config.labelColumn || !rowData[config.labelColumn]) {
		return null;
	}

	const value = rowData[config.labelColumn];
	const color = config.labelColors[value] || '#cccccc';

	return {
		left: 0,
		width: config.labelBlockWidth,
		color,
		value,
		rightEnabled: config.rightBlockEnabled,
		rightWidth: config.rightBlockWidth
	};
}
