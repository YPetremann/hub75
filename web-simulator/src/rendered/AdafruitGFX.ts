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
		if (!this.ctx) return
		// draw a line using ctx canvas API

		x0 = Math.ceil(x0);
		y0 = Math.ceil(y0);
		x1 = Math.floor(x1);
		y1 = Math.floor(y1);
		let steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
		if (steep) {
			[x0, y0] = [y0, x0];
			[x1, y1] = [y1, x1];
		}
		if (x0 > x1) {
			[x0, x1] = [x1, x0];
			[y0, y1] = [y1, y0];
		}

		let dx = x1 - x0
		let dy = Math.abs(y1 - y0)

		let err = dx / 2;
		let ystep

		if (y0 < y1) {
			ystep = 1;
		} else {
			ystep = -1;
		}

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
		if (!this.ctx) return
		this.ctx.fillStyle = color;
		this.ctx.fillRect(
			Math.ceil(x), 
			Math.ceil(y), 
			Math.floor(w), 
			Math.floor(h)
		);
	}
	fillScreen(color: string) {
		this.fillRect(0, 0, this._width, this._height, color);
	}
	drawLine(x0: number, y0: number, x1: number, y1: number, color: string) {
		if (x0 == x1) {
			if (y0 > y1) [y1, y0] = [y0, y1];
			this.drawFastVLine(x0, y0, y1 - y0 + 1, color);
		} else if (y0 == y1) {
			if (x0 > x1) [x1, x0] = [x0, x1];
			this.drawFastHLine(x0, y0, x1 - x0 + 1, color);
		} else {
			this.writeLine(x0, y0, x1, y1, color);
		}
	}
	drawCircle(x0: number, y0: number, r: number, color: string) {
		let f = 1 - r;
		let ddF_x = 1;
		let ddF_y = -2 * r;
		let x = 0;
		let y = r;

		this.writePixel(x0, y0 + r, color);
		this.writePixel(x0, y0 - r, color);
		this.writePixel(x0 + r, y0, color);
		this.writePixel(x0 - r, y0, color);

		while (x < y) {
			if (f >= 0) {
				y--;
				ddF_y += 2;
				f += ddF_y;
			}
			x++;
			ddF_x += 2;
			f += ddF_x;

			this.writePixel(x0 + x, y0 + y, color);
			this.writePixel(x0 - x, y0 + y, color);
			this.writePixel(x0 + x, y0 - y, color);
			this.writePixel(x0 - x, y0 - y, color);
			this.writePixel(x0 + y, y0 + x, color);
			this.writePixel(x0 - y, y0 + x, color);
			this.writePixel(x0 + y, y0 - x, color);
			this.writePixel(x0 - y, y0 - x, color);
		}
	}
	drawCircleHelper(x0: number, y0: number, r: number, cornername: number, color: string) {
		let f = 1 - r;
		let ddF_x = 1;
		let ddF_y = -2 * r;
		let x = 0;
		let y = r;

		while (x < y) {
			if (f >= 0) {
				y--;
				ddF_y += 2;
				f += ddF_y;
			}
			x++;
			ddF_x += 2;
			f += ddF_x;
			if (cornername & 0x4) {
				this.writePixel(x0 + x, y0 + y, color);
				this.writePixel(x0 + y, y0 + x, color);
			}
			if (cornername & 0x2) {
				this.writePixel(x0 + x, y0 - y, color);
				this.writePixel(x0 + y, y0 - x, color);
			}
			if (cornername & 0x8) {
				this.writePixel(x0 - y, y0 + x, color);
				this.writePixel(x0 - x, y0 + y, color);
			}
			if (cornername & 0x1) {
				this.writePixel(x0 - y, y0 - x, color);
				this.writePixel(x0 - x, y0 - y, color);
			}
		}
	}
	fillCircle(x0: number, y0: number, r: number, color: string) {
		this.writeFastVLine(x0, y0 - r, 2 * r + 1, color);
		this.fillCircleHelper(x0, y0, r, 3, 0, color);
	}
	fillCircleHelper(x0: number, y0: number, r: number, corners: number, delta: number, color: string) {
		let f = 1 - r;
		let ddF_x = 1;
		let ddF_y = -2 * r;
		let x = 0;
		let y = r;
		let px = x;
		let py = y;

		delta++; // Avoid some +1's in the loop

		while (x < y) {
			if (f >= 0) {
				y--;
				ddF_y += 2;
				f += ddF_y;
			}
			x++;
			ddF_x += 2;
			f += ddF_x;
			// These checks avoid double-drawing certain lines, important
			// for the SSD1306 library which has an INVERT drawing mode.
			if (x < (y + 1)) {
				if (corners & 1)
					this.writeFastVLine(x0 + x, y0 - y, 2 * y + delta, color);
				if (corners & 2)
					this.writeFastVLine(x0 - x, y0 - y, 2 * y + delta, color);
			}
			if (y != py) {
				if (corners & 1)
					this.writeFastVLine(x0 + py, y0 - px, 2 * px + delta, color);
				if (corners & 2)
					this.writeFastVLine(x0 - py, y0 - px, 2 * px + delta, color);
				py = y;
			}
			px = x;
		}
	}
	drawRect(x: number, y: number, w: number, h: number, color: string) {
		this.writeFastHLine(x, y, w, color);
		this.writeFastHLine(x, y + h - 1, w, color);
		this.writeFastVLine(x, y, h, color);
		this.writeFastVLine(x + w - 1, y, h, color);
	}
	drawceilRect(x: number, y: number, w: number, h: number, r: number, color: string) {
		let max_radius = ((w < h) ? w : h) / 2; // 1/2 minor axis
		if (r > max_radius) r = max_radius;
		// smarter version
		this.writeFastHLine(x + r, y, w - 2 * r, color);         // Top
		this.writeFastHLine(x + r, y + h - 1, w - 2 * r, color); // Bottom
		this.writeFastVLine(x, y + r, h - 2 * r, color);         // Left
		this.writeFastVLine(x + w - 1, y + r, h - 2 * r, color); // Right
		// draw four corners
		this.drawCircleHelper(x + r, y + r, r, 1, color);
		this.drawCircleHelper(x + w - r - 1, y + r, r, 2, color);
		this.drawCircleHelper(x + w - r - 1, y + h - r - 1, r, 4, color);
		this.drawCircleHelper(x + r, y + h - r - 1, r, 8, color);
	}
	fillceilRect(x: number, y: number, w: number, h: number, r: number, color: string) {
		let max_radius = ((w < h) ? w : h) / 2; // 1/2 minor axis
		if (r > max_radius) r = max_radius;
		// smarter version
		this.writeFillRect(x + r, y, w - 2 * r, h, color);
		// draw four corners
		this.fillCircleHelper(x + w - r - 1, y + r, r, 1, h - 2 * r - 1, color);
		this.fillCircleHelper(x + r, y + r, r, 2, h - 2 * r - 1, color);
	}
	drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: string) {
		this.drawLine(x0, y0, x1, y1, color);
		this.drawLine(x1, y1, x2, y2, color);
		this.drawLine(x2, y2, x0, y0, color);
	}
	fillTriangle(x0, y0, x1, y1, x2, y2, color) {

		let a, b, y, last;

		// Sort coordinates by Y order (y2 >= y1 >= y0)
		if (y0 > y1) {
			[x0, x1] = [x1, x0];
			[y0, y1] = [y1, y0];
		}
		if (y1 > y2) {
			[y2, y1] = [y1, y2];
			[x2, x1] = [x1, x2];
		}
		if (y0 > y1) {
			[y0, y1] = [y1, y0];
			[x0, x1] = [x1, x0];
		}

		if (y0 == y2) { // Handle awkward all-on-same-line case as its own thing
			a = b = x0;
			if (x1 < a)
				a = x1;
			else if (x1 > b)
				b = x1;
			if (x2 < a)
				a = x2;
			else if (x2 > b)
				b = x2;
			this.writeFastHLine(a, y0, b - a + 1, color);
			return;
		}

		let dx01 = x1 - x0, dy01 = y1 - y0, dx02 = x2 - x0, dy02 = y2 - y0,
			dx12 = x2 - x1, dy12 = y2 - y1;
		let sa = 0, sb = 0;

		// For upper part of triangle, find scanline crossings for segments
		// 0-1 and 0-2.  If y1=y2 (flat-bottomed triangle), the scanline y1
		// is included here (and second loop will be skipped, avoiding a /0
		// error there), otherwise scanline y1 is skipped here and handled
		// in the second loop...which also avoids a /0 error here if y0=y1
		// (flat-topped triangle).
		if (y1 == y2)
			last = y1; // Include y1 scanline
		else
			last = y1 - 1; // Skip it

		for (y = y0; y <= last; y++) {
			a = x0 + sa / dy01;
			b = x0 + sb / dy02;
			sa += dx01;
			sb += dx02;
			/* longhand:
			a = x0 + (x1 - x0) * (y - y0) / (y1 - y0);
			b = x0 + (x2 - x0) * (y - y0) / (y2 - y0);
			*/
			if (a > b)
				[a, b] = [b, a];
			this.writeFastHLine(a, y, b - a + 1, color);
		}

		// For lower part of triangle, find scanline crossings for segments
		// 0-2 and 1-2.  This loop is skipped if y1=y2.
		sa = Math.floor(dx12) * (y - y1);
		sb = Math.floor(dx02) * (y - y0);
		for (; y <= y2; y++) {
			a = x1 + sa / dy12;
			b = x0 + sb / dy02;
			sa += dx12;
			sb += dx02;
			/* longhand:
			a = x1 + (x2 - x1) * (y - y1) / (y2 - y1);
			b = x0 + (x2 - x0) * (y - y0) / (y2 - y0);
			*/
			if (a > b) [a, b] = [b, a];
			this.writeFastHLine(a, y, b - a + 1, color);
		}
	}
	drawBitmap(x: number, y: number, bitmap: number[], w: number, h: number, color: string, bg: string) { }
	drawXBitmap(x: number, y: number, bitmap: number[], w: number, h: number, color: string) { }
	drawGrayscaleBitmap(x: number, y: number, bitmap: number[], w: number, h: number, mask: number) { }
	drawRGBBitmap(x: number, y: number, bitmap: number[], w: number, h: number, mask: number) { }
	drawChar(x: number, y: number, c: string, color: string, bg: string, sx: number, sy: number) { }
	write(c: string) { }
	setTextSize(sx: number, sy: number) { }
	setRotation(x: number) {
		this.rotation = (x & 3);
		switch (this.rotation) {
			case 0:
			case 2:
				this._width = this.width;
				this._height = this.height;
				break;
			case 1:
			case 3:
				this._width = this.height
				this._height = this.width
				break;
		}
	}
	setFont(font: string) { }
	charBounds(text: string, x: number, y: number) {
		if (!this.ctx) return
		this.ctx.font = `${7.7}px Picopixel, monospace`;
		const m = this.ctx.measureText(text)
		return [x + m.width, y, m.width, 0]
	}
	getTextBounds(text: string, x: number, y: number,) {
		if (!this.ctx) return
		this.ctx.font = `${7.7}px Picopixel, monospace`;
		const m = this.ctx.measureText(text)
		return [x + m.width, y, m.width, 0]
	}
	invertDisplay(i:boolean) {}
	
	// ===================

	drawPixel(x: number, y: number, color: string) {
		this.fillRect(x, y, 1, 1, color);
	}
	getPixel(x: number, y: number): string {
		if (!this.ctx) return "#000000";
		const imageData = this.ctx.getImageData(x*this.scale, y*this.scale, 1, 1);
		const [r, g, b] = imageData.data;
	}
	swapBuffers(copy: boolean) { }
	Color888(r: number, g: number, b: number): string {
		return `rgb(${r},${g},${b})`;
	}

	setCursor(x: number, y: number) { }
	setTextColor(color: string, bg?: string) { }
	setTextWrap(wrap: boolean) { }
	cp437(enable: boolean) { }
	print(x: number, y: number, text: string, color: string) {
		if (!this.ctx) return
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.font = `${7.7}px Picopixel, monospace`;
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(text, Math.ceil(x), Math.ceil(y) + 3.3);
		this.ctx.restore();
	}

	drawText(x: number, y: number, color: string, text: string) {
		if (!this.ctx) return
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.font = `${8}px Picopixel, monospace`;
		this.ctx.textBaseline = "top";
		this.ctx.fillText(text, Math.ceil(x), Math.ceil(y));
		this.ctx.restore();
	}
}
const matrix = new Matrix();
export default matrix

