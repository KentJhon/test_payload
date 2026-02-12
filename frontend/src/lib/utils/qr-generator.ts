/**
 * Generate a QR code on a canvas element.
 */
export async function generateQR(
	canvas: HTMLCanvasElement,
	value: string,
	size: number,
	background = '#ffffff',
	foreground = '#000000'
): Promise<void> {
	const QRious = (await import('qrious')).default;
	new QRious({
		element: canvas,
		value,
		size,
		background,
		foreground
	});
}

/**
 * Add a logo overlay to a QR code canvas.
 */
export async function addLogoToQR(
	canvas: HTMLCanvasElement,
	qrSize: number,
	logoSrc?: string
): Promise<void> {
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const logoSize = Math.max(12, Math.min(qrSize * 0.2, 40));
	const x = (qrSize - logoSize) / 2;
	const y = (qrSize - logoSize) / 2;
	const padding = 4;

	// White background with rounded corners
	ctx.fillStyle = '#ffffff';
	const bgX = x - padding;
	const bgY = y - padding;
	const bgSize = logoSize + padding * 2;
	const radius = 4;

	ctx.beginPath();
	ctx.moveTo(bgX + radius, bgY);
	ctx.lineTo(bgX + bgSize - radius, bgY);
	ctx.quadraticCurveTo(bgX + bgSize, bgY, bgX + bgSize, bgY + radius);
	ctx.lineTo(bgX + bgSize, bgY + bgSize - radius);
	ctx.quadraticCurveTo(bgX + bgSize, bgY + bgSize, bgX + bgSize - radius, bgY + bgSize);
	ctx.lineTo(bgX + radius, bgY + bgSize);
	ctx.quadraticCurveTo(bgX, bgY + bgSize, bgX, bgY + bgSize - radius);
	ctx.lineTo(bgX, bgY + radius);
	ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
	ctx.closePath();
	ctx.fill();

	if (logoSrc) {
		return new Promise<void>((resolve) => {
			const img = new Image();
			img.onload = () => {
				ctx.drawImage(img, x, y, logoSize, logoSize);
				resolve();
			};
			img.onerror = () => resolve();
			img.src = logoSrc;
		});
	}
}
