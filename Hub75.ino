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
#define Color(x,y,z)     Color444(x/16,y/16,z/16)

#define LED_BLACK           0

#define LED_RED_VERYLOW    (3 <<  11)
#define LED_RED_LOW        (7 <<  11)
#define LED_RED_MEDIUM     (15 << 11)
#define LED_RED_HIGH       (31 << 11)

#define LED_GREEN_VERYLOW  (1 <<  5)
#define LED_GREEN_LOW      (15 << 5)
#define LED_GREEN_MEDIUM   (31 << 5)
#define LED_GREEN_HIGH     (63 << 5)

#define LED_BLUE_VERYLOW     3
#define LED_BLUE_LOW         7
#define LED_BLUE_MEDIUM     15
#define LED_BLUE_HIGH       31

#define LED_ORANGE_VERYLOW (LED_RED_VERYLOW + LED_GREEN_VERYLOW)
#define LED_ORANGE_LOW     (LED_RED_LOW     + LED_GREEN_LOW)
#define LED_ORANGE_MEDIUM  (LED_RED_MEDIUM  + LED_GREEN_MEDIUM)
#define LED_ORANGE_HIGH    (LED_RED_HIGH    + LED_GREEN_HIGH)

#define LED_PURPLE_VERYLOW (LED_RED_VERYLOW + LED_BLUE_VERYLOW)
#define LED_PURPLE_LOW     (LED_RED_LOW     + LED_BLUE_LOW)
#define LED_PURPLE_MEDIUM  (LED_RED_MEDIUM  + LED_BLUE_MEDIUM)
#define LED_PURPLE_HIGH    (LED_RED_HIGH    + LED_BLUE_HIGH)

#define LED_CYAN_VERYLOW   (LED_GREEN_VERYLOW + LED_BLUE_VERYLOW)
#define LED_CYAN_LOW       (LED_GREEN_LOW     + LED_BLUE_LOW)
#define LED_CYAN_MEDIUM    (LED_GREEN_MEDIUM  + LED_BLUE_MEDIUM)
#define LED_CYAN_HIGH      (LED_GREEN_HIGH    + LED_BLUE_HIGH)

#define LED_WHITE_VERYLOW  (LED_RED_VERYLOW + LED_GREEN_VERYLOW + LED_BLUE_VERYLOW)
#define LED_WHITE_LOW      (LED_RED_LOW     + LED_GREEN_LOW     + LED_BLUE_LOW)
#define LED_WHITE_MEDIUM   (LED_RED_MEDIUM  + LED_GREEN_MEDIUM  + LED_BLUE_MEDIUM)
#define LED_WHITE_HIGH     (LED_RED_HIGH    + LED_GREEN_HIGH    + LED_BLUE_HIGH)

#define SCREEN_WIDTH  64
#define SCREEN_HEIGHT 32

String texte = "Welcome";
int xPos = SCREEN_WIDTH;  // Commencer à droite

void setup() {
  Serial.begin(9600);  // Initialiser la communication série à 9600 bauds
  matrix->begin();
  matrix->setTextWrap(false);
  matrix->setBrightness(BRIGHTNESS);
  matrix->setTextColor(LED_GREEN_HIGH);
  matrix->setTextSize(1);
  matrix->clear();
  matrix->show();
}

void display_scrollText() {
    if(texte.length()==0) return;
    matrix->clear();
    matrix->setTextWrap(false);
    matrix->setTextSize(1);
    matrix->setRotation(0);
    int min=texte.length()*-6;
    for (int x=64; x>=min; x--) {
        matrix->clear();
        matrix->setCursor(x,SCREEN_HEIGHT/2-4);
        matrix->print(texte);
        matrix->show();
        delay(25);
    }
    texte="";
}

void loop() {
  if (Serial.available()) {
    texte = Serial.readString();  // Lire la chaîne de caractères reçue sur le port série
    xPos = SCREEN_WIDTH;  // Réinitialiser la position du texte
    Serial.println(texte);
  }
  display_scrollText();
}
