class Matrix{
	ctx: CanvasRenderingContext2D | null = null;
	width: number=0;
	height: number=0;
	init(ctx:CanvasRenderingContext2D,width:number, height:number) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		ctx.imageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.scale(10, 10);
	}

	color888(r:number, g:number, b:number) {
		return `rgb(${r},${g},${b})`;
	}
	
	drawPixel(x:number, y:number, color:string) {
		this.fillRect(x, y, 1, 1,color);
	}
	drawFastVLine(x:number, y:number, h:number, color:string) {
		this.fillRect(x, y, 1, h,color);
	}
	drawFastHLine(x:number, y:number, w:number, color:string) {
		this.fillRect(x, y, w, 1,color);
	}
	fillRect(x:number, y:number, w:number, h:number, color:string) {
		if (!this.ctx) return
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, w, h);
	}
	fillScreen(color:string) {
		this.fillRect(0, 0, this.width, this.height, color);
	}
	drawLine(x0:number, y0:number, x1:number, y1:number, color:string) {
		if (!this.ctx) return
		let _x0 = Math.round(x0);
		let _y0 = Math.round(y0);
		const _x1 = Math.round(x1);
		const _y1 = Math.round(y1);
		const dx = Math.abs(_x1 - _x0);
		const sx = _x0 < _x1 ? 1 : -1;
		const dy = -Math.abs(_y1 - _y0);
		const sy = _y0 < _y1 ? 1 : -1;
		let err = dx + dy;
		let e2: number;
		while (true) {
			this.drawPixel(_x0, _y0, color);
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
	drawCircle(x:number, y:number, r:number, color:string) {}
	drawCircleHelper(x:number, y:number, r:number, corner:number, color:string) {}
	fillCircle(x:number, y:number, r:number, color:string) {}
	fillCircleHelper(x:number, y:number, r:number, corner:number, delta:number, color:string) {}
	drawTriangle(x0:number, y0:number, x1:number, y1:number, x2:number, y2:number, color:string) {}
	fillTriangle(x0:number, y0:number, x1:number, y1:number, x2:number, y2:number, color:string) {}
	drawRoundRect(x:number, y:number, w:number, h:number, r:number, color:string) {}
	fillRoundRect(x:number, y:number, w:number, h:number, r:number, color:string) {}
	drawBitmap(x:number, y:number, bitmap:number[], w:number,h:number, color:string,bg:string) {}
	drawXBitmap(x:number, y:number, bitmap:number[], w:number,h:number, color:string){}
	drawGrayscaleBitmap(x:number, y:number, bitmap:number[], w:number,h:number, mask:number){}
	drawRGBBitmap(x:number, y:number, bitmap:number[], w:number,h:number, mask:number){}
	drawChar(x:number, y:number, c:string, color:string, bg:string,sx:number,sy:number){}
	getTextBounds(text:string, x:number, y:number, x1:number, y1:number, w:number, h:number) {}
	setTextSize(sx:number, sy:number) {}
	setFont(font:string) {}
	setCursor(x:number, y:number) {}
	setTextColor(color:string,bg:string) {}
	setTextWrap(wrap:boolean) {}
	cp437(enable:boolean) {}
	print(text:string) {
		if (!this.ctx) return
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.font = `${8}px Picopixel, monospace`;
		this.ctx.textBaseline = "top";
		this.ctx.fillText(text, x, y);
		this.ctx.restore();
	}
	
	drawText(x:number, y:number, color:string, text:string) {
		if (!this.ctx) return
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.font = `${8}px Picopixel, monospace`;
		this.ctx.textBaseline = "top";
		this.ctx.fillText(text, x, y);
		this.ctx.restore();
	}
}
const matrix = new Matrix();
export default matrix

