import matrix, { setupSurface } from "./AdafruitGFX";
import { parseCommands } from "./parseCommands";
import { runCommands } from "./runCommands";

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;

export function updateDisplay(ctx:CanvasRenderingContext2D, code:string) {
  matrix.init(ctx, SCREEN_WIDTH, SCREEN_HEIGHT);
	const cmds = parseCommands(code);
	runCommands(cmds);
}