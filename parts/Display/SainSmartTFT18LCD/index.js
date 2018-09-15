//SainSmart ST7735 1.8" TFT LCD 128x160 pixel
class SainSmartTFT18LCD {
  constructor() {
    this.keys = ['vcc', 'gnd', 'scl', 'sda', 'dc', 'res', 'cs'];
    this.required = ['scl', 'sda', 'dc', 'res', 'cs'];

    this.displayIoNames = {
      vcc: 'vcc',
      gnd: 'gnd',
      scl: 'scl',
      sda: 'sda',
      dc:  'dc',
      res: 'res',
      cs:  'cs',
    };
  }

  static info() {
    return {
      name: 'SainSmartTFT18LCD',
    };
  }

  wired(obniz) {
    this.debugprint = false;
    this.obniz = obniz;
    this.io_dc = obniz.getIO(this.params.dc);
    this.io_res = obniz.getIO(this.params.res);
    this.io_cs = obniz.getIO(this.params.cs);

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.params.frequency = 16 * 1000 * 1000; //16MHz
    this.params.mode = 'master';
    this.params.clk = this.params.scl;
    this.params.mosi = this.params.sda;
    this.params.drive = '3v';
    this.spi = this.obniz.getSpiWithConfig(this.params);

    this.io_dc.output(true);
    this.io_cs.output(false);

    this.width = ST7735_TFTWIDTH;
    this.height = ST7735_TFTHEIGHT;

    this.writeBuffer = []; //1024bytes bufferring

    this._setPresetColor();
    this.init();
  }

  print_debug(v) {
    if (this.debugprint) {
      console.log('SainSmartTFT18LCD: ' + Array.prototype.slice.call(arguments).join(''));
    }
  }
  _deadSleep(waitMsec) {
    let startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
  }
  _reset() {
    this.io_res.output(false);
    this._deadSleep(10);
    this.io_res.output(true);
    this._deadSleep(10);
  }

  writeCommand(cmd) {
    this.io_dc.output(false);
    this.io_cs.output(false);
    this.spi.write([cmd]);
    this.io_cs.output(true);
  }
  writeData(data) {
    this.io_dc.output(true);
    this.io_cs.output(false);
    this.spi.write(data);
    this.io_cs.output(true);
  }
  write(cmd, data) {
    if (data.length == 0) return;
    this.writeCommand(cmd);
    this.writeData(data);
  }
  async asyncwait() {
    return await this.spi.writeWait([0x00]);
  }
  _writeFlush() {
    while (this.writeBuffer.length > 0) {
      if (this.writeBuffer.length > 1024) {
        let data = this.writeBuffer.slice(0, 1024);
        this.writeData(data);
        this.writeBuffer.splice(0, 1024);
      } else {
        if (this.writeBuffer.length > 0) this.writeData(this.writeBuffer);
        this.writeBuffer = [];
      }
    }
  }
  _writeBuffer(data) {
    if (data && data.length > 0) {
      this.writeBuffer = this.writeBuffer.concat(data);
    } else {
      this._writeFlush();
    }
  }

  color16(r, g, b) {
//  1st byte  (r & 0xF8 | g >> 5)
//  2nd byte  (g & 0xFC << 3 | b >> 3)
    return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
  }

  _initG() { // initialize for Green Tab
    this.writeCommand(ST7735_SLPOUT);    //Sleep out & booster on
    this.obniz.wait(120);
    this.write(ST7735_FRMCTR1, [0x01, 0x2C, 0x2D]);
    this.write(ST7735_FRMCTR2, [0x01, 0x2C, 0x2D]);
    this.write(ST7735_FRMCTR3, [0x01, 0x2C, 0x2D, 0x01, 0x2C, 0x2D]);
    this.write(ST7735_INVCTR, [0x07]);
    this.write(ST7735_PWCTR1, [0xA2, 0x02, 0x84]);
    this.write(ST7735_PWCTR2, [0xC5]);
    this.write(ST7735_PWCTR3, [0x0A, 0x00]);
    this.write(ST7735_PWCTR4, [0x8A, 0x2A]);
    this.write(ST7735_PWCTR5, [0x8A, 0xEE]);
    this.write(ST7735_VMCTR1, [0x0E]);
    this.write(ST7735_GMCTRP1, [0x02, 0x1C, 0x07, 0x12, 0x37, 0x32, 0x29, 0x2D, 0x29, 0x25, 0x2B, 0x39, 0x00, 0x01, 0x03, 0x10]);
    this.write(ST7735_GMCTRN1, [0x03, 0x1D, 0x07, 0x06, 0x2E, 0x2C, 0x29, 0x2D, 0x2E, 0x2E, 0x37, 0x3F, 0x00, 0x00, 0x02, 0x10]);
    this.write(ST7735_COLMOD, [ST7735_16bit]);   // color format: 16bit/pixel
  }

  init() {
    this._reset();
    this._initG();
    this.setDisplayOn();
    this.setRotation(0);
  }

  setDisplayOn() {
    this.writeCommand(ST7735_DISPON);
  }
  setDisplayOff() {
    this.writeCommand(ST7735_DISPOFF);
  }
  setDisplay(on) {
    if (on == true) this.setDisplayOn(); else this.setDisplayOff();
  }

  setInversionOn() {
    this.writeCommand(ST7735_INVON);
  }
  setInversionOff() {
    this.writeCommand(ST7735_INVOFF);
  }
  setInversion(inversion) {
    if (inversion == true) this.setInversionOn(); else this.setInversionOff();
  }

