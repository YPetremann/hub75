import { Editor, type Monaco } from "@monaco-editor/react";
import "../utils/lang";
import { registerHub75 } from "../utils/lang";

function Help() {
	return (
		<div className="h-[320px] w-1 grow relative overflow-hidden">
			<Editor
				height="100%"
				theme="vs-dark"
				options={{
					readOnly: true,
					minimap: { enabled: false },
					lineNumbers: "off",
					glyphMargin: false,
					folding: false,
					lineDecorationsWidth: 4,
					lineNumbersMinChars: 0,
					scrollBeyondLastLine: false,
				}}
				beforeMount={(monaco: Monaco) => {
					registerHub75(monaco);
				}}
				defaultLanguage="hub75"
				defaultValue={`# Liste des commandes:
C 0 127 255;    # definie couleur
# MAJUSCULE = Position de l'écran
# minuscule = Deplacement du pointeur
M 10 5; m 10 5; # deplace pointeur
L 10 5; l 10 5; # fait une line
H 5;    h 5;    # fait une ligne horizontale
V 5;    v 5;    # fait une ligne verticale
R 10 5; r 10 5; # fait un rectangle
c 5;            # fait un cercle
P \"Texte\";      # ecrit Texte
T 5 5 10 10;    # fait un triangle
t 5 5 10 10;    # fait un triangle de 5,5 et 10,10
F;              # rempli l'ecran
Z;              # affichage automatique du dessin
z;              # affichage manuel du dessin`}
			/>
		</div>
	);
}

export default Help;
