import "iconify-icon";
import controls from "./modules/controls";
import editor from "./modules/editor"
import screen from "./modules/screen"

controls.run.addEventListener("click", screen.update)
editor.onDidChangeModelContent(screen.update);
editor.onDidChangeCursorPosition(screen.update);