  setRotation(m) {
    const MADCTL_MY  = 0x80;
    const MADCTL_MX  = 0x40;
    const MADCTL_MV  = 0x20;
    const MADCTL_ML  = 0x10;
    const MADCTL_RGB = 0x00; //always RGB, never BGR
    const MADCTL_MH  = 0x04;

    let data;
    let rotation = m % 4; // can't be higher than 3
    switch (rotation) {
     case 0:
      data = [MADCTL_MX | MADCTL_MY | MADCTL_RGB];
      this.width  = ST7735_TFTWIDTH;
      this.height = ST7735_TFTHEIGHT;
      break;
     case 1:
      data = [MADCTL_MY | MADCTL_MV | MADCTL_RGB];
      this.width  = ST7735_TFTHEIGHT;
      this.height = ST7735_TFTWIDTH;
      break;
     case 2:
      data = [MADCTL_RGB];
      this.width  = ST7735_TFTWIDTH;
      this.height = ST7735_TFTHEIGHT;
      break;
     case 3:
      data = [MADCTL_MX | MADCTL_MV | MADCTL_RGB];
      this.width  = ST7735_TFTHEIGHT;
      this.height = ST7735_TFTWIDTH;
      break;
    }
    this.write(ST7735_MADCTL, data);
    this.setAddrWindow(0, 0, this.width - 1, this.height - 1);
  }

  setAddrWindow(x0, y0, x1, y1) {
    this.print_debug(`setAddrWindow: (x0: ${x0}, y0: ${y0}) - (x1: ${x1}, y1: ${y1})`);

    if (x0 < 0) x0 = 0;
    if (y0 < 0) y0 = 0;
    if (x1 < 0) x1 = 0;
    if (y1 < 0) y1 = 0;

  // column addr set
    this.write(ST7735_CASET, [0x00, x0, 0x00, x1]); // XSTART-XEND
  // row addr set
    this.write(ST7735_RASET, [0x00, y0, 0x00, y1]);  // YSTART-YEND
  // write to RAM
    this.writeCommand(ST7735_RAMWR);
    this.writeBuffer = [];
  }

//__swap(a, b) { let t = a; a = b; b = t; }

