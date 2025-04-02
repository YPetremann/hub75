#define PROJECT "Hub75  "__DATE__ " " __TIME__
#include <digitalWriteFast.h>
/* Hub75 Manual */
#define R0 40
#define G0 42
#define B0 41
#define R1 43
#define G1 45
#define B1 44
#define LA 46
#define LB 47
#define LC 48
#define LD 49
#define LE 50
#define CL 51
#define LT 52
#define OE 53

#define BLACK 0
#define RED 1
#define GREEN 2
#define YELLOW 3
#define BLUE 4
#define MAGENTA 5
#define CYAN 6
#define WHITE 7

#define WIDTH 128
#define HEIGHT 32

int pins[]={CL};
byte pixels[WIDTH][HEIGHT];
void setup() {
  Serial.begin(9600);
  Serial.println("===========================");
  Serial.println(PROJECT);

  pinModeFast(R0, OUTPUT);
  pinModeFast(G0, OUTPUT);
  pinModeFast(B0, OUTPUT);
  pinModeFast(R1, OUTPUT);
  pinModeFast(G1, OUTPUT);
  pinModeFast(B1, OUTPUT);
  pinModeFast(LA, OUTPUT);
  pinModeFast(LB, OUTPUT);
  pinModeFast(LC, OUTPUT);
  pinModeFast(LD, OUTPUT);
  pinModeFast(LE, OUTPUT);
  pinModeFast(CL, OUTPUT);
  pinModeFast(OE, OUTPUT);
  pinModeFast(LT, OUTPUT);
}
void pix(byte x, byte y, byte col){
  if(x>=0 && x<WIDTH && y>=0 && y<HEIGHT)
    pixels[x][y]=col;
}
void rect(byte x,byte y,byte w,byte h,byte col){
  byte mx=x+w;
  byte my=y+h;
  for(byte i=x;i<mx;i++)
    for(byte j=y;j<my;j++)
      pix(i,j,col);
}

void scenery(bool day, byte pos){
  // grass
  rect(0,HEIGHT/2,WIDTH,HEIGHT/2, GREEN);
  // sky
  rect(0,0,WIDTH,HEIGHT/2, day?BLUE:BLACK);
  if(day){
    rect(pos+1,2,6,4,YELLOW);
    rect(pos+2,1,4,6,YELLOW);
  }else{
    rect(pos+3,1,1,1,WHITE);
    rect(pos+2,1,1,4,WHITE);
    rect(pos+1,2,1,4,WHITE);
    rect(pos+3,4,1,1,WHITE);
    rect(pos+6,4,1,1,WHITE);
    rect(pos+2,5,5,1,WHITE);
    rect(pos+2,6,4,1,WHITE);
  }
}

void addr(byte adr){
  digitalWriteFast(LA, adr & 1);
  digitalWriteFast(LB, adr & 2);
  digitalWriteFast(LC, adr & 4);
  digitalWriteFast(LD, adr & 8);
  //digitalWrite(LE, adr & 16);
}
void color(byte c1, byte c2){
  digitalWriteFast(R0, c1 & RED);
  digitalWriteFast(G0, c1 & GREEN);
  digitalWriteFast(B0, c1 & BLUE);

  digitalWriteFast(R1, c2 & RED);
  digitalWriteFast(G1, c2 & GREEN);
  digitalWriteFast(B1, c2 & BLUE);
}
int lum=300;
void draw(){
  digitalWrite(OE, HIGH);
  for(byte y=0;y<16;y++){
    addr(y);
    for(byte x=0;x<WIDTH;x++){
      color(pixels[x][y], pixels[x][y+16]);
      digitalWriteFast(CL, false);
      digitalWriteFast(CL, true);
    }
    digitalWriteFast(LT, LOW);
    delayMicroseconds(lum);
    digitalWriteFast(LT, HIGH);
  }
  digitalWriteFast(OE, LOW);
}

byte t=1;
bool day=true;
void update() {
  t++;
  if(t==128+8) day=!day;
  if(t==128+8) t=0;
}
void serialEvent() {
  char s=Serial.read();
  if(s<65) return;
  Serial.print(s);
  Serial.print(",");
  lum=25*(s-65);
  Serial.println(lum);
}
void loop() {
  update();
  scenery(day,t-7);
  draw();
}