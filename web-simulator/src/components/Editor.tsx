import MonacoEditor, {
	DiffEditor,
	useMonaco,
	loader,
} from "@monaco-editor/react";
import editor from "../../modules/editor";
import { defaultCode } from "../data/defaultCode";

type EditorProps = {
	onChange?: (value: string) => void;
	onCursorChange?: (
		position: { lineNumber: number; column: number } | null,
	) => void;
};

export function Editor({ onChange, onCursorChange }: EditorProps) {
	return (
		<div className="grow relative overflow-hidden">
			<MonacoEditor
				height="100%"
				theme="vs-dark"
				defaultLanguage="hub75"
				beforeMount={(monaco) => {
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
				}}
				onMount={(editor, monaco) => {
					editor.onDidChangeModelContent(() => onChange?.(editor.getValue()));
					editor.onDidChangeCursorPosition(() =>
						onCursorChange?.(editor.getPosition()),
					);
				}}
				defaultValue={defaultCode}
			/>
		</div>
	);
}
