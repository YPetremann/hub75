/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: unfinished */
class Matrix {
	ctx: CanvasRenderingContext2D | null = null;
	width: number = 0;
	height: number = 0;
	_width: number = 0;
	_height: number = 0;
	rotation: number = 0;
	scale: number = 10;
	init(ctx: CanvasRenderingContext2D, width: number, height: number) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this._width = width;
		this._height = height;
		ctx.imageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.scale(this.scale, this.scale);
	}

	writeLine(x0: number, y0: number, x1: number, y1: number, color: string) {
		if (!this.ctx) return;
		// draw a line using ctx canvas API

		x0 = Math.ceil(x0);
		y0 = Math.ceil(y0);
		x1 = Math.floor(x1);
		y1 = Math.floor(y1);
		const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
		if (steep) {
			[x0, y0] = [y0, x0];
			[x1, y1] = [y1, x1];
		}
		if (x0 > x1) {
			[x0, x1] = [x1, x0];
			[y0, y1] = [y1, y0];
		}

		const dx = x1 - x0;
		const dy = Math.abs(y1 - y0);

		let err = dx / 2;
		const ystep = y0 < y1 ? 1 : -1;

		for (; x0 <= x1; x0++) {
			if (steep) {
				this.drawPixel(y0, x0, color);
			} else {
				this.drawPixel(x0, y0, color);
			}
			err -= dy;
			if (err < 0) {
				y0 += ystep;
				err += dx;
			}
		}
	}
	writePixel(x: number, y: number, color: string) {
		this.drawPixel(x, y, color);
	}
	writeFastVLine(x: number, y: number, h: number, color: string) {
		// Overwrite in subclasses if startWrite is defined!
		// Can be just writeLine(x, y, x, y+h-1, color);
		// or writeFillRect(x, y, 1, h, color);
		this.drawFastVLine(x, y, h, color);
	}
	writeFastHLine(x: number, y: number, w: number, color: string) {
		// Overwrite in subclasses if startWrite is defined!
		// Example: writeLine(x, y, x+w-1, y, color);
		// or writeFillRect(x, y, w, 1, color);
		this.drawFastHLine(x, y, w, color);
	}
	writeFillRect(x: number, y: number, w: number, h: number, color: string) {
		// Overwrite in subclasses if desired!
		this.fillRect(x, y, w, h, color);
	}
	drawFastVLine(x: number, y: number, h: number, color: string) {
		this.fillRect(x, y, 1, h, color);
	}
	drawFastHLine(x: number, y: number, w: number, color: string) {
		this.fillRect(x, y, w, 1, color);
	}
	fillRect(x: number, y: number, w: number, h: number, color: string) {
		if (!this.ctx) return;
		// limit to canvas size
		if (w < 0) [w, x] = [-w, x + w];
		if (h < 0) [h, y] = [-h, y + h];
		if (x < 0) [w, x] = [w + x, 0];
		if (y < 0) [h, y] = [h + y, 0];
		if (x + w > this._width) w = this._width - x;
		if (y + h > this._height) h = this._height - y;
		if (w <= 0 || h <= 0) return; // nothing to draw

		this.ctx.fillStyle = color;
		this.ctx.fillRect(Math.ceil(x), Math.ceil(y), Math.floor(w), Math.floor(h));
	}
	fillScreen(color: string) {
		this.fillRect(0, 0, this._width, this._height, color);
	}
	drawLine(x0: number, y0: number, x1: number, y1: number, color: string) {
		if (x0 === x1) {
			if (y0 > y1) [y1, y0] = [y0, y1];
			this.drawFastVLine(x0, y0, y1 - y0 + 1, color);
		} else if (y0 === y1) {
			if (x0 > x1) [x1, x0] = [x0, x1];
			this.drawFastHLine(x0, y0, x1 - x0 + 1, color);
		} else {
			this.writeLine(x0, y0, x1, y1, color);
		}
	}
	drawCircle(x0: number, y0: number, r: number, color: string) {
		// TODO
	}
	fillCircle(x0: number, y0: number, r: number, color: string) {
		const minx = Math.max(x0 - r, 0);
		const maxx = Math.min(x0 + r, this._width - 1);
		const miny = Math.max(y0 - r, 0);
		const maxy = Math.min(y0 + r, this._height - 1);
		r-=0.5
		for (let x = minx; x <= maxx; x++)
			for (let y = miny; y <= maxy; y++)
				if (Math.hypot(x - x0, y - y0) <= r) this.writePixel(x, y, color);
	}
	drawRect(x: number, y: number, w: number, h: number, color: string) {
		this.writeFastHLine(x, y, w, color);
		this.writeFastHLine(x, y + h - 1, w, color);
		this.writeFastVLine(x, y, h, color);
		this.writeFastVLine(x + w - 1, y, h, color);
	}
	drawRoundRect(
		x: number,
		y: number,
		w: number,
		h: number,
		r: number,
		color: string,
	) {
		const max_radius = (w < h ? w : h) / 2; // 1/2 minor axis
		if (r > max_radius) r = max_radius;
		// smarter version
		this.writeFastHLine(x + r, y, w - 2 * r, color); // Top
		this.writeFastHLine(x + r, y + h - 1, w - 2 * r, color); // Bottom
		this.writeFastVLine(x, y + r, h - 2 * r, color); // Left
		this.writeFastVLine(x + w - 1, y + r, h - 2 * r, color); // Right
		// draw four corners
		this.drawCircleHelper(x + r, y + r, r, 1, color);
		this.drawCircleHelper(x + w - r - 1, y + r, r, 2, color);
		this.drawCircleHelper(x + w - r - 1, y + h - r - 1, r, 4, color);
		this.drawCircleHelper(x + r, y + h - r - 1, r, 8, color);
	}
	fillRoundRect(
		x: number,
		y: number,
		w: number,
		h: number,
		r: number,
		color: string,
	) {
		const max_radius = (w < h ? w : h) / 2; // 1/2 minor axis
		if (r > max_radius) r = max_radius;
		// smarter version
		this.writeFillRect(x + r, y, w - 2 * r, h, color);
		// draw four corners
		this.fillCircleHelper(x + w - r - 1, y + r, r, 1, h - 2 * r - 1, color);
		this.fillCircleHelper(x + r, y + r, r, 2, h - 2 * r - 1, color);
	}
	drawTriangle(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		color: string,
	) {
		this.drawLine(x0, y0, x1, y1, color);
		this.drawLine(x1, y1, x2, y2, color);
		this.drawLine(x2, y2, x0, y0, color);
	}
	fillTriangle(x0, y0, x1, y1, x2, y2, color) {
		const minx = Math.max(Math.min(x0, x1, x2), 0);
		const maxx = Math.min(Math.max(x0, x1, x2), this._width - 1);
		const miny = Math.max(Math.min(y0, y1, y2), 0);
		const maxy = Math.min(Math.max(y0, y1, y2), this._height - 1);

		for (let x = minx; x <= maxx; x++)
			for (let y = miny; y <= maxy; y++) {
				// Barycentric coordinates
				const a = ((y1 - y2) * (x - x2) + (x2 - x1) * (y - y2)) /
					((y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2));
				const b = ((y2 - y0) * (x - x2) + (x0 - x2) * (y - y2)) /
					((y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2));
				const c = 1 - a - b;
				if (a >= 0 && b >= 0 && c >= 0) this.writePixel(x, y, color);
			}
				
	}
	drawBitmap(
		x: number,
		y: number,
		bitmap: number[],
		w: number,
		h: number,
		color: string,
		bg: string,
	) {}
	drawXBitmap(
		x: number,
		y: number,
		bitmap: number[],
		w: number,
		h: number,
		color: string,
	) {}
	drawGrayscaleBitmap(
		x: number,
		y: number,
		bitmap: number[],
		w: number,
		h: number,
		mask: number,
	) {}
	drawRGBBitmap(
		x: number,
		y: number,
		bitmap: number[],
		w: number,
		h: number,
		mask: number,
	) {}
	drawChar(
		x: number,
		y: number,
		c: string,
		color: string,
		bg: string,
		sx: number,
		sy: number,
	) {}
	write(c: string) {}
	setTextSize(sx: number, sy: number) {}
	setRotation(x: number) {
		this.rotation = x & 3;
		switch (this.rotation) {
			case 0:
			case 2:
				this._width = this.width;
				this._height = this.height;
				break;
			case 1:
			case 3:
				this._width = this.height;
				this._height = this.width;
				break;
		}
	}
	setFont(font: string) {}
	charBounds(text: string, x: number, y: number) {
		if (!this.ctx) return;
		this.ctx.font = `${7.7}px Picopixel, monospace`;
		const m = this.ctx.measureText(text);
		return [x + m.width, y, m.width, 0];
	}
	getTextBounds(text: string, x: number, y: number) {
		if (!this.ctx) return;
		this.ctx.font = `${7.7}px Picopixel, monospace`;
		const m = this.ctx.measureText(text);
		return [x + m.width, y, m.width, 0];
	}
	invertDisplay(i: boolean) {}

	// ===================

	drawPixel(x: number, y: number, color: string) {
		this.fillRect(x, y, 1, 1, color);
	}
	getPixel(x: number, y: number): string {
		if (!this.ctx) return "#000000";
		const imageData = this.ctx.getImageData(
			x * this.scale,
			y * this.scale,
			1,
			1,
		);
		const [r, g, b] = imageData.data;
		return `rgb(${r},${g},${b})`;
	}
	swapBuffers(copy: boolean) {}
	Color888(r: number, g: number, b: number): string {
		return `rgb(${r},${g},${b})`;
	}

	setCursor(x: number, y: number) {}
	setTextColor(color: string, bg?: string) {}
	setTextWrap(wrap: boolean) {}
	cp437(enable: boolean) {}
	print(x: number, y: number, text: string, color: string) {
		if (!this.ctx) return;
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.font = `${7.7}px Picopixel, monospace`;
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(text, Math.ceil(x), Math.ceil(y) + 3.3);
		this.ctx.restore();
	}

	drawText(x: number, y: number, color: string, text: string) {
		if (!this.ctx) return;
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.font = `${8}px Picopixel, monospace`;
		this.ctx.textBaseline = "top";
		this.ctx.fillText(text, Math.ceil(x), Math.ceil(y));
		this.ctx.restore();
	}
}
const matrix = new Matrix();
export default matrix;
