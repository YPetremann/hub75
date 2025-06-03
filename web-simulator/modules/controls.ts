import { createElement } from "../utils/createElement";

const controls:Record<string,HTMLElement>={}
const controlsEl=document.getElementById("controls")
if(!controlsEl) throw new Error("Controls element not found");

controls.run=createElement(`button.flex.px-2.py-1.gap-1.items-center.rounded.bg-blue-600.text-white.disabled:opacity-25[title="Générer l'image"]`,[
  createElement(`iconify-icon[icon="mdi:image"]`),
  "Générer"
]);
controlsEl.appendChild(controls.run);
/*
  <label alt="Mise à jour automatique" class="flex px-2 py-1 gap-1 items-center">
    <input type="checkbox" id="autoUpdate" checked class="accent-blue-500"/>
    <span class="iconify" data-icon="mdi:auto-mode"></span>
  </label>
*/
controls.autoUpdate=createElement(`input[type="checkbox",checked=checked,class="accent-blue-500"]`)
controlsEl.appendChild(
  createElement(`label.flex.px-2.py-1.gap-1.items-center[title="Mise à jour automatique"]`,[
    controls.autoUpdate,
    createElement(`iconify-icon[icon="mdi:auto-mode"]`),
    "Mise à jour auto"
  ])
);
controls.autoUpdate.addEventListener("change", updateToolbar);

/*
  <label alt=" Afficher jusqu'au curseur" class="flex px-2 py-1 gap-1 items-center">
    <input type="checkbox" id="showToCursor" checked class="accent-blue-500"/>
    <span class="iconify" data-icon="mdi:cursor-text"></span>
  </label>
*/
/*
  <label alt="Afficher le pointeur" class="flex px-2 py-1 gap-1 items-center" alt="Pointeur">
    <input type="checkbox" id="showPointer" class="accent-blue-500"/>
    <span class="iconify" data-icon="mdi:plus"></span>
  </label>
*/
/*
  <button id="animBtn" class="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white flex items-center gap-1">
    <span id="animIcon" class="iconify" data-icon="mdi:play"></span> <span id="animText">Animer</span>
  </button>
*/
/*
  <label class="flex items-center px-2 py-1 ">
    <input type="range" id="animDelay" min="0" max="1000" value="250" step="50" class="accent-green-500"> 
    <span id="animDelayVal">250</span> ms
  </label>
*/
function updateToolbar() {
  controls.run.disabled = controls.autoUpdate.checked;
}
updateToolbar();
export default controls