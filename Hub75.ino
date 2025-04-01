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
}

void addr(byte adr){
  digitalWrite(LA, adr & 1);
  digitalWrite(LB, adr & 2);
  digitalWrite(LC, adr & 4);
  digitalWrite(LD, adr & 8);
  //digitalWrite(LE, adr & 16);
}
void color(int c1, int c2){
  digitalWrite(R0, c1 & 1);
  digitalWrite(G0, c1 & 2);
  digitalWrite(B0, c1 & 4);
  digitalWrite(R1, c2 & 1);
  digitalWrite(G1, c2 & 2);
  digitalWrite(B1, c2 & 4);
}
void frame(){
}
void latch(){
}
void clock(){
}
void loop() {
  for(int y=0;y<16;y++){
    digitalWrite(OE, HIGH);
    addr(y);
    for(int x=0;x<64;x++){
      if(x>1 && x<7 && y>1 && y<7)
        color(5,4);
      else if(x>1 && x<7 && (y==1 || y==7))
        color(5,4);
      else if(y>1 && y<7 && (x==1 || x==7))
        color(5,4);
      else if(x+y>30 && x-y<=34)
        color(2,1);
      else
        color(2,4);
      digitalWrite(CL, false);
      digitalWrite(CL, true);
    }
    digitalWrite(OE, LOW);
    delayMicroseconds(50);
  }
  digitalWrite(LT, LOW);
  digitalWrite(LT, HIGH);
}
