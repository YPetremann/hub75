import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// Custom extractor for classnames in dot notation (e.g. .flex.px-2.py-1)
const dotClassExtractor = (content) => {
	// Match .foo.bar.baz or .foo-bar_baz
	const matches = content.match(/\.[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+/g) || [];
	// Split by dot and flatten
	return matches.flatMap((match) => match.split(".").filter(Boolean));
};

const config: Config = {
	content: [
		"./index.html",
		"./modules/**/*.{ts,js,jsx,tsx}",
		"./utils/**/*.{ts,js,jsx,tsx}",
	],
	safelist: [],
	theme: {
		extend: {},
	},
	plugins: [
		plugin(({ addVariant }) => {
			// No custom variants for now
		}),
	],
	// Custom extractor for dot notation classnames
	extract: {
		DEFAULT: {
			extensions: ["html", "js", "ts", "jsx", "tsx"],
			extract: (content) => {
				// Default Tailwind extractor
				const defaultClasses =
					content.match(/[^"'`\s]*[a-zA-Z0-9_-]+[^"'`\s]*/g) || [];
				// Add dot notation classes
				return [...defaultClasses, ...dotClassExtractor(content)];
			},
		},
	},
};

export default config;
