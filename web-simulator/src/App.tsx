import React from "react";
import { Editor } from "./components/Editor";
import Screen from "./components/Screen";
import { Toolbar } from "./components/Toolbar";
import { defaultCode } from "./data/defaultCode";
import { updateDisplay } from "./rendered/updateDisplay";

async function preLoader(){
	const font = new FontFace("Picopixel", "url(../fonts/Picopixel.ttf)");
	await font.load().then((loadedFace) => {
		document.fonts.add(loadedFace);
	});
}

export function App() {
	const [renderData, setRenderData] = React.useState<string>(defaultCode);
	const [renderFrame, setRenderFrame] = React.useState<() => void>(() => () => {});
	const contentRef = React.useRef<string>(defaultCode);
	const posRef = React.useRef<{ lineNumber: number; column: number }>({
		lineNumber: 0,
		column: 0,
	});

	React.useEffect(() => {
		preLoader().then(()=>{
			setRenderFrame(()=>updateDisplay)
		});
	}, []);
	function onChange(value: string) {
		contentRef.current = value;
	}
	function onCursorChange(
		position: { lineNumber: number; column: number } | null,
	) {
		// ...existing code...
	}

	function handleRender() {
		setRenderData(contentRef.current);
	}

	return (
		<div className="font-sans bg-[#222] text-[#eee] flex flex-col h-screen">
			<Toolbar
				onRender={handleRender}
				autoRender={false}
				onToggleAutoRender={() => {}}
				renderToCursor={false}
				onToggleRenderToCursor={() => {}}
				onAnimate={() => {}}
				frameDelay={100}
				onFrameDelayChange={() => {}}
			/>
			<Editor onChange={onChange} onCursorChange={onCursorChange} />
			<Screen renderData={renderData} renderFrame={renderFrame} />
		</div>
	);
}
