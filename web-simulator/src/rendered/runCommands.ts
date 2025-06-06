import matrix from "./AdafruitGFX";

export function runCommands(cmds:string) {
	let col = matrix.color888(255, 255, 255);
	let cx = 0;
	let cy = 0;
	matrix.fillScreen(matrix.color888(0, 0, 0));
	for (const cmd of cmds) {
		let [name, ...args] = cmd.split(/\s+/);
		name = name.trim();
		if (name === "?" || !name) continue;
		if (name === "C" || name === "c") {
			const r = Number.parseInt(args[0]) || 0;
			const v = Number.parseInt(args[1]) || 0;
			const b = Number.parseInt(args[2]) || 0;
			col = matrix.color888(r, v, b);
		} else if (name === "M") {
			cx = Number.parseInt(args[0]) || 0;
			cy = Number.parseInt(args[1]) || 0;
		} else if (name === "m") {
			cx += Number.parseInt(args[0]) || 0;
			cy += Number.parseInt(args[1]) || 0;
		} else if (name === "L") {
			const x = Number.parseInt(args[0]) || 0;
			const y = Number.parseInt(args[1]) || 0;
			matrix.drawLine(cx, cy, x, y, col);
			cx = x;
			cy = y;
		} else if (name === "l") {
			const x = cx + (Number.parseInt(args[0]) || 0);
			const y = cy + (Number.parseInt(args[1]) || 0);
			matrix.drawLine(cx, cy, x, y, col);
			cx = x;
			cy = y;
		} else if (name === "H") {
			const x = Number.parseInt(args[0]) || 0;
			matrix.drawLine(cx, cy, x, cy, col);
			cx = x;
		} else if (name === "h") {
			const x = cx + (Number.parseInt(args[0]) || 0);
			matrix.drawLine(cx, cy, x, cy, col);
			cx = x;
		} else if (name === "V") {
			const y = Number.parseInt(args[0]) || 0;
			matrix.drawLine(cx, cy, cx, y, col);
			cy = y;
		} else if (name === "v") {
			const y = cy + (Number.parseInt(args[0]) || 0);
			matrix.drawLine(cx, cy, cx, y, col);
			cy = y;
		} else if (name === "R") {
			const x = Number.parseInt(args[0]) || 0;
			const y = Number.parseInt(args[1]) || 0;
			matrix.fillRect(cx, cy, x, y, col);
		} else if (name === "r") {
			const x = cx + (Number.parseInt(args[0]) || 0);
			const y = cy + (Number.parseInt(args[1]) || 0);
			matrix.fillRect(cx, cy, x, y, col);
		} else if (name === "P") {
			const t = cmd.match(/P\s+"([^"]*)"/);
			if (t) matrix.drawText(cx, cy, col, t[1]);
		} else if (name === "F" || name === "f") {
			matrix.fillScreen(col);
		}
		// Z/z: no-op, handled by redraw
	}
}
