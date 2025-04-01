#define PROJECT "Hub75  "__DATE__ " " __TIME__
/* Hub75 Manual */
#define R0 40
#define G0 41
#define B0 42
#define R1 43
#define G1 44
#define B1 45
#define LA 46
#define LB 47
#define LC 48
#define LD 49
#define LE 50
#define CL 51
#define OE 52
#define LT 53

int pins[]={CL};
byte pixels[64][32];
void setup() {
  Serial.begin(9600);
  Serial.println("===========================");
  Serial.println(PROJECT);

  pinMode(R0, OUTPUT);
  pinMode(G0, OUTPUT);
  pinMode(B0, OUTPUT);
  pinMode(R1, OUTPUT);
  pinMode(G1, OUTPUT);
  pinMode(B1, OUTPUT);
  pinMode(LA, OUTPUT);
  pinMode(LB, OUTPUT);
  pinMode(LC, OUTPUT);
  pinMode(LD, OUTPUT);
  pinMode(LE, OUTPUT);
  pinMode(CL, OUTPUT);
  pinMode(OE, OUTPUT);
  pinMode(LT, OUTPUT);

  /*
  for(byte y=0;y<16;y++){
    for(byte x=0;x<64;x++){
      if(x>1 && x<7 && y>1 && y<7){
        pixels[x][y]=5;
        pixels[x][y+16]=4;
      } else if(x>1 && x<7 && (y==1 || y==7)){
        pixels[x][y]=5;
        pixels[x][y+16]=4;
      } else if(y>1 && y<7 && (x==1 || x==7)){
        pixels[x][y]=5;
        pixels[x][y+16]=4;
      } else if(x+y>30 && x-y<=34){
        pixels[x][y]=2;
        pixels[x][y+16]=1;
      } else{
        pixels[x][y]=2;
        pixels[x][y+16]=4;
      }
    }
  }
  */
}
void pix(byte x, byte y, byte col){
  if(x>=0 && x<64 && y>=0 && y<32)
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
  rect(0,16,64,16,4);
  // sky
  rect(0,0,64,16,day?2:0);
  if(day){
    rect(pos+1,2,6,4,5);
    rect(pos+2,1,4,6,5);
  }else{
    rect(pos+3,1,1,1,7);
    rect(pos+2,1,1,4,7);
    rect(pos+1,2,1,4,7);
    rect(pos+3,4,1,1,7);
    rect(pos+6,4,1,1,7);
    rect(pos+2,5,5,1,7);
    rect(pos+2,6,4,1,7);
  }
}

void addr(byte adr){
  digitalWrite(LA, adr & 1);
  digitalWrite(LB, adr & 2);
  digitalWrite(LC, adr & 4);
  digitalWrite(LD, adr & 8);
  //digitalWrite(LE, adr & 16);
}
void color(byte c1, byte c2){
  digitalWrite(R0, c1 & 1);
  digitalWrite(G0, c1 & 2);
  digitalWrite(B0, c1 & 4);
  digitalWrite(R1, c2 & 1);
  digitalWrite(G1, c2 & 2);
  digitalWrite(B1, c2 & 4);
}
void draw(){
  for(byte y=0;y<16;y++){
    digitalWrite(OE, HIGH);
    addr(y);
    for(byte x=0;x<64;x++){
      color(pixels[x][y], pixels[x][y+16]);
      digitalWrite(CL, false);
      digitalWrite(CL, true);
    }
    digitalWrite(OE, LOW);
    delayMicroseconds(50);
  }
  digitalWrite(LT, LOW);
  digitalWrite(LT, HIGH);
}

byte x=1;
byte y=1;
byte dx=1;
byte dy=1;
byte t=1;
void update(){
  rect(x,y,4,4,t);
  t++;
  if(t==7) t=1;
  x+=dx;
  y+=dy;
  if(x<1) dx=1;
  if(y<1) dy=1;
  if(x>59) dx=-1;
  if(y>27) dy=-1;
  rect(x,y,4,4,7);
}
bool day=true;
void loop() {
  t++;
  if(t==72){
    t=0;
    day=!day;
  }
  scenery(day,t-7);
  draw();
}
