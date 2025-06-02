import { defaultCode } from "./defaultCode.js";
import { parseCommands } from "./parseCommands.js";
import { runCommands } from "./runCommands.js";

let editor;
let pointerBlink = true;
let isAnimating = false;
let animationInterval = null;
let animationDelay = 250;

// Monaco loader
window.require.config({
	paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs" },
});
window.require(["vs/editor/editor.main"], () => {
	const saved = localStorage.getItem("hub75_code");
	editor = monaco.editor.create(document.getElementById("editor"), {
		value: saved !== null ? saved : defaultCode,
		language: "hub75", // custom language for syntax highlighting
		theme: "vs-dark",
		fontSize: 16,
		minimap: { enabled: false },
	});
	// Register custom language for Hub75 commands
	monaco.languages.register({ id: "hub75" });
	monaco.languages.setMonarchTokensProvider("hub75", {
		tokenizer: {
			root: [
				[/\b([CFZzMmLlHhVvRrP])\b/, "keyword"],
				[/"[^"]*"/, "string"],
				[/#[^\n]*/, "comment"],
				[/\b\d+\b/, "number"],
				[/;/, "delimiter"],
			],
		},
	});
	window.addEventListener("resize", () => {
		editor.layout();
	});
	editor.onDidChangeModelContent(() => {
		localStorage.setItem("hub75_code", editor.getValue());
		updateDisplay();
	});
	editor.onDidChangeCursorPosition(updateDisplay);
	editor.onDidChangeModelContent(stopAnimOnEdit);
	editor.onDidChangeCursorPosition(stopAnimOnEdit);
});

function stopAnimOnEdit() {
	if (isAnimating) stopAnimation();
}

const canvas = document.getElementById("canvas");
const SCREEN_WIDTH = 64;
const SCREEN_HEIGHT = 32;
const SCALE = 10;
canvas.width = SCREEN_WIDTH * SCALE;
canvas.height = SCREEN_HEIGHT * SCALE;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.scale(SCALE, SCALE);
window.devicePixelRatio = 2;

document
	.getElementById("showToCursor")
	.addEventListener("change", updateDisplay);
document
	.getElementById("showPointer")
	.addEventListener("change", updateDisplay);

function updateDisplay() {
	if (editor === undefined) return;
	let code = editor.getValue();
	const showToCursor = document.getElementById("showToCursor").checked;
	if (showToCursor) {
		const pos = editor.getPosition();
		const lines = code.split("\n").slice(0, pos.lineNumber);
		if (pos.column > 1) {
			lines[lines.length - 1] = lines[lines.length - 1].slice(
				0,
				pos.column - 1,
			);
		}
		const upTo = lines.join("\n");
		code = upTo;
	}
	const cmds = parseCommands(code);
	runCommands(
		cmds,
		ctx,
		SCREEN_WIDTH,
		SCREEN_HEIGHT,
		pointerBlink,
		document.getElementById("showPointer")?.checked,
	);
}

document.getElementById("runBtn").onclick = updateDisplay;

const animBtn = document.getElementById("animBtn");
const animDelayInput = document.getElementById("animDelay");
const animDelayVal = document.getElementById("animDelayVal");
animDelayInput.addEventListener("input", function () {
	animationDelay = Number.parseInt(this.value, 10);
	animDelayVal.textContent = this.value;
	if (isAnimating) {
		stopAnimation();
		if (animationDelay > 0) startAnimation();
	}
});

animBtn.onclick = () => {
	if (isAnimating) {
		stopAnimation();
	} else {
		startAnimation();
	}
};

function startAnimation() {
	if (isAnimating || animationDelay === 0) return;
	isAnimating = true;
	animBtn.textContent = "Stop";
	editor.setPosition({ lineNumber: 1, column: 1 });
	const totalLines = editor.getModel().getLineCount();
	let currentLine = 1;
	animationInterval = setInterval(() => {
		if (animationDelay === 0) {
			stopAnimation();
			return;
		}
		if (currentLine > totalLines) {
			stopAnimation();
			return;
		}
		editor.setPosition({ lineNumber: currentLine, column: 1 });
		updateDisplay();
		currentLine++;
	}, animationDelay);
}

function stopAnimation() {
	isAnimating = false;
	animBtn.textContent = "Animation";
	if (animationInterval) clearInterval(animationInterval);
	animationInterval = null;
}

window.onload = () => {
	setTimeout(updateDisplay, 500);
};

(() => {
	const font = new FontFace("Picopixel", "url(./fonts/Picopixel.ttf)");
	font.load().then((loadedFace) => {
		document.fonts.add(loadedFace);
		updateDisplay();
	});
})();

setInterval(() => {
	pointerBlink = !pointerBlink;
	if (document.getElementById("showPointer")?.checked) updateDisplay();
}, 400);
