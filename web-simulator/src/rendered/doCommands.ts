import doCommand from "./doCommand";

export default function doCommands(input: string) {
	input += "\n";
	let cmdBufs = "";
	let inString = false;
	let inComment = false;
	for (let i = 0; i < input.length; i++) {
		const c = input[i];
		if (c === "\n") inComment = false;
		if (!inString && c === "#") inComment = true;
		if (inComment) continue;
		if (c === "\n" || (!inString && c === ";")) {
			cmdBufs = cmdBufs.trim();
			if (inString) console.log(`Invalid command: ${cmdBufs}`);
			else if (cmdBufs.length > 0) doCommand(cmdBufs);
			inString = false;
			cmdBufs = "";
		} else {
			if (c === '"') inString = !inString;
			cmdBufs += c;
		}
	}
}
