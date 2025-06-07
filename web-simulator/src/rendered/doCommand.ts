import matrix from "./AdafruitGFX";
import { setArgs, argInt, argString, getArg } from "./argParsing";
import { millis } from "./Arduino";

let col="black";
let bright = true;
// C
export function color(r:number, g:number, b:number){
  col=matrix.Color888(r,g,b);
  let luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  bright = luminance > 127;
}

let cx=0;
let cy=0;

export function displayCursor(){
  const ncol = millis() % 500 > 250 ? col: bright ? matrix.Color888(0,0,0) : matrix.Color888(255,255,255);
  matrix.drawPixel(cx,cy, ncol);
}

// M
export function moveTo(ax: number,ay: number){ cx=ax; cy=ay; }
// m
export function moveBy(rx: number,ry: number){ cx+=rx; cy+=ry; }
// L
export function lineTo(ax: number,ay: number){ 
  matrix.drawLine(cx,cy, ax,ay, col);
  moveTo(ax,ay);
}
// l
export function lineBy(rx: number, ry: number){ lineTo(cx+rx,cy+ry); }
// H
export function lineHTo(ax: number){ lineTo(ax,cy); }
// V
export function lineVTo(ay: number){ lineTo(cx,ay); }
// h
export function lineHBy(rx: number){ lineBy(rx,0); }
// v
export function lineVBy(ry: number){ lineBy(0,ry); }
// P
export function print(text: string){
  matrix.print(cx,cy,text,col);
  const [,,w]=matrix.getTextBounds(text);
  moveBy(w,0)

}
// R
export function rectTo(ax: number, ay: number){ matrix.fillRect(cx,cy, ax-cx,ay-cy, col); moveTo(ax,ay); }
// r
export function rectBy(rx: number, ry: number){ rectTo(cx+rx, cy+ry); }
// c
export function circle(r: number){ matrix.fillCircle(cx,cy, r, col);}
// t
export function triangleBy(x1: number, y1: number, x2: number, y2: number) {
  matrix.fillTriangle(cx, cy, cx + x1, cy + y1, cx + x2, cy + y2, col);
  moveTo(cx + x2, cy + y2);
}

// T
export function triangleTo(x1: number, y1: number, x2: number, y2: number) {
  matrix.fillTriangle(cx, cy, x1, y1, x2, y2, col);
  moveTo(x2, y2);
}

// F
export function cls(){ matrix.fillScreen(col);}

// Z or z
export function show(){ matrix.swapBuffers(true); }

