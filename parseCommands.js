export function parseCommands(input) {
	const cmds = [];
	let buf = "";
	let inStr = false;
	let inComment = false;
	for (let i = 0; i < input.length; ++i) {
		const c = input[i];
		if (c === "\n") inComment = false;
		if (!inStr && c === "#") inComment = true;
		if (inComment) continue;
		if (c === '"') inStr = !inStr;
		if ((c === ";" || c === "\n") && !inStr) {
			if (buf.trim()) cmds.push(buf.trim());
			buf = "";
		} else {
			buf += c;
		}
	}
	if (buf.trim()) cmds.push(buf.trim());
	return cmds;
}
