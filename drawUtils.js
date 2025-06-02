export function color888(r, g, b) {
	return `rgb(${r},${g},${b})`;
}

export function drawPixel(ctx, x, y, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, 1, 1);
}

export function drawText(ctx, x, y, color, text) {
	ctx.save();
	ctx.fillStyle = color;
	ctx.font = `${8}px Picopixel, monospace`;
	ctx.textBaseline = "top";
	ctx.fillText(text, x, y);
	ctx.restore();
}

export function drawLine(ctx, x0, y0, x1, y1, color) {
	let _x0 = Math.round(x0);
	let _y0 = Math.round(y0);
	const _x1 = Math.round(x1);
	const _y1 = Math.round(y1);
	const dx = Math.abs(_x1 - _x0);
	const sx = _x0 < _x1 ? 1 : -1;
	const dy = -Math.abs(_y1 - _y0);
	const sy = _y0 < _y1 ? 1 : -1;
	let err = dx + dy;
	let e2;
	while (true) {
		drawPixel(ctx, _x0, _y0, color);
		if (_x0 === _x1 && _y0 === _y1) break;
		e2 = 2 * err;
		if (e2 >= dy) {
			err += dy;
			_x0 += sx;
		}
		if (e2 <= dx) {
			err += dx;
			_y0 += sy;
		}
	}
}

export function drawRect(ctx, x0, y0, x1, y1, color) {
	const x = Math.min(x0, x1);
	const y = Math.min(y0, y1);
	const w = Math.abs(x1 - x0);
	const h = Math.abs(y1 - y0);
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w + 1, h + 1);
}