  fillScreen(color) {
    this.fillRect(0, 0, this.width, this.height, color);
  }
  fillRect(x, y, w, h, color) {
    if ((x >= this.width) || (y >= this.height)) return;
    if ((x + w - 1) >= this.width)  w = this.width  - x;
    if ((y + h - 1) >= this.height) h = this.height - y;

    this.setAddrWindow(x, y, x + w - 1, y + h - 1);

    let hi = color >> 8, lo = color & 0xFF;
    var data = [];

    for(y = h; y > 0; y--) {
      for(x = w; x > 0; x--) {
        data.push(hi);
        data.push(lo);
      }
    }
    this._writeBuffer(data);
    this._writeBuffer(); //for flush
  }
  drawRect(x, y, w, h, color) {
    this.drawHLine(x, y, w, color);
    this.drawHLine(x, y + h - 1, w, color);
    this.drawVLine(x, y, h, color);
    this.drawVLine(x + w - 1, y, h, color);
  }
  drawCircle(x0, y0, r, color) {
    var f = 1 - r;
    var ddF_x = 1;
    var ddF_y = -2 * r;
    var x = 0;
    var y = r;

    this.drawPixel(x0, y0 + r, color);
    this.drawPixel(x0, y0 - r, color);
    this.drawPixel(x0 + r, y0, color);
    this.drawPixel(x0 - r, y0, color);

    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x;

      this.drawPixel(x0 + x, y0 + y, color);
      this.drawPixel(x0 - x, y0 + y, color);
      this.drawPixel(x0 + x, y0 - y, color);
      this.drawPixel(x0 - x, y0 - y, color);
      this.drawPixel(x0 + y, y0 + x, color);
      this.drawPixel(x0 - y, y0 + x, color);
      this.drawPixel(x0 + y, y0 - x, color);
      this.drawPixel(x0 - y, y0 - x, color);
    }
  }
  _drawCircleHelper(x0, y0, r, cornername, color) {
    var f = 1 - r;
    var ddF_x = 1;
    var ddF_y = -2 * r;
    var x = 0;
    var y = r;

    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f     += ddF_y;
      }
      x++;
      ddF_x += 2;
      f     += ddF_x;
      if (cornername & 0x4) {
        this.drawPixel(x0 + x, y0 + y, color);
        this.drawPixel(x0 + y, y0 + x, color);
      }
      if (cornername & 0x2) {
        this.drawPixel(x0 + x, y0 - y, color);
        this.drawPixel(x0 + y, y0 - x, color);
      }
      if (cornername & 0x8) {
        this.drawPixel(x0 - y, y0 + x, color);
        this.drawPixel(x0 - x, y0 + y, color);
      }
      if (cornername & 0x1) {
        this.drawPixel(x0 - y, y0 - x, color);
        this.drawPixel(x0 - x, y0 - y, color);
      }
    }
  }
  fillCircle(x0, y0, r, color) {
    this.drawVLine(x0, y0 - r, 2 * r + 1, color);
    this._fillCircleHelper(x0, y0, r, 3, 0, color);
  }
  _fillCircleHelper(x0, y0, r, cornername, delta, color) {
    var f = 1 - r;
    var ddF_x = 1;
    var ddF_y = -2 * r;
    var x = 0;
    var y = r;

    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f     += ddF_y;
      }
      x++;
      ddF_x += 2;
      f     += ddF_x;

      if (cornername & 0x1) {
        this.drawVLine(x0 + x, y0 - y, 2 * y + 1 + delta, color);
        this.drawVLine(x0 + y, y0 - x, 2 * x + 1 + delta, color);
      }
      if (cornername & 0x2) {
        this.drawVLine(x0 - x, y0 - y, 2 * y + 1 + delta, color);
        this.drawVLine(x0 - y, y0 - x, 2 * x + 1 + delta, color);
      }
    }
  }
  drawRoundRect(x, y, w, h, r, color) {
    this.drawHLine(x + r    , y        , w - 2 * r, color); // Top
    this.drawHLine(x + r    , y + h - 1, w - 2 * r, color); // Bottom
    this.drawVLine(x        , y + r    , h - 2 * r, color); // Left
    this.drawVLine(x + w - 1, y + r    , h - 2 * r, color); // Right

    this._drawCircleHelper(x + r        , y + r        , r, 1, color);
    this._drawCircleHelper(x + w - r - 1, y + r        , r, 2, color);
    this._drawCircleHelper(x + w - r - 1, y + h - r - 1, r, 4, color);
    this._drawCircleHelper(x + r        , y + h - r - 1, r, 8, color);
  }
  fillRoundRect(x, y, w, h, r, color) {
    this.fillRect(x + r, y, w - 2 * r, h, color);

    this._fillCircleHelper(x + w - r - 1, y + r, r, 1, h - 2 * r - 1, color);
    this._fillCircleHelper(x + r        , y + r, r, 2, h - 2 * r - 1, color);
  }
  drawTriangle(x0, y0, x1, y1, x2, y2, color) {
    this.drawLine(x0, y0, x1, y1, color);
    this.drawLine(x1, y1, x2, y2, color);
    this.drawLine(x2, y2, x0, y0, color);
  }
  fillTriangle (x0, y0, x1, y1, x2, y2, color) {
    var a, b, y, last;

    // Sort coordinates by Y order (y2 >= y1 >= y0)
    if (y0 > y1) {
      y1 = [y0, y0 = y1][0]; //this._swap(y0, y1);
      x1 = [x0, x0 = x1][0]; //this._swap(x0, x1);
    }
    if (y1 > y2) {
      y2 = [y1, y1 = y2][0]; //this._swap(y2, y1);
      x2 = [x1, x1 = x2][0]; //this._swap(x2, x1);
    }
    if (y0 > y1) {
      y1 = [y0, y0 = y1][0]; //this._swap(y0, y1);
      x1 = [x0, x0 = x1][0]; //this._swap(x0, x1);
    }

    if (y0 == y2) { // Handle awkward all-on-same-line case as its own thing
      a = b = x0;
      if (x1 < a)      a = x1;
      else if (x1 > b) b = x1;
      if (x2 < a)      a = x2;
      else if (x2 > b) b = x2;
      this.drawHLine(a, y0, b - a + 1, color);
      return;
    }

    var
      dx01 = x1 - x0,
      dy01 = y1 - y0,
      dx02 = x2 - x0,
      dy02 = y2 - y0,
      dx12 = x2 - x1,
      dy12 = y2 - y1,
      sa   = 0,
      sb   = 0;

    if (y1 == y2) last = y1;     // include y1 scanline
    else          last = y1 - 1; // skip it

    for (y = y0; y <= last; y++) {
      a   = x0 + Math.floor(sa / dy01);
      b   = x0 + Math.floor(sb / dy02);
      sa += dx01;
      sb += dx02;
      if (a > b) b = [a, a = b][0]; //this._swap(a,b);
      this.drawHLine(a, y, b - a + 1, color);
    }

    sa = dx12 * (y - y1);
    sb = dx02 * (y - y0);
    for (; y <= y2; y++) {
      a   = x1 + Math.floor(sa / dy12);
      b   = x0 + Math.floor(sb / dy02);
      sa += dx12;
      sb += dx02;
      if (a > b) b = [a, a = b][0]; //this._swap(a,b);
      this.drawHLine(a, y, b - a + 1, color);
    }
  }
  drawVLine(x, y, h, color) {
    if ((x >= this.width) || (y >= this.height)) return;
    if ((y + h - 1) >= this.height) h = this.height - y;

    this.setAddrWindow(x, y, x, y + h - 1);

    let hi = color >> 8, lo = color & 0xFF;
    var data = [];
    while (h--) {
      data.push(hi);
      data.push(lo);
    }
    this.writeData(data);
  }
  drawHLine(x, y, w, color) {
    if ((x >= this.width) || (y >= this.height)) return;
    if ((x + w - 1) >= this.width)  w = this.width - x;

    this.setAddrWindow(x, y, x + w - 1, y);

    let hi = color >> 8, lo = color & 0xFF;
    var data = [];
    while (w--) {
      data.push(hi);
      data.push(lo);
    }
    this.writeData(data);
  }
  drawLine(x0, y0, x1, y1, color) {
    let step = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (step) {
      y0 = [x0, x0 = y0][0]; //this._swap(x0, y0);
      y1 = [x1, x1 = y1][0]; //this._swap(x1, y1);
    }
    if (x0 > x1) {
      x1 = [x0, x0 = x1][0]; //this._swap(x0, x1);
      y1 = [y0, y0 = y1][0]; //this._swap(y0, y1);
    }

    let dx = x1 - x0;
    let dy = Math.abs(y1 - y0);

    let err = dx / 2;
    let ystep = (y0 < y1) ? 1 : -1;

    for (; x0 <= x1; x0++) {
      if (step) {
        this.drawPixel(y0, x0, color);
      } else {
        this.drawPixel(x0, y0, color);
      }
      err -= dy;
      if (err < 0) {
        y0 += ystep;
        err += dx;
      }
    }
  }
  drawPixel(x, y, color) {
    if ((x < 0) || (x >= this.width) || (y < 0) || (y >= this.height)) return;

    this.setAddrWindow(x, y, x + 1, y + 1);
    this.writeData([color >> 8, color & 0xFF]);
  }
  drawChar(x, y, ch, color, bg, size) {
    bg = bg || color;
    size = size || 1;
    if ((x >= this.width)		|| // Clip right
      (y >= this.height)		|| // Clip bottom
     ((x + 6 * size - 1) < 0)	|| // Clip left
     ((y + 8 * size - 1) < 0))     // Clip top
    return;

    let c = ch.charCodeAt(0);
    for (let i = 0; i < 6; i++) {
      var line = (i == 5) ? 0 : font[(c * 5) + i];
      for (let j = 0; j < 8; j++) {
        if (line & 0x1) {
          if (size == 1) // default size
            this.drawPixel(x + i, y + j, color);
          else {  // big size
            this.fillRect(x + (i * size), y + ( j * size), size, size, color);
          }
        } else if (bg != color) {
          if (size == 1) // default size
            this.drawPixel(x + i, y + j, bg);
          else {  // big size
            this.fillRect(x + i * size, y + j * size, size, size, bg);
          } 	
        }
        line >>= 1;
      }
    }
  }
  drawString(x, y, str, color, bg, size, wrap) {
    bg = bg || color;
    size = size || 1;
    wrap = wrap || true;
    for (let n=0; n < str.length; n++) {
      let c = str.charAt(n);
      if (c == '\n') {
        y += size * 8;
        x = 0;
      } else if (c == '\r') {
        // skip em
      } else {
        this.drawChar(x, y, c, color, bg, size);
        x += size*6;
        if (wrap && (x > (this.width - size * 6))) {
          y += (size * 8);
          x = 0;
        }
      }
    }
    return [x, y];
  }
  drawContextBound(context, x0, y0, width, height, x1, y1, gray) {
    x0 = x0 || 0;
    y0 = y0 || 0;
    width = width || context.canvas.clientWidth;
    height = height || context.canvas.clientHeight;
    x1 = x1 || 0;
    y1 = y1 || 0;
    gray = gray || false;
    this.write(ST7735_COLMOD, [ST7735_18bit]); //18bit/pixel
    let imageData = context.getImageData(x0, y0, width, height).data;
    var rgb = [];
    for (let n = 0; n < imageData.length; n += 4) {
      let r = imageData[n + 0];
      let g = imageData[n + 1];
      let b = imageData[n + 2];
      if (!gray) {
        rgb.push(r);
        rgb.push(g);
        rgb.push(b);
      } else {
        let gs = Math.round(0.299 * r + 0.587 * g + 0.114 * b)
        rgb.push(gs);
        rgb.push(gs);
        rgb.push(gs);
      }
    }
    this.setAddrWindow(x1, y1, width - 1, height - 1);
    this._writeBuffer(rgb);
    this._writeBuffer(); //for flush
    this.write(ST7735_COLMOD, [ST7735_16bit]); //16bit/pixel
  }
  drawContext(context, gray) {
    gray = gray || false;
    this.drawContextBound(context, 0, 0, this.width, this.height, 0, 0, gray)
  }
  rawBound(x, y, width, height, pixels) {
    let rgb = [];
    pixels.forEach(function (v) {
      rgb.push((v & 0xFF0000) >> 16);
      rgb.push((v & 0xFF00) >> 8);
      rgb.push(v & 0xFF);
    });
    this.setAddrWindow(x, y, width - 1, height - 1);
    this._writeBuffer(rgb);
    this._writeBuffer(); //for flush
    this.write(ST7735_COLMOD, [ST7735_16bit]); //16bit/pixel
  }
  raw(pixels) {
    this.raw(0, 0, this.width, this.height, pixels);
  }

  _setPresetColor() {
    this.color = {
      AliceBlue            : 0xf7df,
      AntiqueWhite         : 0xff5a,
      Aqua                 : 0x07ff,
      Aquamarine           : 0x7ffa,
      Azure                : 0xf7ff,
      Beige                : 0xf7bb,
      Bisque               : 0xff38,
      Black                : 0x0000,
      BlanchedAlmond       : 0xff59,
      Blue                 : 0x001f,
      BlueViolet           : 0x895c,
      Brown                : 0xa145,
      BurlyWood            : 0xddd0,
      CadetBlue            : 0x5cf4,
      Chartreuse           : 0x7fe0,
      Chocolate            : 0xd343,
      Coral                : 0xfbea,
      CornflowerBlue       : 0x64bd,
      Cornsilk             : 0xffdb,
      Crimson              : 0xd8a7,
      Cyan                 : 0x07ff,
      DarkBlue             : 0x0011,
      DarkCyan             : 0x0451,
      DarkGoldenRod        : 0xbc21,
      DarkGray             : 0xad55,
      DarkGreen            : 0x0320,
      DarkKhaki            : 0xbdad,
      DarkMagenta          : 0x8811,
      DarkOliveGreen       : 0x5345,
      DarkOrange           : 0xfc60,
      DarkOrchid           : 0x9999,
      DarkRed              : 0x8800,
      DarkSalmon           : 0xecaf,
      DarkSeaGreen         : 0x8df1,
      DarkSlateBlue        : 0x49f1,
      DarkSlateGray        : 0x2a69,
      DarkTurquoise        : 0x067a,
      DarkViolet           : 0x901a,
      DeepPink             : 0xf8b2,
      DeepSkyBlue          : 0x05ff,
      DimGray              : 0x6b4d,
      DodgerBlue           : 0x1c9f,
      FireBrick            : 0xb104,
      FloralWhite          : 0xffde,
      ForestGreen          : 0x2444,
      Fuchsia              : 0xf81f,
      Gainsboro            : 0xdefb,
      GhostWhite           : 0xffdf,
      Gold                 : 0xfea0,
      GoldenRod            : 0xdd24,
      Gray                 : 0x8410,
      Green                : 0x0400,
      GreenYellow          : 0xafe5,
      HoneyDew             : 0xf7fe,
      HotPink              : 0xfb56,
      IndianRed            : 0xcaeb,
      Indigo               : 0x4810,
      Ivory                : 0xfffe,
      Khaki                : 0xf731,
      Lavender             : 0xe73f,
      LavenderBlush        : 0xff9e,
      LawnGreen            : 0x7fe0,
      LemonChiffon         : 0xffd9,
      LightBlue            : 0xaedc,
      LightCoral           : 0xf410,
      LightCyan            : 0xe7ff,
      LightGoldenRodYellow : 0xffda,
      LightGray            : 0xd69a,
      LightGreen           : 0x9772,
      LightPink            : 0xfdb8,
      LightSalmon          : 0xfd0f,
      LightSeaGreen        : 0x2595,
      LightSkyBlue         : 0x867f,
      LightSlateGray       : 0x7453,
      LightSteelBlue       : 0xb63b,
      LightYellow          : 0xfffc,
      Lime                 : 0x07e0,
      LimeGreen            : 0x3666,
      Linen                : 0xff9c,
      Magenta              : 0xf81f,
      Maroon               : 0x8000,
      MediumAquaMarine     : 0x6675,
      MediumBlue           : 0x0019,
      MediumOrchid         : 0xbaba,
      MediumPurple         : 0x939b,
      MediumSeaGreen       : 0x3d8e,
      MediumSlateBlue      : 0x7b5d,
      MediumSpringGreen    : 0x07d3,
      MediumTurquoise      : 0x4e99,
      MediumVioletRed      : 0xc0b0,
      MidnightBlue         : 0x18ce,
      MintCream            : 0xf7ff,
      MistyRose            : 0xff3c,
      Moccasin             : 0xff36,
      NavajoWhite          : 0xfef5,
      Navy                 : 0x0010,
      OldLace              : 0xffbc,
      Olive                : 0x8400,
      OliveDrab            : 0x6c64,
      Orange               : 0xfd20,
      OrangeRed            : 0xfa20,
      Orchid               : 0xdb9a,
      PaleGoldenRod        : 0xef55,
      PaleGreen            : 0x9fd3,
      PaleTurquoise        : 0xaf7d,
      PaleVioletRed        : 0xdb92,
      PapayaWhip           : 0xff7a,
      PeachPuff            : 0xfed7,
      Peru                 : 0xcc27,
      Pink                 : 0xfe19,
      Plum                 : 0xdd1b,
      PowderBlue           : 0xb71c,
      Purple               : 0x8010,
      RebeccaPurple        : 0x6193,
      Red                  : 0xf800,
      RosyBrown            : 0xbc71,
      RoyalBlue            : 0x435c,
      SaddleBrown          : 0x8a22,
      Salmon               : 0xfc0e,
      SandyBrown           : 0xf52c,
      SeaGreen             : 0x2c4a,
      SeaShell             : 0xffbd,
      Sienna               : 0xa285,
      Silver               : 0xc618,
      SkyBlue              : 0x867d,
      SlateBlue            : 0x6ad9,
      SlateGray            : 0x7412,
      Snow                 : 0xffdf,
      SpringGreen          : 0x07ef,
      SteelBlue            : 0x4416,
      Tan                  : 0xd5b1,
      Teal                 : 0x0410,
      Thistle              : 0xddfb,
      Tomato               : 0xfb08,
      Turquoise            : 0x471a,
      Violet               : 0xec1d,
      Wheat                : 0xf6f6,
      White                : 0xffff,
      WhiteSmoke           : 0xf7be,
      Yellow               : 0xffe0,
      YellowGreen          : 0x9e66,
    };
  }


}

