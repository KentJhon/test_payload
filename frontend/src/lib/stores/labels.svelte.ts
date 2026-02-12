import type { LabelConfig } from '$lib/types/ticket';

let config = $state<LabelConfig>({
	labelColumn: '',
	labelColors: {},
	labelBlockWidth: 50,
	rightBlockEnabled: false,
	rightBlockWidth: 20
});

export function getLabelConfig() {
	return config;
}

export function setLabelColumn(column: string) {
	config.labelColumn = column;
	config.labelColors = {};
}

export function assignLabelColor(value: string, color: string) {
	config.labelColors = { ...config.labelColors, [value]: color };
}

export function setLabelBlockWidth(width: number) {
	config.labelBlockWidth = Math.max(5, Math.min(80, width));
}

export function setRightBlockEnabled(enabled: boolean) {
	config.rightBlockEnabled = enabled;
}

export function setRightBlockWidth(width: number) {
	config.rightBlockWidth = Math.max(5, Math.min(80, width));
}

export function setAllLabelConfig(c: LabelConfig) {
	config.labelColumn = c.labelColumn;
	config.labelColors = { ...c.labelColors };
	config.labelBlockWidth = c.labelBlockWidth;
	config.rightBlockEnabled = c.rightBlockEnabled;
	config.rightBlockWidth = c.rightBlockWidth;
}

export function getUniqueLabelValues(csvData: Record<string, string>[]): string[] {
	if (!config.labelColumn) return [];
	const values = new Set<string>();
	for (const row of csvData) {
		const val = row[config.labelColumn];
		if (val) values.add(val);
	}
	return Array.from(values);
}
