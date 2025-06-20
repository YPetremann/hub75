let init = false;

export function registerHub75(monaco: typeof import("monaco-editor")) {
	if (init) return;
	init = true;

	monaco.languages.register({ id: "hub75" });
	monaco.languages.setMonarchTokensProvider("hub75", {
		tokenizer: {
			root: [
				[/\b([CcTtFZzMmLlHhVvRrP])\b/, "keyword"],
				[/"[^"]*"/, "string"],
				[/#[^\n]*/, "comment"],
				[/\b\d+\b/, "number"],
				[/;/, "delimiter"],
			],
		},
	});
}