if (typeof module === 'object') {
  module.exports = SainSmartTFT18LCD;
}

//----------------------------------------------------------

// commands
const INITR_GREENTAB = 0x0;
const INITR_REDTAB   = 0x1;
const INITR_BLACKTAB = 0x2;

const ST7735_TFTWIDTH  = 128;
const ST7735_TFTHEIGHT = 160;

const ST7735_NOP     = 0x00;
const ST7735_SWRESET = 0x01;
const ST7735_RDDID   = 0x04;
const ST7735_RDDST   = 0x09;
const ST7735_RDDPM   = 0x0A;

const ST7735_SLPIN   = 0x10;
const ST7735_SLPOUT  = 0x11;
const ST7735_PTLON   = 0x12;
const ST7735_NORON   = 0x13;

const ST7735_INVOFF  = 0x20;
const ST7735_INVON   = 0x21;
const ST7735_DISPOFF = 0x28;
const ST7735_DISPON  = 0x29;
const ST7735_CASET   = 0x2A;
const ST7735_RASET   = 0x2B;
const ST7735_RAMWR   = 0x2C;
const ST7735_RAMRD   = 0x2E;

const ST7735_PTLAR   = 0x30;
const ST7735_COLMOD  = 0x3A;
const ST7735_MADCTL  = 0x36;

