#include <RGBmatrixPanel.h>
//#define CLK  8   // USE THIS ON ADAFRUIT METRO M0, etc.
//#define CLK A4 // USE THIS ON METRO M4 (not M0)
#define CLK 11 // USE THIS ON ARDUINO MEGA
#define OE   9
#define LAT 10
#define A   A0
#define B   A1
#define C   A2
#define D   A3

// Enable double buffering
RGBmatrixPanel *matrix = new RGBmatrixPanel(A, B, C, D, CLK, LAT, OE, true, 64);
#define setBrightness(x) fillScreen(0)
#define clear()          fillScreen(0)

#define SCREEN_WIDTH  64
#define SCREEN_HEIGHT 32

String cmdBuf = "";
boolean inComment=false;
boolean inString=false;

uint16_t col=0;
byte cx=0;
byte cy=0;

void setup() {
  Serial.begin(9600);
  matrix->begin();
  while (!Serial) {}
  color(0,0,0);
  cls();
  show();
  Serial.println("");
  Serial.println("SerialHub75 V1.0");
  Serial.println("================");
  Serial.println("Tappe ? pour afficher l'aide");
  doCommand("C 0 0 0;F;C 255 0 0;M X5 5;L 9 9;Z");
  cmdBuf = "";
}

void serialEvent(){
  while(Serial.available()){
    char c = (char)Serial.read();
    if(c == '\n') inComment=false;
    if(!inString && c=='#') inComment=true;
    if(inComment) continue;
    if(c == '\n' || (!inString && c == ';')){
      cmdBuf.trim();
      if(inString) {
        Serial.print("Invalid command: ");
        Serial.println(cmdBuf);
      }
      else if(cmdBuf.length()>0) processCommand();
      inString = false;
      cmdBuf = "";
    }else{
      if(c=='"') inString=!inString;
      cmdBuf+=c;
    }
  }
}

String processCommands(String input) {
  String cmdBuf = "";
  bool inString = false;
  bool inComment = false;
  
  for (int i = 0; i < input.length(); i++) {
    char c = input.charAt(i);
    if(c == '\n') inComment = false;
    if(!inString && c == '#') inComment = true;
    if(inComment) continue;
    if(c == '\n' || (!inString && c == ';')) {
      cmdBuf.trim();
      if(inString) {
        Serial.print("Invalid command: ");
        Serial.println(cmdBuf);
      } else if(cmdBuf.length() > 0) {
        processCommand(cmdBuf);  // Appeler la fonction qui traite la commande
      }
      inString = false;
      cmdBuf = "";
    } else {
      if(c == '"') {
        inString = !inString;
      }
      cmdBuf += c;
    }
  }
}

void processCommand(cmdBuf){
  byte index=cmdBuf.indexOf(' ');
  String cmdName=cmdBuf.substring(0,index);
  cmdBuf=cmdBuf.substring(index);
  cmdBuf.trim();
  doCommand(cmdName,cmdBuf);
}

String getArg(byte index) {
  byte currentIndex = 1; // args are 1-based
  bool inQuote = false;
  byte start = 0;
  byte length = 0;
  byte i = 0;
  while (i < cmdBuf.length()) {
    // skip leading spaces
    while (i < cmdBuf.length() && cmdBuf[i] == ' ') i++;

    if (i >= cmdBuf.length()) break;

    start = i;
    if (cmdBuf[i] == '"') {
      inQuote = true;
      i++; // skip opening quote
      while (i < cmdBuf.length() && cmdBuf[i] != '"') i++;
      i++; // include closing quote
    } else {
      while (i < cmdBuf.length() && cmdBuf[i] != ' ') i++;
    }

    if (currentIndex == index) {
      length = i - start;
      return cmdBuf.substring(start, start+length);
    }
    currentIndex++;
  }
  return ""; // not found
}

String getArg(String key) {
  bool inQuote = false;
  byte i = 0;
  while (i < cmdBuf.length()) {
    // skip leading spaces
    while (i < cmdBuf.length() && cmdBuf[i] == ' ') i++;

    if (i >= cmdBuf.length()) break;

    byte start = i;

    // Handle quoted arguments
    if (cmdBuf[i] == '"') {
      i++; // skip opening quote
      while (i < cmdBuf.length() && cmdBuf[i] != '"') i++;
      i++; // include closing quote
    } else {
      // Check if the argument starts with the key
      if (cmdBuf[i] == key[0]) {
        byte keyLen = key.length();
        if (cmdBuf.substring(i, i + keyLen) == key) {
          byte valueStart = i + keyLen;
          byte valueEnd = valueStart;
          if (valueStart < cmdBuf.length() && cmdBuf[valueStart] == '"') {
            valueStart++; // skip opening quote
            valueEnd = valueStart;
            while (valueEnd < cmdBuf.length() && cmdBuf[valueEnd] != '"') valueEnd++;
            return cmdBuf.substring(valueStart, valueEnd - valueStart);
          } else {
            while (valueEnd < cmdBuf.length() && cmdBuf[valueEnd] != ' ') valueEnd++;
            return cmdBuf.substring(valueStart, valueEnd - valueStart);
          }
        }
      }
      while (i < cmdBuf.length() && cmdBuf[i] != ' ') i++;
    }
    i++;
  }
  return ""; // not found
}

