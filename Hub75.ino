#include <RGBmatrixPanel.h>
#include <Adafruit_GFX.h>
#include <Fonts/Picopixel.h>
//#define CLK  8   // USE THIS ON ADAFRUIT METRO M0, etc.
//#define CLK A4 // USE THIS ON METRO M4 (not M0)
#define CLK 11 // USE THIS ON ARDUINO MEGA
#define OE   9
#define LAT 10
#define A   A0
#define B   A1
#define C   A2
#define D   A3
#define SCREEN_WIDTH  64
#define SCREEN_HEIGHT 32

// Enable double buffering
RGBmatrixPanel *matrix = new RGBmatrixPanel(A, B, C, D, CLK, LAT, OE, true, SCREEN_WIDTH);

bool LOG=false;
void setup() {
  Serial.begin(9600);
  matrix->begin();
  matrix->setFont(&Picopixel);
  color(0,0,0);
  cls();
  show();
  Serial.println("");
  Serial.println("SerialHub75 V1.0");
  Serial.println("================");
  Serial.println("Tappe ? pour afficher l'aide");

  doCommands("C 0 0 0;F;z");
  doCommands("C 255 255 255;M 1 1;P \"AVILAB ANIMATION\";M 1 7;P \"LET'S GO\"");
  doCommands("C 255 0 0;M 0 13;h 64;z");
  doCommands("C 255 255 0;M 0 14;h 64;z");
  doCommands("C 0 255 0;M 0 15;h 64;z");
  doCommands("C 0 255 255;M 0 16;h 64;z");
  doCommands("C 0 0 255;M 0 17;h 64;z");
  doCommands("C 255 0 255;M 0 18;h 64;M 0 0;z");
}

String inputString = "";
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      doCommands(inputString);
      inputString="";
    }else inputString += inChar;
  }
}

bool autoDisplay=false;
unsigned long previousMillis = 0;
const unsigned long interval = 250; // 250 milliseconds
void loop() {
  /*
  if(autoDisplay){
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      removeCursor();
      show();
      displayCursor();
      show();
    }
  }
  */
}

void doCommands(String input) {
  input=input+"\n";
  String cmdsBuf = "";
  bool inString = false;
  bool inComment = false;
  //if(autoDisplay) removeCursor();
  
  for (int i = 0; i < input.length(); i++) {
    char c = input.charAt(i);
    if(c == '\n') inComment = false;
    if(!inString && c == '#') inComment = true;
    if(inComment) continue;
    if(c == '\n' || (!inString && c == ';')) {
      cmdsBuf.trim();
      if(inString) {
        Serial.print("Invalid command: ");
        Serial.println(cmdsBuf);
      } else if(cmdsBuf.length() > 0) {
        doCommand(cmdsBuf);
      }
      inString = false;
      cmdsBuf = "";
    } else {
      if(c == '"') inString = !inString;
      cmdsBuf += c;
    }
  }
  if(autoDisplay) {
    show();
    //displayCursor();
    //show();
  }
}

