import { Icon } from "@iconify/react";
import type React from "react";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
type ToolbarProps = {
	autoRender: boolean;
	setAutoRender: Setter<boolean>;
	renderToCursor: boolean;
	setRenderToCursor: Setter<boolean>;
	renderGuide: boolean;
	setRenderGuide: Setter<boolean>;
	isPlaying: boolean;
	setPlaying: Setter<boolean>;
	frameDelay: number;
	setFrameDelay: Setter<number>;
	count: number;
	setCount: Setter<number>;
};

export function Toolbar({
	autoRender,
	setAutoRender,
	renderToCursor,
	setRenderToCursor,
	renderGuide,
	setRenderGuide,
	isPlaying,
	setPlaying,
	frameDelay,
	setFrameDelay,
	count,
	setCount,
}: ToolbarProps) {
	return (
		<div className="w-full flex gap-1 p-1 items-center">
			<button
				onClick={() => setCount((p: number) => p + 1)}
				type="button"
				className="flex flex-row items-center px-2 py-1 gap-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
				disabled={autoRender}
			>
				<Icon icon="mdi:image" />
				<span>Générer</span>
			</button>
			<label className="flex px-2 py-1 gap-1 items-center">
				<input
					type="checkbox"
					className="accent-blue-500"
					checked={autoRender}
					onChange={(e) => setAutoRender(e.target.checked)}
				/>
				<Icon icon="mdi:auto-mode" />
				Auto
			</label>
			<label className="flex px-2 py-1 gap-1 items-center">
				<input
					type="checkbox"
					className="accent-blue-500"
					checked={renderToCursor}
					onChange={(e) => setRenderToCursor(e.target.checked)}
				/>
				<Icon icon="mdi:cursor-text" />
				Au curseur
			</label>
			<label className="flex px-2 py-1 gap-1 items-center">
				<input
					type="checkbox"
					className="accent-purple-500"
					checked={renderGuide}
					onChange={(e) => setRenderGuide(e.target.checked)}
				/>
				<Icon icon="mdi:plus" />
				Guide
			</label>
			<button
				type="button"
				className="flex flex-row items-center px-2 py-1 gap-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
				onClick={() => setPlaying((p: boolean) => !p)}
			>
				<Icon icon={isPlaying ? "mdi:stop" : "mdi:play"} />
				{isPlaying ? "Stop" : "Animer"}
			</button>
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
			<div className="grow" />
			<div className="p-1">{count}</div>
		</div>
	);
}
