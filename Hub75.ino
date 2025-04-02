#define PROJECT "Hub75  "__DATE__ " " __TIME__
#include <digitalWriteFast.h>
/* Hub75 Manual */
#define RF 40
#define GF 42
#define BF 41
#define RS 43
#define GS 45
#define BS 44
#define RA 46
#define RB 47
#define RC 48
#define RD 49
#define RE 50
#define CLK 51
#define LAT 52
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

int pins[]={CLK};
byte pixels[WIDTH][HEIGHT];
void setup() {
  Serial.begin(9600);
  Serial.println("===========================");
  Serial.println(PROJECT);

  pinModeFast(RF, OUTPUT);
  pinModeFast(GF, OUTPUT);
  pinModeFast(BF, OUTPUT);
  pinModeFast(RS, OUTPUT);
  pinModeFast(GS, OUTPUT);
  pinModeFast(BS, OUTPUT);
  pinModeFast(RA, OUTPUT);
  pinModeFast(RB, OUTPUT);
  pinModeFast(RC, OUTPUT);
  pinModeFast(RD, OUTPUT);
  pinModeFast(RE, OUTPUT);
  pinModeFast(CLK, OUTPUT);
  pinModeFast(OE, OUTPUT);
  pinModeFast(LAT, OUTPUT);
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
  digitalWriteFast(RA, adr & 1);
  digitalWriteFast(RB, adr & 2);
  digitalWriteFast(RC, adr & 4);
  digitalWriteFast(RD, adr & 8);
  //digitalWrite(RE, adr & 16);
}
void color(byte c1, byte c2){
  digitalWriteFast(RF, c1 & RED);
  digitalWriteFast(GF, c1 & GREEN);
  digitalWriteFast(BF, c1 & BLUE);

  digitalWriteFast(RS, c2 & RED);
  digitalWriteFast(GS, c2 & GREEN);
  digitalWriteFast(BS, c2 & BLUE);
}
int lum=300;
void draw(){
  digitalWrite(OE, HIGH);
  for(byte y=0;y<16;y++){
    addr(y);
    for(byte x=0;x<WIDTH;x++){
      color(pixels[x][y], pixels[x][y+16]);
      digitalWriteFast(CLK, false);
      digitalWriteFast(CLK, true);
    }
    digitalWriteFast(LAT, LOW);
    delayMicroseconds(lum);
    digitalWriteFast(LAT, HIGH);
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