import { Editor, type Monaco } from "@monaco-editor/react";
import "../utils/lang";
import helpCode from "../data/help.txt?raw";
import { registerHub75 } from "../utils/lang";

function Help() {
	return (
		<div className="h-[320px] w-1 grow relative overflow-hidden">
			<Editor
				beforeMount={(monaco: Monaco) => {
					registerHub75(monaco);
				}}
				defaultLanguage="hub75"
				defaultValue={helpCode}
				height="100%"
				options={{
					readOnly: true,
					minimap: { enabled: false },
					lineNumbers: "off",
					glyphMargin: false,
					folding: false,
					lineDecorationsWidth: 4,
					lineNumbersMinChars: 0,
					scrollBeyondLastLine: false,
				}}
				theme="vs-dark"
			/>
		</div>
	);
}

export default Help;
