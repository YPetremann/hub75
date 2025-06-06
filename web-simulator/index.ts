import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./src/App";
import "iconify-icon";
import controls from "./modules/controls";
import editor from "./modules/editor";
import screen from "./modules/screen";

controls.run.addEventListener("click", screen.update);
editor.onDidChangeModelContent(screen.update);
editor.onDidChangeCursorPosition(screen.update);

const container = document.getElementById("app");
if (container) {
	createRoot(container).render(React.createElement(App));
}
