let cmdArgs = "";
export function setArgs(args: string) {
	cmdArgs = args;
}

function getArg(indexOrKey: number | string, key?: string): string {
	if (typeof indexOrKey === "string" && typeof key === "undefined") {
		// getArg(key)
		return getArgByKey(indexOrKey);
	} else if (typeof indexOrKey === "number" && typeof key === "string") {
		// getArg(index, key)
		let val = getArgByKey(key);
		if (!val) val = getArgByIndex(indexOrKey);
		return val;
	} else if (typeof indexOrKey === "number") {
		// getArg(index)
		return getArgByIndex(indexOrKey);
	}
	return "";
}

function getArgByIndex(index: number): string {
	let currentIndex = 1; // args are 1-based
	let i = 0;
	while (i < cmdArgs.length) {
		while (i < cmdArgs.length && cmdArgs[i] === " ") i++;
		if (i >= cmdArgs.length) break;
		const start = i;
		if (cmdArgs[i] === '"') {
			i++;
			while (i < cmdArgs.length && cmdArgs[i] !== '"') i++;
			i++; // include closing quote
		} else {
			while (i < cmdArgs.length && cmdArgs[i] !== " ") i++;
		}
		if (currentIndex === index) {
			const ret = cmdArgs.substring(start, i);
			return ret;
		}
		currentIndex++;
	}
	return "";
}

function getArgByKey(key: string): string {
	let i = 0;
	const keyLen = key.length;
	while (i < cmdArgs.length) {
		while (i < cmdArgs.length && cmdArgs[i] === " ") i++;
		if (i >= cmdArgs.length) break;
		if (cmdArgs[i] === '"') {
			i++;
			while (i < cmdArgs.length && cmdArgs[i] !== '"') i++;
			i++;
		} else {
			if (cmdArgs[i] === key[0]) {
				if (cmdArgs.substring(i, i + keyLen) === key) {
					let valueStart = i + keyLen;
					let valueEnd = valueStart;
					if (valueStart < cmdArgs.length && cmdArgs[valueEnd] === '"') {
						valueStart++;
						valueEnd = valueStart;
						while (valueEnd < cmdArgs.length && cmdArgs[valueEnd] !== '"')
							valueEnd++;
						return cmdArgs.substring(valueStart, valueEnd);
					} else {
						while (valueEnd < cmdArgs.length && cmdArgs[valueEnd] !== " ")
							valueEnd++;
						return cmdArgs.substring(valueStart, valueEnd);
					}
				}
			}
			while (i < cmdArgs.length && cmdArgs[i] !== " ") i++;
		}
		i++;
	}
	return "";
}

function argString(val: string, defaultVal: string): string {
	if (!val || val.length === 0) return defaultVal;
	if (val.length >= 2 && val[0] === '"' && val[val.length - 1] === '"') {
		val = val.substring(1, val.length - 1);
	}
	return val;
}

function argInt(val: string, defaultVal: number): number {
	if (!val || val.length === 0) return defaultVal;
	for (let i = 0; i < val.length; i++) {
		if (!/\d/.test(val[i]) && !(i === 0 && val[i] === "-")) return defaultVal;
	}
	return parseInt(val, 10);
}

export { getArg, argString, argInt };
