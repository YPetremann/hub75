import React from "react";

type ToolbarProps = {
	onRender: (line:number) => boolean;
	onToggleAutoRender: (value: boolean) => void;
	onToggleRenderToCursor: (value: boolean) => void;
  onToggleRenderGuide: (value: boolean) => void;
};

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export function Toolbar({
	onRender,
	onToggleAutoRender,
	onToggleRenderToCursor,
  onToggleRenderGuide,
}) {
	const [autoRender, setAutoRender] = React.useState(true);
	const [renderToCursor, setRenderToCursor] = React.useState(true);
  const [renderGuide, setRenderGuide] = React.useState(false);
  const [frameDelay, _setFrameDelay] = React.useState(100);
  const frameDelayRef = React.useRef(frameDelay);
  const setFrameDelay = React.useCallback((value:number) => {
    frameDelayRef.current = value;
    _setFrameDelay(value);
  }, []);

  const [isPlaying, _setPlaying] = React.useState(false);
  const isPlayingRef = React.useRef(isPlaying);
  const setPlaying = React.useCallback((value:boolean) => {
    isPlayingRef.current = value;
    _setPlaying(value);
  }, []);
  
  const onAnimate = React.useCallback(async ()=>{
    setPlaying(true);
    onToggleRenderToCursor(true);
    let lineNumber = 0;
    while(isPlayingRef.current) {
      const hitEnd = onRender(lineNumber);
      if (hitEnd) break
      lineNumber++;
      await timeout(frameDelayRef.current);
    }
    setPlaying(false);
    onToggleRenderToCursor(false);
  }, [onRender,setPlaying]);

	return (
		<div className="flex gap-1 p-1 items-center">
			<button
				onClick={onRender}
				type="button"
				className="flex flex-row items-center px-2 py-1 gap-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
				disabled={autoRender}
			>
				<iconify-icon icon="mdi:image" />
				<span>Générer</span>
			</button>
			<label className="flex px-2 py-1 gap-1 items-center">
				<input
					type="checkbox"
					className="accent-blue-500"
					checked={autoRender}
					onChange={(e) => {
						setAutoRender(e.target.checked);
						onToggleAutoRender(e.target.checked);
					}}
				/>
				<iconify-icon icon="mdi:auto-mode" />
				Automatique
			</label>
			<label className="flex px-2 py-1 gap-1 items-center">
				<input
					type="checkbox"
					className="accent-blue-500"
					checked={renderToCursor}
					onChange={(e) => {
						setRenderToCursor(e.target.checked);
						onToggleRenderToCursor(e.target.checked);
					}}
				/>
				<iconify-icon icon="mdi:cursor-text" />
				Au curseur
			</label>
			<label className="flex px-2 py-1 gap-1 items-center">
				<input
					type="checkbox"
					className="accent-purple-500"
					checked={renderGuide}
					onChange={(e) => {
						setRenderGuide(e.target.checked);
						onToggleRenderGuide(e.target.checked);
					}}
				/>
				<iconify-icon icon="mdi:plus" />
				Guide
			</label>
			{isPlaying ? <button
				type="button"
				className="flex flex-row items-center px-2 py-1 gap-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
				onClick={()=>setPlaying(false)}
			>
				<iconify-icon icon="mdi:stop" />
				Stop
			</button> : <button
				type="button"
				className="flex flex-row items-center px-2 py-1 gap-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
				onClick={onAnimate}
			>
				<iconify-icon icon="mdi:play" />
				Animer
			</button>
      }
			<label className="flex items-center px-2 py-1 gap-1">
				<input
					type="range"
          className="accent-green-600"
					min={10}
					max={2000}
					step={50}
					value={frameDelay}
					onChange={(e) => setFrameDelay(Number(e.target.value))}
				/>
				<span>{frameDelay} ms</span>
			</label>
		</div>
	);
}
