export function parseAttributes(input) {
	const result = {};
	const regex = /([^=,\s]+)=("(?:[^"\\]|\\.)*"|[^,]*)/g;
	let match: any[] | null;

	// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	while ((match = regex.exec(input)) !== null) {
		const key = match[1];
		let value = match[2];

		// If value is quoted, remove quotes and unescape
		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1).replace(/\\"/g, '"');
		}

		result[key] = value;
	}

	return result;
}

type Children = (HTMLElement | string)[];
type Attributes = Record<string, string>;

export function createElement(
	selector: string,
	attrs: Attributes = {},
	children: Children = [],
): HTMLElement {
	if (Array.isArray(attrs)) {
		children = attrs as Children;
		attrs = {};
	}

	const match = selector.match(
		/^([a-z\-]+) ?(?:#([a-zA-Z0-9_-]+))? ?((?:\.[a-z0-9:_-]+)+)? ?(?:\[(.+)\])?$/i,
	);
	if (!match) throw new Error(`Invalid selector: ${selector}`);

	const tag = match[1] || "div";
	const id = match[2] || "";
	const classes = (match[3] || "").split(".").join(" ").trim();

	// extract attributes from the selector if present in an object
	// a value can be a string or a number, and can be quoted
	// a quoted value can contain commas, and equals, so we need to handle that
	// e.g. `attr1=value1,attr2="value2,dqsd=qsd"`
	const attributes = parseAttributes(match[4] || "");
	console.log("Parsed attributes:", attributes);
	// merge attributes from the selector with the provided attributes
	Object.assign(attributes, attrs);

	const el = document.createElement(tag);
	if (id) el.id = id;
	if (classes) el.className = classes;
	for (const [key, value] of Object.entries(attributes))
		el.setAttribute(key, value);
	for (const child of children) {
		if (typeof child === "string") {
			el.appendChild(document.createTextNode(child));
		} else if (child instanceof HTMLElement) {
			el.appendChild(child);
		} else {
			throw new Error(`Invalid child type: ${typeof child}`);
		}
	}
	return el;
}
