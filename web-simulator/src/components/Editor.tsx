import MonacoEditor, { type Monaco, useMonaco } from "@monaco-editor/react";
import React, { useRef } from "react";
import "../faded-after-cursor.css";
import { registerHub75 } from "../utils/lang";

type Pos = { forced?: boolean; lineNumber: number; column: number };
type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type EditorProps = {
	renderToCursor: boolean;
	cursorPos: Pos;
	setCursorPos: Setter<Pos>;
	editorData: string;
	setEditorData: Setter<string>;
};
export function Editor({
	renderToCursor,
	cursorPos,
	editorData,
	setCursorPos,
	setEditorData,
}: EditorProps) {
	const monaco = useMonaco();
	const block = useRef(false);

	const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);
	const decorationIds = React.useRef<string[]>([]);

	React.useEffect(() => {
		const editor = editorRef.current;
		if (!editor || !monaco) return;
		if (cursorPos.forced) {
			block.current = true;
			editor.setPosition(cursorPos);
			block.current = false;
		}
	}, [cursorPos, monaco]);

	// Update decoration when renderToCursor changes
	React.useEffect(() => {
		const editor = editorRef.current;
		if (!editor || !monaco) return;
		const position = editor.getPosition();
		const model = editor.getModel();
		if (!position || !model) return;
		const startLine = position.lineNumber;
		const startCol = position.column;
		const endLine = model.getLineCount();
		const endCol = model.getLineLength(endLine);
		// If cursor is at the very end, remove decoration
		if (!renderToCursor || (startLine === endLine && startCol > endCol)) {
			decorationIds.current = editor.deltaDecorations(
				decorationIds.current,
				[],
			);
			return;
		}

		const range = new monaco.Range(startLine, startCol, endLine, endCol + 1);
		const decorations = [
			{ range, options: { inlineClassName: "faded-after-cursor" } },
		];
		decorationIds.current = editor.deltaDecorations(
			decorationIds.current,
			decorations,
		);
	}, [renderToCursor, monaco]);
	return (
		<div className="w-full grow relative overflow-hidden border-y border-gray-300">
			<MonacoEditor
				beforeMount={(monaco: Monaco) => {
					registerHub75(monaco);
				}}
				defaultLanguage="hub75"
				height="100%"
				onChange={(v) => setEditorData(v)}
				onMount={(editor) => {
					editorRef.current = editor;
					editor.onDidChangeCursorPosition(() => {
						if (block.current) return;
						setCursorPos(editor.getPosition());
					});
				}}
				options={{
					scrollBeyondLastLine: false,
				}}
				theme="vs-dark"
				value={editorData}
			/>
		</div>
	);
}
