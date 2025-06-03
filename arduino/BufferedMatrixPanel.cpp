#ifndef BUFFERED_MATRIX_PANEL_H
#define BUFFERED_MATRIX_PANEL_H

#include <RGBmatrixPanel.h>
#include <Adafruit_GFX.h>

class BufferedMatrixPanel : public RGBmatrixPanel {
public:
  BufferedMatrixPanel(uint8_t a, uint8_t b, uint8_t c, uint8_t d, uint8_t clk,
                 uint8_t lat, uint8_t oe, boolean dbuf, uint8_t width = 32)
    : RGBmatrixPanel(a, b, c, d, clk, lat, oe, dbuf, width) {}
        
  void begin() {
    RGBmatrixPanel::begin();
    clearBuffer();
  }

  void drawPixel(int16_t x, int16_t y, uint16_t color) override {
    if (x >= 0 && x < width() && y >= 0 && y < height()) {
      RGBmatrixPanel::drawPixel(x, y, color);
      pixelBuffer[x][y] = color;
    }
  }

  uint16_t getPixel(int16_t x, int16_t y) const {
    if (x < 0 || x >= width() || y < 0 || y >= height()) return 0;
    return pixelBuffer[x][y];
  }

  void clearBuffer(uint16_t color = 0) {
    for (int y = 0; y < height(); y++) {
      for (int x = 0; x < width(); x++) {
        pixelBuffer[x][y] = color;
      }
    }
  }

private:
  // Tampon parallèle contenant la couleur de chaque pixel (format 16 bits 5/6/5)
  uint16_t pixelBuffer[64][32] = {}; // max 64x32, adapter selon ton panneau
};