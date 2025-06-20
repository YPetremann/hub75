import matrix from "./AdafruitGFX";
import doCommands from "./doCommands";

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;
let initialized = false;
export default function renderFrame(
	ctx: CanvasRenderingContext2D,
	code: string,
) {
	console.clear();
	if (!initialized) {
		matrix.init(ctx, SCREEN_WIDTH, SCREEN_HEIGHT);
		initialized = true;
	}
	doCommands(code);
}
