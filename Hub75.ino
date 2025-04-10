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
#define show()           swapBuffers(true)
#define Color(x,y,z)     (x/16)<<11&(y/16)<<5&(z/16)

#define SCREEN_WIDTH  64
#define SCREEN_HEIGHT 32

struct Pos {
  uint8_t x;
  uint8_t y;
};
struct Target {
  int color;
  Pos a;
  Pos b;
};
struct Dot {
  Pos o;
  Pos n;
};
Target targ;
Target trap;
Dot dot;

uint8_t clamp(uint8_t min,uint8_t cur,uint8_t max){
  if(cur<=min) return min;
  if(cur>=max) return max;
  return cur;
}
int combo=0;
int score=0;
void resetGame(){
  combo=0;
  score=0;
}
byte posToIndex(byte x,byte y){
  return (x>21?2:x>10?1:0)+(y>21?2:y>10?1:0)*3;
}

byte avail[9] = {0, 1, 2, 3, 4, 5, 6, 7, 8};
void resetAvail(){
  for(byte i=0;i<9;i++) avail[i]=i;
}
void swapAvail(byte a,byte c){ 
  byte b=avail[a]; 
  avail[a]=avail[c]; 
  avail[c]=b;
}
void genTargets(){
  byte op=posToIndex(dot.o.x,dot.o.y);
  byte np=posToIndex(dot.n.x,dot.n.y);
  resetAvail();
  swapAvail(op,8);
  swapAvail(np,7);
  byte rndc=random(7);
  byte cp=avail[rndc];
  swapAvail(rndc,6);
  byte rndt=random(6);
  byte tp=avail[rndt];

  Serial.print(op);Serial.print(",");
  Serial.print(np);Serial.print("  ,");
  Serial.print(rndc);Serial.print(",");
  Serial.print(cp);Serial.print("  ");
  Serial.print(rndt);Serial.print(",");
  Serial.print(tp);Serial.print("  ");
  for(byte i=0;i<9;i++) {
    Serial.print(",");
    Serial.print(avail[i]);
  }  
  Serial.println();

  targ.a.x=(cp%3)*11; targ.b.x=targ.a.x+10;
  targ.a.y=(cp/3)*11; targ.b.y=targ.a.y+10;
  trap.a.x=(tp%3)*11; trap.b.x=trap.a.x+10;
  trap.a.y=(tp/3)*11; trap.b.y=trap.a.y+10;
  
  matrix->fillScreen(0);
  matrix->fillRect(targ.a.x,targ.a.y,targ.b.x-targ.a.x,targ.b.y-targ.a.y,31<<5);
  matrix->fillRect(trap.a.x,trap.a.y,trap.b.x-trap.a.x,trap.b.y-trap.a.y,31<<11);

  matrix->drawLine(32,0,32,32,0xFFFF);
  matrix->setCursor(34, 0);
  matrix->setTextColor(0xFFFF);
  matrix->print(score);
}
bool check(Target to){
  return dot.n.x>=to.a.x && dot.n.x<=to.b.x && dot.n.y>=to.a.y && dot.n.y<=to.b.y;
}
void breakCombo(){
  combo=0;

  matrix->fillRect(0,0,32,32,0xFFFF);
  matrix->show();
  delay(100);
  matrix->fillScreen(0);
  genTargets();
}

void scoreCombo(){
  combo++; score+=combo;
  genTargets();
}

void setup() {
  Serial.begin(9600);
  matrix->begin();
  matrix->fillScreen(Color(255,255,0));
  matrix->setBrightness(BRIGHTNESS);
  matrix->show();
  dot.n.x=16;
  dot.n.y=16;
  resetGame();
  genTargets();
}
void loop() {
  matrix->drawLine(dot.o.x,dot.o.y,dot.n.x,dot.n.y,0);
  dot.o.x=dot.n.x; dot.o.y=dot.n.y;
  dot.n.x = 31-(analogRead(A9)*32/1024);
  dot.n.y = analogRead(A10)*32/1024;
  matrix->drawLine(dot.o.x,dot.o.y,dot.n.x,dot.n.y,31);
  matrix->drawPixel(dot.n.x,dot.n.y,0xFFFF);
  if(check(targ)) scoreCombo();
  if(check(trap)) breakCombo();
  matrix->show();

  if(dot.n.x!=dot.o.x || dot.n.y!=dot.o.y){
    Serial.print(dot.n.x);Serial.print(",");
    Serial.print(dot.n.y);Serial.println();
  }

  delay(10);
}