let autoDisplay = true;
export default function doCommand(cmdBuf:string){
  cmdBuf=cmdBuf.trim();
  let index=cmdBuf.indexOf(' ');
  if(index<0) index=cmdBuf.length;
  let cmdName=cmdBuf.substring(0,index).trim();
  let cmdArgs=cmdBuf.substring(index).trim();
  setArgs(cmdArgs);
  if(cmdName=="?") {
    console.log("Commands List:");
    console.log("C 0 0 255    # definie couleur a 0,0,255 (bleu)");
    console.log("M 5 10       # deplace position a 5,10");
    console.log("m 5 5        # deplace position de 5,10");
    console.log("c 5          # fait un cercle de rayon 5");
    console.log("T 5 5 10 10  # fait un triangle par 5,5 et 10,10");
    console.log("t 5 5 10 10  # fait un triangle de 5,5 et 10,10");
    console.log("L 5 5        # fait une line a 5,5");
    console.log("l 5 5        # fait une line de 5 5");
    console.log("H 5          # fait une ligne horizontale a 5");
    console.log("h 5          # fait une ligne horizontale de 5");
    console.log("V 5          # fait une ligne verticale a 5");
    console.log("v 5          # fait une ligne verticale de 5");
    console.log("P \"Texte\"    # ecrit Texte");
    console.log("R 10 5       # fait un rectangle a 10,5");
    console.log("r 10 5       # fait un rectangle de 10,5");
    console.log("F            # rempli l'ecran");
    console.log("Z            # affiche le dessin (affichage automatique)");
    console.log("z            # affiche le dessin (affichage manuel)");
  }
  else if(cmdName=="C") {
    let r = argInt(getArg(1,"R"),0);
    let v = argInt(getArg(2,"V"),0);
    let b = argInt(getArg(3,"B"),0);
    console.log("[ OK ] COLOR"+JSON.stringify({r,v,b}));
    color(r,v,b);
  }
  else if(cmdName=="M"){
    let x = argInt(getArg(1,"X"),0);
    let y = argInt(getArg(2,"Y"),0);
    console.log("[ OK ] MOVE ABS"+JSON.stringify({x,y}));
    moveTo(x,y);
  }
  else if(cmdName=="m"){
    let x = argInt(getArg(1,"X"),0);
    let y = argInt(getArg(2,"Y"),0);
    console.log("[ OK ] MOVE REL"+JSON.stringify({x,y}));
    moveBy(x,y);
  }
  else if(cmdName=="c"){
    let r = argInt(getArg(1,"R"),0);
    console.log("[ OK ] CIRCLE"+" R "+JSON.stringify({r}));
    circle(r);
  }
  else if(cmdName=="T"){
    let x1 = argInt(getArg(1,"U"),0);
    let y1 = argInt(getArg(2,"V"),0);
    let x2 = argInt(getArg(3,"X"),0);
    let y2 = argInt(getArg(4,"Y"),0);
    console.log("[ OK ] TRIANGLE ABS"+JSON.stringify({x1,y1,x2,y2}));
    triangleTo(x1,y1,x2,y2);
  }
  else if(cmdName=="t"){
    let x1 = argInt(getArg(1,"U"),0);
    let y1 = argInt(getArg(2,"V"),0);
    let x2 = argInt(getArg(3,"X"),0);
    let y2 = argInt(getArg(4,"Y"),0);
    console.log("[ OK ] TRIANGLE REF"+JSON.stringify({x1,y1,x2,y2}));
    triangleBy(x1,y1,x2,y2);
  }
  else if(cmdName=="L"){
    let x = argInt(getArg(1,"X"),0);
    let y = argInt(getArg(2,"Y"),0);
    console.log("[ OK ] LINE ABS"+JSON.stringify({x,y}));
    lineTo(x,y);
  }
  else if(cmdName=="l"){
    let x = argInt(getArg(1,"X"),0);
    let y = argInt(getArg(2,"Y"),0);
    console.log("[ OK ] LINE REL"+JSON.stringify({x,y}));
    lineBy(x,y);
  }
  else if(cmdName=="H"){
    let x = argInt(getArg(1,"X"),0);
    console.log("[ OK ] LINE H ABS"+JSON.stringify({x}));
    lineHTo(x);
  }
  else if(cmdName=="h"){
    let x = argInt(getArg(1,"X"),0);
    console.log("[ OK ] LINE H REL"+JSON.stringify({x}));
    lineHBy(x);
  }
  else if(cmdName=="V"){
    let y = argInt(getArg(1,"Y"),0);
    console.log("[ OK ] LINE V ABS"+JSON.stringify({y}));
    lineVTo(y);
  }
  else if(cmdName=="v"){
    let y = argInt(getArg(1,"Y"),0);
    console.log("[ OK ] LINE V REL"+JSON.stringify({y}));
    lineVBy(y);
  }
  else if(cmdName=="P"){
    let t = argString(getArg(1,"T"),"?");
    console.log("[ OK ] PRINT"+JSON.stringify({t}));
    print(t);
  }
  else if(cmdName=="R"){
    let x = argInt(getArg(1,"X"),0);
    let y = argInt(getArg(2,"Y"),0);
    console.log("[ OK ] RECT ABS"+JSON.stringify({x,y}));
    rectTo(x,y);
  }
  else if(cmdName=="r"){
    let x = argInt(getArg(1,"X"),0);
    let y = argInt(getArg(2,"Y"),0);
    console.log("[ OK ] RECT REL"+JSON.stringify({x,y}));
    rectBy(x,y);
  }
  else if(cmdName=="F" || cmdName=="f" ){
    console.log("[ OK ] FILLSCREEN");
    cls();
  }
  else if(cmdName=="z"){
    console.log("[ OK ] SHOW");
    autoDisplay=false;
    show();
  }
  else if(cmdName=="Z"){
    console.log("[ OK ] SHOW");
    autoDisplay=true;
    show();
  }
  else {
    console.log("[FAIL] invalid command : "+JSON.stringify(cmdName)+" "+JSON.stringify(cmdArgs));
  }
}