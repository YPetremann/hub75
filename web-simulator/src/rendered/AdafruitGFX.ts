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

	swapBuffers(copy:boolean) {}
	Color888(r:number, g:number, b:number):string {
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
    this.writeLine(x0, y0, x1, y1, color);
	}

	writeLine (x0:number, y0:number, x1:number, y1:number, color:string){
		if (!this.ctx) return
		// draw a line using ctx canvas API
				
		x0 = Math.round(x0);
		y0 = Math.round(y0);
		x1 = Math.round(x1);
		y1 = Math.round(y1);
		let steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
		if (steep) {
			[x0, y0] = [y0, x0];
			[x1, y1] = [y1, x1];
		}
		if(x0>x1){
			[x0, x1] = [x1, x0];
			[y0, y1] = [y1, y0];
		}
		
		let dx = x1 - x0
		let dy = Math.abs(y1 - y0)

		let err = dx / 2;
		let ystep

		if(y0 < y1) {
			ystep = 1;
		} else {
			ystep = -1;
		}

		for(; x0 <= x1; x0++) {
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
	getTextBounds(text:string, x:number, y:number,) {
		if (!this.ctx) return
		this.ctx.font = `${7.7}px Picopixel, monospace`;
		const m= this.ctx.measureText(text)
		return [x+m.width,y, m.width, 5]
	}
	setTextSize(sx:number, sy:number) {}
	setFont(font:string) {}
	setCursor(x:number, y:number) {}
	setTextColor(color:string,bg?:string) {}
	setTextWrap(wrap:boolean) {}
	cp437(enable:boolean) {}
	print(x:number,y:number,text:string, color:string) {
		if (!this.ctx) return
		this.ctx.save();
		this.ctx.fillStyle = color;
		this.ctx.font = `${7.7}px Picopixel, monospace`;
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(text, x, y+3.3);
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