String getArg(byte index, String key){
  String val = getArg(index);
  if(val.length()==0) val = getArg(key);
  return val;
}

String argString(String val, String defaultVal) {
  if (val.length() == 0) return defaultVal;
  if (val.length() >= 2 && val[0] == '"' && val[val.length() - 1] == '"') {
    val = val.substring(1, val.length() - 1);
  }
  return val;
}

int argInt(String val, int defaultVal) {
  if (val.length() == 0) return defaultVal;
  for (int i = 0; i < val.length(); i++) {
    if (!isDigit(val[i]) && !(i == 0 && val[i] == '-')) return defaultVal;
  }
  return val.toInt();
}

void loop() {}

// C
void color(byte r, byte g, byte b){
  col=matrix->Color888(r,g,b);
}
// M
void moveTo(byte ax,byte ay){ cx=ax; cy=ay; }
// m
void moveBy(byte rx,byte ry){ cx+=rx; cy+=ry; }
// L
void lineTo(byte ax,byte ay){ 
  matrix->drawLine(cx,cy, ax,ay, col);
  moveTo(ax,ay);
}
// l
void lineBy(byte rx, byte ry){ lineTo(cy+rx,cy+ry); }
// H
void lineHTo(byte ax){ lineTo(ax,cy); }
// V
void lineVTo(byte ay){ lineTo(cx,ay); }
// h
void lineHBy(byte rx){ lineBy(rx,0); }
// v
void lineVBy(byte ry){ lineBy(0,ry); }
// P
void print(String text){
  matrix->setCursor(cx, cy);
  matrix->setTextColor(col);
  matrix->print(text);
}
// R
void rectTo(byte ax, byte ay){ matrix->fillRect(cx,cy, ax,ay, col); }
// r
void rectBy(byte rx, byte ry){ matrix->fillRect(cx,cy, cx+rx,cy+ry, col); }

// F
void cls(){ matrix->fillScreen(col);}

// Z or z
void show(){ matrix->swapBuffers(true); }

void doCommand(String cmdName,String cmdBuf){
  if(cmdName=="?") {
    Serial.println("Commands List:");
    Serial.println("C R0 V0 B255;  # definie couleur a 0,0,255 (bleu)");
    Serial.println("M X5 Y10       # deplace position a 5,10");
    Serial.println("m X5 Y10       # deplace position de 5,10");
    Serial.println("L <X> <Y>      # fait une line a <X> <Y>");
    Serial.println("l <X> <Y>      # fait une line de <X> <Y>");
    Serial.println("H <X>          # fait une ligne horizontale a <X>");
    Serial.println("h <X>          # fait une ligne horizontale de <X>");
    Serial.println("V <Y>          # fait une ligne verticale a <Y>");
    Serial.println("v <Y>          # fait une ligne verticale de <Y>");
    Serial.println("P \"Texte\"     # ecrit Texte");
    Serial.println("R <X> <Y>      # fait un rectangle a <X> <Y>");
    Serial.println("r <X> <Y>      # fait un rectangle de <X> <Y>");
    Serial.println("Z              # affiche le dessin");
  }else if(cmdName=="C" || cmdName=="c") {
    color(
      argInt(getArg(1,"R"),0),
      argInt(getArg(2,"V"),0),
      argInt(getArg(3,"B"),0)
    );
  }else if(cmdName=="M"){
    Serial.print("M");
    Serial.print(" X "); Serial.print(argInt(getArg(1,"X"),0));
    Serial.print(" Y "); Serial.print(argInt(getArg(2,"Y"),0));
    Serial.println();
    moveTo(
      argInt(getArg(1,"X"),0),
      argInt(getArg(2,"Y"),0)
    );
  }else if(cmdName=="m"){
    moveBy(
      argInt(getArg(1,"X"),0),
      argInt(getArg(2,"Y"),0)
    );
  }else if(cmdName=="L"){
    lineTo(
      argInt(getArg(1,"X"),0),
      argInt(getArg(2,"Y"),0)
    );
  }else if(cmdName=="l"){
    lineBy(
      argInt(getArg(1,"X"),0),
      argInt(getArg(2,"Y"),0)
    );
  }else if(cmdName=="H"){
    lineVTo(
      argInt(getArg(1,"Y"),0)
    );
  }else if(cmdName=="h"){
    lineHBy(
      argInt(getArg(1,"X"),0)
    );
  }else if(cmdName=="V"){
    lineHTo(
      argInt(getArg(1,"Y"),0)
    );
  }else if(cmdName=="v"){
    lineHBy(
      argInt(getArg(1,"Y"),0)
    );
  }else if(cmdName=="P"){
  }else if(cmdName=="R"){
    rectTo(
      argInt(getArg(1,"X"),0),
      argInt(getArg(2,"Y"),0)
    );
  }else if(cmdName=="r"){
    rectBy(
      argInt(getArg(1,"X"),0),
      argInt(getArg(2,"Y"),0)
    );
  }else if(cmdName=="F" || cmdName=="f" ){
    cls();
  }else if(cmdName=="Z"){
    show();
  }else {
    Serial.print("Invalid command: ");
    Serial.print(cmdName);
    return;
  }
  Serial.println("OK");
}