String cmdArgs="";
void doCommand(String cmdBuf){
  byte index=cmdBuf.indexOf(' ');
  String cmdName=cmdBuf.substring(0,index);
  cmdArgs=cmdBuf.substring(index);
  cmdArgs.trim();
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
    int r = argInt(getArg(1,"R"),0);
    int v = argInt(getArg(2,"V"),0);
    int b = argInt(getArg(3,"B"),0);
    if(LOG){
      Serial.print("[ OK ] COLOR");
      Serial.print(" R "); Serial.print(r);
      Serial.print(" V "); Serial.print(v);
      Serial.print(" B "); Serial.print(b);
      Serial.println();
    }

    color(r,v,b);
  }else if(cmdName=="M"){
    int x = argInt(getArg(1,"X"),0);
    int y = argInt(getArg(2,"Y"),0);

    if(LOG){
      Serial.print("[ OK ] MOVE ABS");
      Serial.print(" X "); Serial.print(x);
      Serial.print(" Y "); Serial.print(y);
      Serial.println();
    }

    moveTo(x,y);
  }else if(cmdName=="m"){
    int x = argInt(getArg(1,"X"),0);
    int y = argInt(getArg(2,"Y"),0);

    if(LOG){
      Serial.print("[ OK ] MOVE REL");
      Serial.print(" X "); Serial.print(x);
      Serial.print(" Y "); Serial.print(y);
      Serial.println();
    }
    moveBy(x,y);
  }else if(cmdName=="L"){
    int x = argInt(getArg(1,"X"),0);
    int y = argInt(getArg(2,"Y"),0);

    if(LOG){
      Serial.print("[ OK ] LINE ABS");
      Serial.print(" X "); Serial.print(x);
      Serial.print(" Y "); Serial.print(y);
      Serial.println();
    }

    lineTo(x,y);
  }else if(cmdName=="l"){
    int x = argInt(getArg(1,"X"),0);
    int y = argInt(getArg(2,"Y"),0);

    if(LOG){
      Serial.print("[ OK ] LINE REL");
      Serial.print(" X "); Serial.print(x);
      Serial.print(" Y "); Serial.print(y);
      Serial.println();
    }

    lineBy(x,y);
  }else if(cmdName=="H"){
    int x = argInt(getArg(1,"X"),0);

    if(LOG){
      Serial.print("[ OK ] LINE H ABS");
      Serial.print(" X "); Serial.print(x);
      Serial.println();
    }

    lineVTo(x);
  }else if(cmdName=="h"){
    int x = argInt(getArg(1,"X"),0);

    if(LOG){
      Serial.print("[ OK ] LINE H REL");
      Serial.print(" X "); Serial.print(x);
      Serial.println();
    }

    lineHBy(x);
  }else if(cmdName=="V"){
    int y = argInt(getArg(1,"Y"),0);

    if(LOG){
      Serial.print("[ OK ] LINE V ABS");
      Serial.print(" Y "); Serial.print(y);
      Serial.println();
    }

    lineHTo(y);
  }else if(cmdName=="v"){
    int y = argInt(getArg(1,"Y"),0);

    if(LOG){
      Serial.print("[ OK ] LINE V REL");
      Serial.print(" Y "); Serial.print(y);
      Serial.println();
    }

    lineHBy(y);
  }else if(cmdName=="P"){
    String t = argString(getArg(1,"T"),"?");

    if(LOG){
      Serial.print("[ OK ] PRINT");
      Serial.print(" T "); Serial.print(t);
      Serial.println();
    }

    print(t);
  }else if(cmdName=="R"){
    int x = argInt(getArg(1,"X"),0);
    int y = argInt(getArg(2,"Y"),0);

    if(LOG){
      Serial.print("[ OK ] RECT ABS");
      Serial.print(" X "); Serial.print(x);
      Serial.print(" Y "); Serial.print(y);
      Serial.println();
    }

    rectTo(x,y);
  }else if(cmdName=="r"){
    int x = argInt(getArg(1,"X"),0);
    int y = argInt(getArg(2,"Y"),0);

    if(LOG){
      Serial.print("[ OK ] RECT REL");
      Serial.print(" X "); Serial.print(x);
      Serial.print(" Y "); Serial.print(y);
      Serial.println();
    }

    rectBy(x,y);
  }else if(cmdName=="F" || cmdName=="f" ){
    if(LOG){
      Serial.print("[ OK ] FILLSCREEN");
      Serial.println();
    }

    cls();
  }else if(cmdName=="z"){
    if(LOG){
      Serial.print("[ OK ] SHOW");
      Serial.println();
    }
    autoDisplay=false;
    show();
  }else if(cmdName=="Z"){
    if(LOG){
      Serial.print("[ OK ] SHOW");
      Serial.println();
    }
    autoDisplay=true;
    show();
  }else {
    Serial.print("[FAIL] invalid command : ");
    Serial.print(cmdName);
    Serial.print(" ");
    Serial.println(cmdArgs);
  }
}

String getArg(byte index, String key){
  String val = getArg(key);
  if(val.length()==0) val = getArg(index);
  return val;
}

