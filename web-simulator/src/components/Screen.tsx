import type React from "react";
import { useEffect, useRef } from "react";

type ScreenProps = {
	renderData: string;
	renderFrame: (ctx: CanvasRenderingContext2D, renderData: string) => void;
};

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;

const Screen: React.FC<ScreenProps> = ({ renderData, renderFrame }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		renderFrame(ctx, renderData);
	}, [renderData, renderFrame]);
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