const ST7735_FRMCTR1 = 0xB1;
const ST7735_FRMCTR2 = 0xB2;
const ST7735_FRMCTR3 = 0xB3;
const ST7735_INVCTR  = 0xB4;
const ST7735_DISSET5 = 0xB6;

const ST7735_PWCTR1  = 0xC0;
const ST7735_PWCTR2  = 0xC1;
const ST7735_PWCTR3  = 0xC2;
const ST7735_PWCTR4  = 0xC3;
const ST7735_PWCTR5  = 0xC4;
const ST7735_VMCTR1  = 0xC5;

const ST7735_RDID1   = 0xDA;
const ST7735_RDID2   = 0xDB;
const ST7735_RDID3   = 0xDC;
const ST7735_RDID4   = 0xDD;

const ST7735_PWCTR6  = 0xFC;

const ST7735_GMCTRP1 = 0xE0;
const ST7735_GMCTRN1 = 0xE1;

// Color definitions
const ST7735_BLACK   = 0x0000;
const ST7735_BLUE    = 0x001F;
const ST7735_RED     = 0xF800;
const ST7735_GREEN   = 0x07E0;
const ST7735_CYAN    = 0x07FF;
const ST7735_MAGENTA = 0xF81F;
const ST7735_YELLOW  = 0xFFE0;
const ST7735_WHITE   = 0xFFFF;

