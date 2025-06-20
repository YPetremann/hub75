import { createRoot } from "react-dom/client";
import { App } from "./App";
import "iconify-icon";

import { ResourceLoader } from "./components/ResourceLoader";
import Picopixel from "./fonts/Picopixel.ttf?url";

const container = document.getElementById("app");
if (container) {
	const root = createRoot(container);
	root.render(
		<ResourceLoader fonts={{ Picopixel }}>
			<App />
		</ResourceLoader>,
	);
}
