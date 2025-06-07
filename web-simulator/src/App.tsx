import React, { use } from "react";
import { Editor } from "./components/Editor";
import Screen from "./components/Screen";
import { Toolbar } from "./components/Toolbar";
import { defaultCode } from "./data/defaultCode";
import renderFrame from "./rendered/renderFrame";
import Help from "./components/Help";
import { useRefState } from "./utils/useRefState";
import picopixel from "../fonts/Picopixel.ttf?url";

async function preLoader() {
	const font = new FontFace("Picopixel", `url(${picopixel})`);
	const loadedFace = await font.load()
	document.fonts.add(loadedFace);
}

type Pos = { forced?:boolean; lineNumber: number; column: number }

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function App() {
	const [editorData, setEditorData] = React.useState<string>(defaultCode);
	const [renderData, setRenderData] = React.useState<string>("");
	const [renderCount, setRenderCount] = React.useState(0);
	const [cursorPos, setCursorPos] = React.useState<Pos>({ lineNumber: 0, column: 0 });
	const [autoRender, setAutoRender] = React.useState(true);
	const [renderToCursor, setRenderToCursor] = React.useState(false);
	const [isPlayingRef, isPlaying, setPlaying] = useRefState(false);
	const [frameDelayRef, frameDelay, setFrameDelay] = useRefState(100);
	const [renderGuide, setRenderGuide] = React.useState(false);

	const handleRender = React.useCallback(() => {
		const pos = renderToCursor ? cursorPos : null
		let data = editorData;
		if (pos) {
			const lines = data.split("\n").slice(0, pos.lineNumber);
			if (lines.length > 0) lines.splice(-1, 1, lines.at(-1)!.slice(0, pos.column - 1))
			data = lines.join("\n");
		}
		setRenderData(data);
	}, [editorData, renderToCursor, cursorPos]);

	React.useEffect(() => {
		if (autoRender) handleRender();
	}, [autoRender, renderToCursor, editorData, cursorPos]);

	React.useEffect(() => {
		handleRender()
	}, [renderCount]);

	React.useEffect(() => {
		preLoader().then(()=>{
			setRenderCount(x=>x+1)
		})
	}, []);

	React.useEffect(() => {
		if (!isPlaying) return
		setAutoRender(true);
		setRenderToCursor(true);
		let lineNumber = 0
		let timer: number;
		function setAnim() {
			if (!isPlayingRef.current) return;
			setCursorPos({ forced: true, lineNumber, column: 0 });
			lineNumber++;
			const steps = editorData.split("\n");
			if (lineNumber > steps.length + 1) return setPlaying(false);
			timer = setTimeout(setAnim, frameDelayRef.current);
		}
		setAnim()
		return () => { clearTimeout(timer) }
	}, [isPlaying]);

	return (
		<div className="font-sans bg-[#222] text-[#eee] flex flex-col h-screen">
			<Toolbar {...{
				autoRender, setAutoRender,
				renderToCursor, setRenderToCursor,
				isPlaying, setPlaying,
				renderGuide, setRenderGuide,
				frameDelay, setFrameDelay,
				count: renderCount,
				setCount: setRenderCount
			}} />
			<Editor {...{
				renderToCursor,
				cursorPos, setCursorPos,
				editorData, setEditorData
			}} />
			<div className="flex">
				<Screen {...{
					renderData,
					renderGuide,
					renderFrame,
				}} />
				<Help />
			</div>
		</div>
	);
}
