import React from "react";

export type ResourceLoaderProps = {
	fonts?: Record<string, string>;
	images?: Record<string, string>;
	sounds?: Record<string, string>;
	children: React.ReactNode;
};

async function loadFonts(fonts: Record<string, string> = {}) {
	const promises = Object.entries(fonts).map(async ([name, url]) => {
		const font = new FontFace(name, `url(${url})`);
		const loadedFace = await font.load();
		document.fonts.add(loadedFace);
	});
	await Promise.all(promises);
}

async function loadImages(images: Record<string, string> = {}) {
	const promises = Object.values(images).map(
		(url) =>
			new Promise<void>((resolve, reject) => {
				const img = new window.Image();
				img.onload = () => resolve();
				img.onerror = reject;
				img.src = url;
			}),
	);
	await Promise.all(promises);
}

async function loadSounds(sounds: Record<string, string> = {}) {
	const promises = Object.values(sounds).map(
		(url) =>
			new Promise<void>((resolve, reject) => {
				const audio = new window.Audio();
				audio.oncanplaythrough = () => resolve();
				audio.onerror = reject;
				audio.src = url;
			}),
	);
	await Promise.all(promises);
}

export function ResourceLoader({
	fonts,
	images,
	sounds,
	children,
}: ResourceLoaderProps) {
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		Promise.all([
			loadFonts(fonts),
			loadImages(images),
			loadSounds(sounds),
		]).then(() => setReady(true));
	}, [fonts, images, sounds]);

	if (!ready) {
		return (
			<div
				style={{
					width: "100vw",
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: "sans-serif",
				}}
			>
				<svg
					className="animate-spin"
					fill="none"
					height="48"
					style={{ marginRight: 16 }}
					viewBox="0 0 48 48"
					width="48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Chargement en cours</title>
					<circle
						cx="24"
						cy="24"
						r="20"
						stroke="#888"
						strokeDasharray="31.4 31.4"
						strokeWidth="4"
					/>
				</svg>
				Chargement des ressources…
			</div>
		);
	}

	return <>{children}</>;
}