String getArg(byte index) {
  byte currentIndex = 1; // args are 1-based
  bool inQuote = false;
  byte start = 0;
  byte length = 0;
  byte i = 0;
  while (i < cmdArgs.length()) {
    while (i < cmdArgs.length() && cmdArgs[i] == ' ') i++;
    if (i >= cmdArgs.length()) break;

    start = i;
    if (cmdArgs[i] == '"') {
      inQuote = true;
      i++; // skip opening quote
      while (i < cmdArgs.length() && cmdArgs[i] != '"') i++;
      i++; // include closing quote
    } else {
      while (i < cmdArgs.length() && cmdArgs[i] != ' ') i++;
    }
    if (currentIndex == index) {
      String ret=cmdArgs.substring(start, i);
      return ret;
    }
    currentIndex++;
  }
  return ""; // not found
}

String getArg(String key) {
  bool inQuote = false;
  byte i = 0;
  byte keyLen = key.length();
  while (i < cmdArgs.length()) {
    // skip leading spaces
    while (i < cmdArgs.length() && cmdArgs[i] == ' ') i++;

    if (i >= cmdArgs.length()) break;

    byte start = i;

    // Handle quoted arguments
    if (cmdArgs[i] == '"') {
      i++; // skip opening quote
      while (i < cmdArgs.length() && cmdArgs[i] != '"') i++;
      i++; // include closing quote
    } else {
      // Check if the argument starts with the key
      if (cmdArgs[i] == key[0]) {
        if (cmdArgs.substring(i, i + keyLen) == key) {
          byte valueStart = i + keyLen;
          byte valueEnd = valueStart;
          if (valueStart < cmdArgs.length() && cmdArgs[valueStart] == '"') {
            valueStart++;
            valueEnd = valueStart;
            while (valueEnd < cmdArgs.length() && cmdArgs[valueEnd] != '"') valueEnd++;
            return cmdArgs.substring(valueStart, valueEnd); 
          } else {
            while (valueEnd < cmdArgs.length() && cmdArgs[valueEnd] != ' ') valueEnd++;
            return cmdArgs.substring(valueStart, valueEnd);
          }
        }
      }
      while (i < cmdArgs.length() && cmdArgs[i] != ' ') i++;
    }
    i++;
  }
  return ""; // not found
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

uint16_t col=0;
bool bright = true;
// C
void color(byte r, byte g, byte b){
  col=matrix->Color888(r,g,b);
    // Calculate perceived brightness
  float luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  
  // You can tweak this threshold
  bright = luminance > 127;
}

int cx=0;
int cy=0;
uint16_t ocol=0;
void removeCursor(){
  matrix->drawPixel(cx,cy,ocol);
}

void displayCursor(){
  //ocol = matrix->getPixel(cx,cy);
  uint16_t ncol = millis() % 500 > 250 ? col: bright ? matrix->Color888(0,0,0) : matrix->Color888(255,255,255);
  matrix->drawPixel(cx,cy, ncol);
}

// M
void moveTo(int ax,int ay){ cx=ax; cy=ay; }
// m
void moveBy(int rx,int ry){ cx+=rx; cy+=ry; }
// L
void lineTo(int ax,int ay){ 
  matrix->drawLine(cx,cy, ax,ay, col);
  moveTo(ax,ay);
}
// l
void lineBy(int rx, int ry){ lineTo(cx+rx,cy+ry); }
// H
void lineHTo(int ax){ lineTo(ax,cy); }
// V
void lineVTo(int ay){ lineTo(cx,ay); }
// h
void lineHBy(int rx){ lineBy(rx,0); }
// v
void lineVBy(int ry){ lineBy(0,ry); }
// P
void print(String text){
  matrix->setCursor(cx, cy+4);
  matrix->setTextColor(col);
  matrix->print(text);
}
// R
void rectTo(int ax, int ay){ matrix->fillRect(cx,cy, ax,ay, col); }
// r
void rectBy(int rx, int ry){ matrix->fillRect(cx,cy, cx+rx,cy+ry, col); }

// F
void cls(){ matrix->fillScreen(col);}

// Z or z
void show(){ matrix->swapBuffers(true); }