const ST7735_18bit   = 0x06; // 18bit/pixel
const ST7735_16bit   = 0x05; // 16bit/pixel

// standard ascii 5x7 font
const font = [
  0x00, 0x00, 0x00, 0x00, 0x00,
  0x3E, 0x5B, 0x4F, 0x5B, 0x3E, 	
  0x3E, 0x6B, 0x4F, 0x6B, 0x3E, 	
  0x1C, 0x3E, 0x7C, 0x3E, 0x1C,
  0x18, 0x3C, 0x7E, 0x3C, 0x18,
  0x1C, 0x57, 0x7D, 0x57, 0x1C,
  0x1C, 0x5E, 0x7F, 0x5E, 0x1C,
  0x00, 0x18, 0x3C, 0x18, 0x00,
  0xFF, 0xE7, 0xC3, 0xE7, 0xFF,
  0x00, 0x18, 0x24, 0x18, 0x00,
  0xFF, 0xE7, 0xDB, 0xE7, 0xFF,
  0x30, 0x48, 0x3A, 0x06, 0x0E,
  0x26, 0x29, 0x79, 0x29, 0x26,
  0x40, 0x7F, 0x05, 0x05, 0x07,
  0x40, 0x7F, 0x05, 0x25, 0x3F,
  0x5A, 0x3C, 0xE7, 0x3C, 0x5A,
  0x7F, 0x3E, 0x1C, 0x1C, 0x08,
  0x08, 0x1C, 0x1C, 0x3E, 0x7F,
  0x14, 0x22, 0x7F, 0x22, 0x14,
  0x5F, 0x5F, 0x00, 0x5F, 0x5F,
  0x06, 0x09, 0x7F, 0x01, 0x7F,
  0x00, 0x66, 0x89, 0x95, 0x6A,
  0x60, 0x60, 0x60, 0x60, 0x60,
  0x94, 0xA2, 0xFF, 0xA2, 0x94,
  0x08, 0x04, 0x7E, 0x04, 0x08,
  0x10, 0x20, 0x7E, 0x20, 0x10,
  0x08, 0x08, 0x2A, 0x1C, 0x08,
  0x08, 0x1C, 0x2A, 0x08, 0x08,
  0x1E, 0x10, 0x10, 0x10, 0x10,
  0x0C, 0x1E, 0x0C, 0x1E, 0x0C,
  0x30, 0x38, 0x3E, 0x38, 0x30,
  0x06, 0x0E, 0x3E, 0x0E, 0x06,
  0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x5F, 0x00, 0x00,
  0x00, 0x07, 0x00, 0x07, 0x00,
  0x14, 0x7F, 0x14, 0x7F, 0x14,
  0x24, 0x2A, 0x7F, 0x2A, 0x12,
  0x23, 0x13, 0x08, 0x64, 0x62,
  0x36, 0x49, 0x56, 0x20, 0x50,
  0x00, 0x08, 0x07, 0x03, 0x00,
  0x00, 0x1C, 0x22, 0x41, 0x00,
  0x00, 0x41, 0x22, 0x1C, 0x00,
  0x2A, 0x1C, 0x7F, 0x1C, 0x2A,
  0x08, 0x08, 0x3E, 0x08, 0x08,
  0x00, 0x80, 0x70, 0x30, 0x00,
  0x08, 0x08, 0x08, 0x08, 0x08,
  0x00, 0x00, 0x60, 0x60, 0x00,
  0x20, 0x10, 0x08, 0x04, 0x02,
  0x3E, 0x51, 0x49, 0x45, 0x3E,
  0x00, 0x42, 0x7F, 0x40, 0x00,
  0x72, 0x49, 0x49, 0x49, 0x46,
  0x21, 0x41, 0x49, 0x4D, 0x33,
  0x18, 0x14, 0x12, 0x7F, 0x10,
  0x27, 0x45, 0x45, 0x45, 0x39,
  0x3C, 0x4A, 0x49, 0x49, 0x31,
  0x41, 0x21, 0x11, 0x09, 0x07,
  0x36, 0x49, 0x49, 0x49, 0x36,
  0x46, 0x49, 0x49, 0x29, 0x1E,
  0x00, 0x00, 0x14, 0x00, 0x00,
  0x00, 0x40, 0x34, 0x00, 0x00,
  0x00, 0x08, 0x14, 0x22, 0x41,
  0x14, 0x14, 0x14, 0x14, 0x14,
  0x00, 0x41, 0x22, 0x14, 0x08,
  0x02, 0x01, 0x59, 0x09, 0x06,
  0x3E, 0x41, 0x5D, 0x59, 0x4E,
  0x7C, 0x12, 0x11, 0x12, 0x7C,
  0x7F, 0x49, 0x49, 0x49, 0x36,
  0x3E, 0x41, 0x41, 0x41, 0x22,
  0x7F, 0x41, 0x41, 0x41, 0x3E,
  0x7F, 0x49, 0x49, 0x49, 0x41,
  0x7F, 0x09, 0x09, 0x09, 0x01,
  0x3E, 0x41, 0x41, 0x51, 0x73,
  0x7F, 0x08, 0x08, 0x08, 0x7F,
  0x00, 0x41, 0x7F, 0x41, 0x00,
  0x20, 0x40, 0x41, 0x3F, 0x01,
  0x7F, 0x08, 0x14, 0x22, 0x41,
  0x7F, 0x40, 0x40, 0x40, 0x40,
  0x7F, 0x02, 0x1C, 0x02, 0x7F,
  0x7F, 0x04, 0x08, 0x10, 0x7F,
  0x3E, 0x41, 0x41, 0x41, 0x3E,
  0x7F, 0x09, 0x09, 0x09, 0x06,
  0x3E, 0x41, 0x51, 0x21, 0x5E,
  0x7F, 0x09, 0x19, 0x29, 0x46,
  0x26, 0x49, 0x49, 0x49, 0x32,
  0x03, 0x01, 0x7F, 0x01, 0x03,
  0x3F, 0x40, 0x40, 0x40, 0x3F,
  0x1F, 0x20, 0x40, 0x20, 0x1F,
  0x3F, 0x40, 0x38, 0x40, 0x3F,
  0x63, 0x14, 0x08, 0x14, 0x63,
  0x03, 0x04, 0x78, 0x04, 0x03,
  0x61, 0x59, 0x49, 0x4D, 0x43,
  0x00, 0x7F, 0x41, 0x41, 0x41,
  0x02, 0x04, 0x08, 0x10, 0x20,
  0x00, 0x41, 0x41, 0x41, 0x7F,
  0x04, 0x02, 0x01, 0x02, 0x04,
  0x40, 0x40, 0x40, 0x40, 0x40,
  0x00, 0x03, 0x07, 0x08, 0x00,
  0x20, 0x54, 0x54, 0x78, 0x40,
  0x7F, 0x28, 0x44, 0x44, 0x38,
  0x38, 0x44, 0x44, 0x44, 0x28,
  0x38, 0x44, 0x44, 0x28, 0x7F,
  0x38, 0x54, 0x54, 0x54, 0x18,
  0x00, 0x08, 0x7E, 0x09, 0x02,
  0x18, 0xA4, 0xA4, 0x9C, 0x78,
  0x7F, 0x08, 0x04, 0x04, 0x78,
  0x00, 0x44, 0x7D, 0x40, 0x00,
  0x20, 0x40, 0x40, 0x3D, 0x00,
  0x7F, 0x10, 0x28, 0x44, 0x00,
  0x00, 0x41, 0x7F, 0x40, 0x00,
  0x7C, 0x04, 0x78, 0x04, 0x78,
  0x7C, 0x08, 0x04, 0x04, 0x78,
  0x38, 0x44, 0x44, 0x44, 0x38,
  0xFC, 0x18, 0x24, 0x24, 0x18,
  0x18, 0x24, 0x24, 0x18, 0xFC,
  0x7C, 0x08, 0x04, 0x04, 0x08,
  0x48, 0x54, 0x54, 0x54, 0x24,
  0x04, 0x04, 0x3F, 0x44, 0x24,
  0x3C, 0x40, 0x40, 0x20, 0x7C,
  0x1C, 0x20, 0x40, 0x20, 0x1C,
  0x3C, 0x40, 0x30, 0x40, 0x3C,
  0x44, 0x28, 0x10, 0x28, 0x44,
  0x4C, 0x90, 0x90, 0x90, 0x7C,
  0x44, 0x64, 0x54, 0x4C, 0x44,
  0x00, 0x08, 0x36, 0x41, 0x00,
  0x00, 0x00, 0x77, 0x00, 0x00,
  0x00, 0x41, 0x36, 0x08, 0x00,
  0x02, 0x01, 0x02, 0x04, 0x02,
  0x3C, 0x26, 0x23, 0x26, 0x3C,
  0x1E, 0xA1, 0xA1, 0x61, 0x12,
  0x3A, 0x40, 0x40, 0x20, 0x7A,
  0x38, 0x54, 0x54, 0x55, 0x59,
  0x21, 0x55, 0x55, 0x79, 0x41,
  0x21, 0x54, 0x54, 0x78, 0x41,
  0x21, 0x55, 0x54, 0x78, 0x40,
  0x20, 0x54, 0x55, 0x79, 0x40,
  0x0C, 0x1E, 0x52, 0x72, 0x12,
  0x39, 0x55, 0x55, 0x55, 0x59,
  0x39, 0x54, 0x54, 0x54, 0x59,
  0x39, 0x55, 0x54, 0x54, 0x58,
  0x00, 0x00, 0x45, 0x7C, 0x41,
  0x00, 0x02, 0x45, 0x7D, 0x42,
  0x00, 0x01, 0x45, 0x7C, 0x40,
  0xF0, 0x29, 0x24, 0x29, 0xF0,
  0xF0, 0x28, 0x25, 0x28, 0xF0,
  0x7C, 0x54, 0x55, 0x45, 0x00,
  0x20, 0x54, 0x54, 0x7C, 0x54,
  0x7C, 0x0A, 0x09, 0x7F, 0x49,
  0x32, 0x49, 0x49, 0x49, 0x32,
  0x32, 0x48, 0x48, 0x48, 0x32,
  0x32, 0x4A, 0x48, 0x48, 0x30,
  0x3A, 0x41, 0x41, 0x21, 0x7A,
  0x3A, 0x42, 0x40, 0x20, 0x78,
  0x00, 0x9D, 0xA0, 0xA0, 0x7D,
  0x39, 0x44, 0x44, 0x44, 0x39,
  0x3D, 0x40, 0x40, 0x40, 0x3D,
  0x3C, 0x24, 0xFF, 0x24, 0x24,
  0x48, 0x7E, 0x49, 0x43, 0x66,
  0x2B, 0x2F, 0xFC, 0x2F, 0x2B,
  0xFF, 0x09, 0x29, 0xF6, 0x20,
  0xC0, 0x88, 0x7E, 0x09, 0x03,
  0x20, 0x54, 0x54, 0x79, 0x41,
  0x00, 0x00, 0x44, 0x7D, 0x41,
  0x30, 0x48, 0x48, 0x4A, 0x32,
  0x38, 0x40, 0x40, 0x22, 0x7A,
  0x00, 0x7A, 0x0A, 0x0A, 0x72,
  0x7D, 0x0D, 0x19, 0x31, 0x7D,
  0x26, 0x29, 0x29, 0x2F, 0x28,
  0x26, 0x29, 0x29, 0x29, 0x26,
  0x30, 0x48, 0x4D, 0x40, 0x20,
  0x38, 0x08, 0x08, 0x08, 0x08,
  0x08, 0x08, 0x08, 0x08, 0x38,
  0x2F, 0x10, 0xC8, 0xAC, 0xBA,
  0x2F, 0x10, 0x28, 0x34, 0xFA,
  0x00, 0x00, 0x7B, 0x00, 0x00,
  0x08, 0x14, 0x2A, 0x14, 0x22,
  0x22, 0x14, 0x2A, 0x14, 0x08,
  0xAA, 0x00, 0x55, 0x00, 0xAA,
  0xAA, 0x55, 0xAA, 0x55, 0xAA,
  0x00, 0x00, 0x00, 0xFF, 0x00,
  0x10, 0x10, 0x10, 0xFF, 0x00,
  0x14, 0x14, 0x14, 0xFF, 0x00,
  0x10, 0x10, 0xFF, 0x00, 0xFF,
  0x10, 0x10, 0xF0, 0x10, 0xF0,
  0x14, 0x14, 0x14, 0xFC, 0x00,
  0x14, 0x14, 0xF7, 0x00, 0xFF,
  0x00, 0x00, 0xFF, 0x00, 0xFF,
  0x14, 0x14, 0xF4, 0x04, 0xFC,
  0x14, 0x14, 0x17, 0x10, 0x1F,
  0x10, 0x10, 0x1F, 0x10, 0x1F,
  0x14, 0x14, 0x14, 0x1F, 0x00,
  0x10, 0x10, 0x10, 0xF0, 0x00,
  0x00, 0x00, 0x00, 0x1F, 0x10,
  0x10, 0x10, 0x10, 0x1F, 0x10,
  0x10, 0x10, 0x10, 0xF0, 0x10,
  0x00, 0x00, 0x00, 0xFF, 0x10,
  0x10, 0x10, 0x10, 0x10, 0x10,
  0x10, 0x10, 0x10, 0xFF, 0x10,
  0x00, 0x00, 0x00, 0xFF, 0x14,
  0x00, 0x00, 0xFF, 0x00, 0xFF,
  0x00, 0x00, 0x1F, 0x10, 0x17,
  0x00, 0x00, 0xFC, 0x04, 0xF4,
  0x14, 0x14, 0x17, 0x10, 0x17,
  0x14, 0x14, 0xF4, 0x04, 0xF4,
  0x00, 0x00, 0xFF, 0x00, 0xF7,
  0x14, 0x14, 0x14, 0x14, 0x14,
  0x14, 0x14, 0xF7, 0x00, 0xF7,
  0x14, 0x14, 0x14, 0x17, 0x14,
  0x10, 0x10, 0x1F, 0x10, 0x1F,
  0x14, 0x14, 0x14, 0xF4, 0x14,
  0x10, 0x10, 0xF0, 0x10, 0xF0,
  0x00, 0x00, 0x1F, 0x10, 0x1F,
  0x00, 0x00, 0x00, 0x1F, 0x14,
  0x00, 0x00, 0x00, 0xFC, 0x14,
  0x00, 0x00, 0xF0, 0x10, 0xF0,
  0x10, 0x10, 0xFF, 0x10, 0xFF,
  0x14, 0x14, 0x14, 0xFF, 0x14,
  0x10, 0x10, 0x10, 0x1F, 0x00,
  0x00, 0x00, 0x00, 0xF0, 0x10,
  0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
  0xF0, 0xF0, 0xF0, 0xF0, 0xF0,
  0xFF, 0xFF, 0xFF, 0x00, 0x00,
  0x00, 0x00, 0x00, 0xFF, 0xFF,
  0x0F, 0x0F, 0x0F, 0x0F, 0x0F,
  0x38, 0x44, 0x44, 0x38, 0x44,
  0x7C, 0x2A, 0x2A, 0x3E, 0x14,
  0x7E, 0x02, 0x02, 0x06, 0x06,
  0x02, 0x7E, 0x02, 0x7E, 0x02,
  0x63, 0x55, 0x49, 0x41, 0x63,
  0x38, 0x44, 0x44, 0x3C, 0x04,
  0x40, 0x7E, 0x20, 0x1E, 0x20,
  0x06, 0x02, 0x7E, 0x02, 0x02,
  0x99, 0xA5, 0xE7, 0xA5, 0x99,
  0x1C, 0x2A, 0x49, 0x2A, 0x1C,
  0x4C, 0x72, 0x01, 0x72, 0x4C,
  0x30, 0x4A, 0x4D, 0x4D, 0x30,
  0x30, 0x48, 0x78, 0x48, 0x30,
  0xBC, 0x62, 0x5A, 0x46, 0x3D,
  0x3E, 0x49, 0x49, 0x49, 0x00,
  0x7E, 0x01, 0x01, 0x01, 0x7E,
  0x2A, 0x2A, 0x2A, 0x2A, 0x2A,
  0x44, 0x44, 0x5F, 0x44, 0x44,
  0x40, 0x51, 0x4A, 0x44, 0x40,
  0x40, 0x44, 0x4A, 0x51, 0x40,
  0x00, 0x00, 0xFF, 0x01, 0x03,
  0xE0, 0x80, 0xFF, 0x00, 0x00,
  0x08, 0x08, 0x6B, 0x6B, 0x08,
  0x36, 0x12, 0x36, 0x24, 0x36,
  0x06, 0x0F, 0x09, 0x0F, 0x06,
  0x00, 0x00, 0x18, 0x18, 0x00,
  0x00, 0x00, 0x10, 0x10, 0x00,
  0x30, 0x40, 0xFF, 0x01, 0x01,
  0x00, 0x1F, 0x01, 0x01, 0x1E,
  0x00, 0x19, 0x1D, 0x17, 0x12,
  0x00, 0x3C, 0x3C, 0x3C, 0x3C,
  0x00, 0x00, 0x00, 0x00, 0x00,
];
