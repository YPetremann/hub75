import React from "react";
import { displayCursor } from "../rendered/doCommand";

type ScreenProps = {
	renderData: string;
	renderGuide: boolean;
	renderFrame: (ctx: CanvasRenderingContext2D, renderData: string) => void;
};

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;

const Screen: React.FC<ScreenProps> = ({
	renderData,
	renderGuide,
	renderFrame,
}) => {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

	React.useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		renderFrame(ctx, renderData);
	}, [renderData, renderFrame]);
	React.useEffect(() => {
		if (!renderGuide) return;
		// call displayCursor every 250ms
		const interval = setInterval(displayCursor, 250);
		return () => {
			clearInterval(interval);
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			renderFrame(ctx, renderData);
		};
	}, [renderGuide, renderData, renderFrame]);
	return (
		<div className="flex flex-col items-center justify-center">
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				className="border-r border-gray-300 bg-black"
			/>
		</div>
	);
};

export default Screen;
