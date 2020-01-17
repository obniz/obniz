// SainSmart ST7735 1.8" TFT LCD 128x160 pixel
import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface ST7735SOptions { }
class ST7735S implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "ST7735S",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public debugprint: any;
  public obniz!: Obniz;
  public io_dc: any;
  public params: any;
  public io_res: any;
  public io_cs: any;
  public spi: any;
  public width: any;
  public height: any;
  public rotation: any;
  public x_offset: any;
  public y_offset: any;
  public writeBuffer: any;
  public color: any;

  constructor() {
    this.keys = ["sclk", "mosi", "cs", "res", "dc"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.debugprint = false;
    this.obniz = obniz;

    this.io_dc = obniz.getIO(this.params.dc);
    this.io_res = obniz.getIO(this.params.res);
    this.io_cs = obniz.getIO(this.params.cs);

    this.params.frequency = 16 * 1000 * 1000; // 16MHz
    this.params.mode = "master";
    this.params.clk = this.params.sclk;
    this.params.mosi = this.params.mosi;
    this.params.drive = "3v";
    this.spi = this.obniz.getSpiWithConfig(this.params);

    this.io_dc.output(true);
    this.io_cs.output(false);

    this.width = ST7735S_TFTWIDTH;
    this.height = ST7735S_TFTHEIGHT;
    this.rotation = 0;
    this.x_offset = 26;
    this.y_offset = 2;

    this.writeBuffer = []; // 1024bytes bufferring

    this._setPresetColor();
    this.init();
  }

  public print_debug(v: any) {
    if (this.debugprint) {
      console.log(
        "SainSmartTFT18LCD: " + Array.prototype.slice.call(arguments).join(""),
      );
    }
  }

  public _deadSleep(waitMsec: any) {
    const startMsec: any = new Date();
    while ((new Date() as any) - startMsec < waitMsec) {
    }
  }

  public _reset() {
    this.io_res.output(false);
    this._deadSleep(10);
    this.io_res.output(true);
    this._deadSleep(10);
  }

  public writeCommand(cmd: any) {
    this.io_dc.output(false);
    this.io_cs.output(false);
    this.spi.write([cmd]);
    this.io_cs.output(true);
  }

  public writeData(data: any) {
    this.io_dc.output(true);
    this.io_cs.output(false);
    this.spi.write(data);
    this.io_cs.output(true);
  }

  public write(cmd: any, data: any) {
    if (data.length === 0) {
      return;
    }
    this.writeCommand(cmd);
    this.writeData(data);
  }

  public async asyncwait() {
    return await this.spi.writeWait([0x00]);
  }

  public _writeFlush() {
    while (this.writeBuffer.length > 0) {
      if (this.writeBuffer.length > 1024) {
        const data: any = this.writeBuffer.slice(0, 1024);
        this.writeData(data);
        this.writeBuffer.splice(0, 1024);
      } else {
        if (this.writeBuffer.length > 0) {
          this.writeData(this.writeBuffer);
        }
        this.writeBuffer = [];
      }
    }
  }

  public _writeBuffer(data?: any) {
    if (data && data.length > 0) {
      this.writeBuffer = this.writeBuffer.concat(data);
    } else {
      this._writeFlush();
    }
  }

  public color16(r: any, g: any, b: any) {
    //  1st byte  (r & 0xF8 | g >> 5)
    //  2nd byte  (g & 0xFC << 3 | b >> 3)
    return ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3);
  }

  public complementaryColor16(color: any) {
    const r: any = (color & 0xf800) >> 8;
    const g: any = (color & 0x7e0) >> 3;
    const b: any = (color & 0x1f) << 3;
    const x: any = Math.max(r, g, b) + Math.min(r, g, b);
    return this.color16(x - r, x - g, x - b);
  }

  public reverseColor16(color: any) {
    const r: any = (color & 0xf800) >> 8;
    const g: any = (color & 0x7e0) >> 3;
    const b: any = (color & 0x1f) << 3;
    const x: any = 0xff;
    return this.color16(x - r, x - g, x - b);
  }

  public _initG() {
    // initialize display
    this.writeCommand(ST7735_SWRESET);
    this.obniz.wait(150);
    this.writeCommand(ST7735_SLPOUT); // Sleep out & booster on
    this.obniz.wait(500);
    this.write(ST7735_FRMCTR1, [0x01, 0x2c, 0x2d]);
    this.write(ST7735_FRMCTR2, [0x01, 0x2c, 0x2d]);
    this.write(ST7735_FRMCTR3, [0x01, 0x2c, 0x2d, 0x01, 0x2c, 0x2d]);
    this.write(ST7735_INVCTR, [0x07]);
    this.write(ST7735_PWCTR1, [0xa2, 0x02, 0x84]);
    this.write(ST7735_PWCTR2, [0xc5]);
    this.write(ST7735_PWCTR3, [0x0a, 0x00]);
    this.write(ST7735_PWCTR4, [0x8a, 0x2a]);
    this.write(ST7735_PWCTR5, [0x8a, 0xee]);
    this.write(ST7735_VMCTR1, [0x0e]);
    this.writeCommand(ST7735_INVOFF);
    this.write(ST7735_MADCTL, [0xc8]);
    this.write(ST7735_COLMOD, [0x05]);
    this.write(ST7735_CASET, [0x00, 0x00, 0x00, 0x7f]);
    this.write(ST7735_RASET, [0x00, 0x00, 0x00, 0x9f]);
    this.writeCommand(ST7735_INVON);
    this.write(ST7735_GMCTRP1, [
      0x02,
      0x1c,
      0x07,
      0x12,
      0x37,
      0x32,
      0x29,
      0x2d,
      0x29,
      0x25,
      0x2b,
      0x39,
      0x00,
      0x01,
      0x03,
      0x10,
    ]);
    this.write(ST7735_GMCTRN1, [
      0x03,
      0x1d,
      0x07,
      0x06,
      0x2e,
      0x2c,
      0x29,
      0x2d,
      0x2e,
      0x2e,
      0x37,
      0x3f,
      0x00,
      0x00,
      0x02,
      0x10,
    ]);
  }

  public init() {
    this._reset();
    this._initG();
    this.setDisplayOn();
    this.setRotation(0);
  }

  public setDisplayOn() {
    this.writeCommand(ST7735_DISPON);
  }

  public setDisplayOff() {
    this.writeCommand(ST7735_DISPOFF);
  }

  public setDisplay(on: any) {
    if (on === true) {
      this.setDisplayOn();
    } else {
      this.setDisplayOff();
    }
  }

  public setInversionOn() {
    this.writeCommand(ST7735_INVON);
  }

  public setInversionOff() {
    this.writeCommand(ST7735_INVOFF);
  }

  public setInversion(inversion: any) {
    if (inversion === true) {
      this.setInversionOn();
    } else {
      this.setInversionOff();
    }
  }

  public setRotation(m: any) {
    const MADCTL_MY: any = 0x80;
    const MADCTL_MX: any = 0x40;
    const MADCTL_MV: any = 0x20;
    // const MADCTL_ML = 0x10;
    const MADCTL_RGB: any = 0x00; // always RGB, never BGR
    // const MADCTL_MH = 0x04;

    let data: any;
    this.rotation = m % 4; // can't be higher than 3
    switch (this.rotation) {
      case 0:
        data = [MADCTL_MX | MADCTL_MY | MADCTL_RGB];
        this.width = ST7735S_TFTWIDTH;
        this.height = ST7735S_TFTHEIGHT;
        break;
      case 1:
        data = [MADCTL_MY | MADCTL_MV | MADCTL_RGB];
        this.width = ST7735S_TFTHEIGHT;
        this.height = ST7735S_TFTWIDTH;
        break;
      case 2:
        data = [MADCTL_RGB];
        this.width = ST7735S_TFTWIDTH;
        this.height = ST7735S_TFTHEIGHT;
        break;
      case 3:
        data = [MADCTL_MX | MADCTL_MV | MADCTL_RGB];
        this.width = ST7735S_TFTHEIGHT;
        this.height = ST7735S_TFTWIDTH;
        break;
    }
    this.write(ST7735_MADCTL, data);
    this.setAddrWindow(0, 0, this.width - 1, this.height - 1);
  }

  public setAddrWindow(x0: any, y0: any, x1: any, y1: any) {
    this.print_debug(
      `setAddrWindow: (x0: ${x0}, y0: ${y0}) - (x1: ${x1}, y1: ${y1})`,
    );

    if (x0 < 0) {
      x0 = 0;
    }
    if (y0 < 0) {
      y0 = 0;
    }
    if (x1 < 0) {
      x1 = 0;
    }
    if (y1 < 0) {
      y1 = 0;
    }

    if (this.rotation === 0 || this.rotation === 2) {
      x0 = x0 + this.x_offset;
      x1 = x1 + this.x_offset;
      y0 = y0 + this.y_offset;
      y1 = y1 + this.y_offset;
    } else {
      x0 = x0 + this.y_offset;
      x1 = x1 + this.y_offset;
      y0 = y0 + this.x_offset;
      y1 = y1 + this.x_offset;
    }

    // column addr set
    this.write(ST7735_CASET, [0x00, x0, 0x00, x1]); // XSTART-XEND
    // row addr set
    this.write(ST7735_RASET, [0x00, y0, 0x00, y1]); // YSTART-YEND
    // write to RAM
    this.writeCommand(ST7735_RAMWR);
    this.writeBuffer = [];
  }

  // __swap(a, b) { let t = a; a = b; b = t; }

  public fillScreen(color: any) {
    this.fillRect(0, 0, this.width, this.height, color);
  }

  public _color2pixels(w: any, h: any, color: any) {
    return Array.from(new Array(Math.abs(w * h))).map((v, i) => color);
  }

  public fillRect(x: any, y: any, w: any, h: any, color: any) {
    if (x >= this.width || y >= this.height) {
      return;
    }
    if (x + w - 1 >= this.width) {
      w = this.width - x;
    }
    if (y + h - 1 >= this.height) {
      h = this.height - y;
    }
    const pixels: any = this._color2pixels(w, h, color);
    this.rawBound16(x, y, w, h, pixels, true);
  }

  public drawRect(x: any, y: any, w: any, h: any, color: any) {
    this.drawHLine(x, y, w, color);
    this.drawHLine(x, y + h - 1, w, color);
    this.drawVLine(x, y, h, color);
    this.drawVLine(x + w - 1, y, h, color);
  }

  public drawCircle(x0: any, y0: any, r: any, color: any) {
    let f: any = 1 - r;
    let ddF_x: any = 1;
    let ddF_y: any = -2 * r;
    let x: any = 0;
    let y: any = r;

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

  public _drawCircleHelper(x0: any, y0: any, r: any, cornername: any, color: any) {
    let f: any = 1 - r;
    let ddF_x: any = 1;
    let ddF_y: any = -2 * r;
    let x: any = 0;
    let y: any = r;

    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x;
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

  public fillCircle(x0: any, y0: any, r: any, color: any) {
    this.drawVLine(x0, y0 - r, 2 * r + 1, color);
    this._fillCircleHelper(x0, y0, r, 3, 0, color);
  }

  public _fillCircleHelper(x0: any, y0: any, r: any, cornername: any, delta: any, color: any) {
    let f: any = 1 - r;
    let ddF_x: any = 1;
    let ddF_y: any = -2 * r;
    let x: any = 0;
    let y: any = r;

    while (x < y) {
      if (f >= 0) {
        y--;
        ddF_y += 2;
        f += ddF_y;
      }
      x++;
      ddF_x += 2;
      f += ddF_x;

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

  public drawRoundRect(x: any, y: any, w: any, h: any, r: any, color: any) {
    this.drawHLine(x + r, y, w - 2 * r, color); // Top
    this.drawHLine(x + r, y + h - 1, w - 2 * r, color); // Bottom
    this.drawVLine(x, y + r, h - 2 * r, color); // Left
    this.drawVLine(x + w - 1, y + r, h - 2 * r, color); // Right

    this._drawCircleHelper(x + r, y + r, r, 1, color);
    this._drawCircleHelper(x + w - r - 1, y + r, r, 2, color);
    this._drawCircleHelper(x + w - r - 1, y + h - r - 1, r, 4, color);
    this._drawCircleHelper(x + r, y + h - r - 1, r, 8, color);
  }

  public fillRoundRect(x: any, y: any, w: any, h: any, r: any, color: any) {
    this.fillRect(x + r, y, w - 2 * r, h, color);

    this._fillCircleHelper(x + w - r - 1, y + r, r, 1, h - 2 * r - 1, color);
    this._fillCircleHelper(x + r, y + r, r, 2, h - 2 * r - 1, color);
  }

  public drawTriangle(x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, color: any) {
    this.drawLine(x0, y0, x1, y1, color);
    this.drawLine(x1, y1, x2, y2, color);
    this.drawLine(x2, y2, x0, y0, color);
  }

  public fillTriangle(x0: any, y0: any, x1: any, y1: any, x2: any, y2: any, color: any) {
    let a: any;
    let b: any;
    let y: any;
    let last: any;

    // Sort coordinates by Y order (y2 >= y1 >= y0)
    if (y0 > y1) {
      y1 = [y0, (y0 = y1)][0]; // this._swap(y0, y1);
      x1 = [x0, (x0 = x1)][0]; // this._swap(x0, x1);
    }
    if (y1 > y2) {
      y2 = [y1, (y1 = y2)][0]; // this._swap(y2, y1);
      x2 = [x1, (x1 = x2)][0]; // this._swap(x2, x1);
    }
    if (y0 > y1) {
      y1 = [y0, (y0 = y1)][0]; // this._swap(y0, y1);
      x1 = [x0, (x0 = x1)][0]; // this._swap(x0, x1);
    }

    if (y0 === y2) {
      // Handle awkward all-on-same-line case as its own thing
      a = b = x0;
      if (x1 < a) {
        a = x1;
      } else if (x1 > b) {
        b = x1;
      }
      if (x2 < a) {
        a = x2;
      } else if (x2 > b) {
        b = x2;
      }
      this.drawHLine(a, y0, b - a + 1, color);
      return;
    }

    const dx01: any = x1 - x0;
    const dy01: any = y1 - y0;
    const dx02: any = x2 - x0;
    const dy02: any = y2 - y0;
    const dx12: any = x2 - x1;
    const dy12: any = y2 - y1;
    let sa: any = 0;
    let sb: any = 0;

    if (y1 === y2) {
      last = y1;
    } else {
      last = y1 - 1;
    } // skip it

    for (y = y0; y <= last; y++) {
      a = x0 + Math.floor(sa / dy01);
      b = x0 + Math.floor(sb / dy02);
      sa += dx01;
      sb += dx02;
      if (a > b) {
        b = [a, (a = b)][0];
      } // this._swap(a,b);
      this.drawHLine(a, y, b - a + 1, color);
    }

    sa = dx12 * (y - y1);
    sb = dx02 * (y - y0);
    for (; y <= y2; y++) {
      a = x1 + Math.floor(sa / dy12);
      b = x0 + Math.floor(sb / dy02);
      sa += dx12;
      sb += dx02;
      if (a > b) {
        b = [a, (a = b)][0];
      } // this._swap(a,b);
      this.drawHLine(a, y, b - a + 1, color);
    }
  }

  public drawVLine(x: any, y: any, h: any, color: any) {
    if (h < 0) {
      h = -h;
      y = y - h;
    }
    if (x >= this.width || y >= this.height) {
      return;
    }
    if (y + h - 1 >= this.height) {
      h = this.height - y;
    }
    const pixels: any = this._color2pixels(1, h, color);
    this.rawBound16(x, y, 1, h, pixels, false);
  }

  public drawHLine(x: any, y: any, w: any, color: any) {
    if (w < 0) {
      w = -w;
      x = x - w;
    }
    if (x >= this.width || y >= this.height) {
      return;
    }
    if (x + w - 1 >= this.width) {
      w = this.width - x;
    }
    const pixels: any = this._color2pixels(w, 1, color);
    this.rawBound16(x, y, w, 1, pixels, false);
  }

  public drawLine(x0: any, y0: any, x1: any, y1: any, color: any) {
    if (x0 === x1) {
      this.drawVLine(x0, y0, y1 - y0, color);
      return;
    }
    if (y0 === y1) {
      this.drawHLine(x0, y0, x1 - x0, color);
      return;
    }

    const step: any = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (step) {
      y0 = [x0, (x0 = y0)][0]; // this._swap(x0, y0);
      y1 = [x1, (x1 = y1)][0]; // this._swap(x1, y1);
    }
    if (x0 > x1) {
      x1 = [x0, (x0 = x1)][0]; // this._swap(x0, x1);
      y1 = [y0, (y0 = y1)][0]; // this._swap(y0, y1);
    }

    const dx: any = x1 - x0;
    const dy: any = Math.abs(y1 - y0);

    let err: any = dx / 2;
    const ystep: any = y0 < y1 ? 1 : -1;

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

  public drawPixel(x: any, y: any, color: any) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }
    this.rawBound16(x, y, 1, 1, [color], false);
  }

  public drawChar(x: any, y: any, ch: any, color: any, bg: any, size: any) {
    //  bg = bg || color;
    size = size || 1;
    if (
      x >= this.width || // Clip right
      y >= this.height || // Clip bottom
      x + 6 * size - 1 < 0 || // Clip left
      y + 8 * size - 1 < 0
    ) {
      // Clip top
      return;
    }

    if (color !== bg) {
      this.drawChar2(x, y, ch, color, bg, size);
      return;
    }

    const c: any = ch.charCodeAt(0);
    for (let i = 0; i < 6; i++) {
      let line: any = i === 5 ? 0 : font[c * 5 + i];
      for (let j = 0; j < 8; j++) {
        if (line & 0x1) {
          if (size === 1) {
            // default size
            this.drawPixel(x + i, y + j, color);
          } else {
            // big size
            this.fillRect(x + i * size, y + j * size, size, size, color);
          }
        } else if (bg !== color) {
          if (size === 1) {
            // default size
            this.drawPixel(x + i, y + j, bg);
          } else {
            // big size
            this.fillRect(x + i * size, y + j * size, size, size, bg);
          }
        }
        line >>= 1;
      }
    }
  }

  public drawChar2(x: any, y: any, ch: any, color: any, bg: any, size: any) {
    //  bg = bg || color;
    size = size || 1;
    if (
      x >= this.width || // Clip right
      y >= this.height || // Clip bottom
      x + 6 * size - 1 < 0 || // Clip left
      y + 8 * size - 1 < 0 // Clip top
    ) {
      return;
    }

    const pixels: any = new Array(6 * 8 * size * size);
    const c: any = ch.charCodeAt(0);
    for (let i = 0; i < 6; i++) {
      let line: any = i === 5 ? 0 : font[c * 5 + i];
      for (let j = 0; j < 8; j++) {
        const cl: any = line & 0x1 ? color : bg;
        for (let w = 0; w < size; w++) {
          for (let h = 0; h < size; h++) {
            pixels[
            i * (1 * size) + w + (j * (6 * size * size) + h * (6 * size))
              ] = cl;
          }
        }
        line >>= 1;
      }
    }
    this.rawBound16(x, y, 6 * size, 8 * size, pixels);
  }

  public rawBound16(x: any, y: any, width: any, height: any, pixels: any, flush?: any) {
    const rgb: any = [];
    pixels.forEach((v: any) => {
      const v2: any = ((v & 0xf800) >> 11) | (v & 0x7e0) | ((v & 0x1f) << 11);
      rgb.push((v2 & 0xff00) >> 8);
      rgb.push(v2 & 0xff);
    });
    this.setAddrWindow(x, y, x + width - 1, y + height - 1);
    if (flush) {
      this._writeBuffer(rgb);
      this._writeBuffer(); // for flush
    } else {
      this.writeData(rgb);
    }
  }

  public drawString(x: any, y: any, str: any, color: any, bg: any, size: any, wrap: any) {
    //  bg = bg || color;
    size = size || 1;
    //  wrap = wrap || true;
    for (let n = 0; n < str.length; n++) {
      const c: any = str.charAt(n);
      if (c === "\n") {
        y += size * 8;
        x = 0;
      } else if (c === "\r") {
        // skip em
      } else {
        this.drawChar(x, y, c, color, bg, size);
        x += size * 6;
        if (wrap && x > this.width - size * 6) {
          y += size * 8;
          x = 0;
        }
      }
    }
    return [x, y];
  }

  public drawContextBound(context: any, x0: any, y0: any, width: any, height: any, x1: any, y1: any, gray: any) {
    x0 = x0 || 0;
    y0 = y0 || 0;
    width = width || context.canvas.clientWidth;
    height = height || context.canvas.clientHeight;
    x1 = x1 || 0;
    y1 = y1 || 0;
    gray = gray || false;
    this.write(ST7735_COLMOD, [ST7735_18bit]); // 18bit/pixel
    const imageData: any = context.getImageData(x0, y0, width, height).data;
    const rgb: any = [];
    for (let n = 0; n < imageData.length; n += 4) {
      const r: any = imageData[n + 0];
      const g: any = imageData[n + 1];
      const b: any = imageData[n + 2];
      if (!gray) {
        rgb.push(b);
        rgb.push(g);
        rgb.push(r);
      } else {
        const gs: any = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        rgb.push(gs);
        rgb.push(gs);
        rgb.push(gs);
      }
    }
    this.write(ST7735_COLMOD, [ST7735_18bit]); // 18bit/pixel
    this.setAddrWindow(x1, y1, x1 + width - 1, y1 + height - 1);
    this._writeBuffer(rgb);
    this._writeBuffer(); // for flush
    this.write(ST7735_COLMOD, [ST7735_16bit]); // 16bit/pixel
  }

  public drawContext(context: any, gray: any) {
    gray = gray || false;
    this.drawContextBound(context, 0, 0, this.width, this.height, 0, 0, gray);
  }

  public draw(context: any, gray: any) {
    this.drawContext(context, gray);
  }

  public rawBound(x: any, y: any, width: any, height: any, pixels: any) {
    const rgb: any = [];
    pixels.forEach((v: any) => {
      rgb.push(v & 0xff);
      rgb.push((v & 0xff00) >> 8);
      rgb.push((v & 0xff0000) >> 16);
    });
    this.write(ST7735_COLMOD, [ST7735_18bit]); // 18bit/pixel
    this.setAddrWindow(x, y, x + width - 1, y + height - 1);
    this._writeBuffer(rgb);
    this._writeBuffer(); // for flush
    this.write(ST7735_COLMOD, [ST7735_16bit]); // 16bit/pixel
  }

  public raw(pixels: any) {
    this.rawBound16(0, 0, this.width, this.height, pixels, true);
  }

  public _setPresetColor() {
    this.color = {
      AliceBlue: 0xf7df,
      AntiqueWhite: 0xff5a,
      Aqua: 0x07ff,
      Aquamarine: 0x7ffa,
      Azure: 0xf7ff,
      Beige: 0xf7bb,
      Bisque: 0xff38,
      Black: 0x0000,
      BlanchedAlmond: 0xff59,
      Blue: 0x001f,
      BlueViolet: 0x895c,
      Brown: 0xa145,
      BurlyWood: 0xddd0,
      CadetBlue: 0x5cf4,
      Chartreuse: 0x7fe0,
      Chocolate: 0xd343,
      Coral: 0xfbea,
      CornflowerBlue: 0x64bd,
      Cornsilk: 0xffdb,
      Crimson: 0xd8a7,
      Cyan: 0x07ff,
      DarkBlue: 0x0011,
      DarkCyan: 0x0451,
      DarkGoldenRod: 0xbc21,
      DarkGray: 0xad55,
      DarkGreen: 0x0320,
      DarkKhaki: 0xbdad,
      DarkMagenta: 0x8811,
      DarkOliveGreen: 0x5345,
      DarkOrange: 0xfc60,
      DarkOrchid: 0x9999,
      DarkRed: 0x8800,
      DarkSalmon: 0xecaf,
      DarkSeaGreen: 0x8df1,
      DarkSlateBlue: 0x49f1,
      DarkSlateGray: 0x2a69,
      DarkTurquoise: 0x067a,
      DarkViolet: 0x901a,
      DeepPink: 0xf8b2,
      DeepSkyBlue: 0x05ff,
      DimGray: 0x6b4d,
      DodgerBlue: 0x1c9f,
      FireBrick: 0xb104,
      FloralWhite: 0xffde,
      ForestGreen: 0x2444,
      Fuchsia: 0xf81f,
      Gainsboro: 0xdefb,
      GhostWhite: 0xffdf,
      Gold: 0xfea0,
      GoldenRod: 0xdd24,
      Gray: 0x8410,
      Green: 0x0400,
      GreenYellow: 0xafe5,
      HoneyDew: 0xf7fe,
      HotPink: 0xfb56,
      IndianRed: 0xcaeb,
      Indigo: 0x4810,
      Ivory: 0xfffe,
      Khaki: 0xf731,
      Lavender: 0xe73f,
      LavenderBlush: 0xff9e,
      LawnGreen: 0x7fe0,
      LemonChiffon: 0xffd9,
      LightBlue: 0xaedc,
      LightCoral: 0xf410,
      LightCyan: 0xe7ff,
      LightGoldenRodYellow: 0xffda,
      LightGray: 0xd69a,
      LightGreen: 0x9772,
      LightPink: 0xfdb8,
      LightSalmon: 0xfd0f,
      LightSeaGreen: 0x2595,
      LightSkyBlue: 0x867f,
      LightSlateGray: 0x7453,
      LightSteelBlue: 0xb63b,
      LightYellow: 0xfffc,
      Lime: 0x07e0,
      LimeGreen: 0x3666,
      Linen: 0xff9c,
      Magenta: 0xf81f,
      Maroon: 0x8000,
      MediumAquaMarine: 0x6675,
      MediumBlue: 0x0019,
      MediumOrchid: 0xbaba,
      MediumPurple: 0x939b,
      MediumSeaGreen: 0x3d8e,
      MediumSlateBlue: 0x7b5d,
      MediumSpringGreen: 0x07d3,
      MediumTurquoise: 0x4e99,
      MediumVioletRed: 0xc0b0,
      MidnightBlue: 0x18ce,
      MintCream: 0xf7ff,
      MistyRose: 0xff3c,
      Moccasin: 0xff36,
      NavajoWhite: 0xfef5,
      Navy: 0x0010,
      OldLace: 0xffbc,
      Olive: 0x8400,
      OliveDrab: 0x6c64,
      Orange: 0xfd20,
      OrangeRed: 0xfa20,
      Orchid: 0xdb9a,
      PaleGoldenRod: 0xef55,
      PaleGreen: 0x9fd3,
      PaleTurquoise: 0xaf7d,
      PaleVioletRed: 0xdb92,
      PapayaWhip: 0xff7a,
      PeachPuff: 0xfed7,
      Peru: 0xcc27,
      Pink: 0xfe19,
      Plum: 0xdd1b,
      PowderBlue: 0xb71c,
      Purple: 0x8010,
      RebeccaPurple: 0x6193,
      Red: 0xf800,
      RosyBrown: 0xbc71,
      RoyalBlue: 0x435c,
      SaddleBrown: 0x8a22,
      Salmon: 0xfc0e,
      SandyBrown: 0xf52c,
      SeaGreen: 0x2c4a,
      SeaShell: 0xffbd,
      Sienna: 0xa285,
      Silver: 0xc618,
      SkyBlue: 0x867d,
      SlateBlue: 0x6ad9,
      SlateGray: 0x7412,
      Snow: 0xffdf,
      SpringGreen: 0x07ef,
      SteelBlue: 0x4416,
      Tan: 0xd5b1,
      Teal: 0x0410,
      Thistle: 0xddfb,
      Tomato: 0xfb08,
      Turquoise: 0x471a,
      Violet: 0xec1d,
      Wheat: 0xf6f6,
      White: 0xffff,
      WhiteSmoke: 0xf7be,
      Yellow: 0xffe0,
      YellowGreen: 0x9e66,
    };
  }
}

export default ST7735S;

// ----------------------------------------------------------

const ST7735S_TFTWIDTH: any = 80;
const ST7735S_TFTHEIGHT: any = 160;

// const ST7735_NOP = 0x00;
const ST7735_SWRESET: any = 0x01;
// const ST7735_RDDID = 0x04;
// const ST7735_RDDST = 0x09;
// const ST7735_RDDPM = 0x0a;

// const ST7735_SLPIN = 0x10;
const ST7735_SLPOUT: any = 0x11;
// const ST7735_PTLON = 0x12;
// const ST7735_NORON = 0x13;

const ST7735_INVOFF: any = 0x20;
const ST7735_INVON: any = 0x21;
const ST7735_DISPOFF: any = 0x28;
const ST7735_DISPON: any = 0x29;
const ST7735_CASET: any = 0x2a;
const ST7735_RASET: any = 0x2b;
const ST7735_RAMWR: any = 0x2c;
// const ST7735_RAMRD = 0x2e;
const ST7735_MADCTL: any = 0x36;
// const ST7735_PTLAR = 0x30;
const ST7735_COLMOD: any = 0x3a;

const ST7735_FRMCTR1: any = 0xb1;
const ST7735_FRMCTR2: any = 0xb2;
const ST7735_FRMCTR3: any = 0xb3;
const ST7735_INVCTR: any = 0xb4;
// const ST7735_DISSET5 = 0xb6;

const ST7735_PWCTR1: any = 0xc0;
const ST7735_PWCTR2: any = 0xc1;
const ST7735_PWCTR3: any = 0xc2;
const ST7735_PWCTR4: any = 0xc3;
const ST7735_PWCTR5: any = 0xc4;
const ST7735_VMCTR1: any = 0xc5;

// const ST7735_RDID1 = 0xda;
// const ST7735_RDID2 = 0xdb;
// const ST7735_RDID3 = 0xdc;
// const ST7735_RDID4 = 0xdd;

// const ST7735_PWCTR6 = 0xfc;

const ST7735_GMCTRP1: any = 0xe0;
const ST7735_GMCTRN1: any = 0xe1;

const ST7735_18bit: any = 0x06; // 18bit/pixel
const ST7735_16bit: any = 0x05; // 16bit/pixel

// standard ascii 5x7 font
const font: any = [
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x3e,
  0x5b,
  0x4f,
  0x5b,
  0x3e,
  0x3e,
  0x6b,
  0x4f,
  0x6b,
  0x3e,
  0x1c,
  0x3e,
  0x7c,
  0x3e,
  0x1c,
  0x18,
  0x3c,
  0x7e,
  0x3c,
  0x18,
  0x1c,
  0x57,
  0x7d,
  0x57,
  0x1c,
  0x1c,
  0x5e,
  0x7f,
  0x5e,
  0x1c,
  0x00,
  0x18,
  0x3c,
  0x18,
  0x00,
  0xff,
  0xe7,
  0xc3,
  0xe7,
  0xff,
  0x00,
  0x18,
  0x24,
  0x18,
  0x00,
  0xff,
  0xe7,
  0xdb,
  0xe7,
  0xff,
  0x30,
  0x48,
  0x3a,
  0x06,
  0x0e,
  0x26,
  0x29,
  0x79,
  0x29,
  0x26,
  0x40,
  0x7f,
  0x05,
  0x05,
  0x07,
  0x40,
  0x7f,
  0x05,
  0x25,
  0x3f,
  0x5a,
  0x3c,
  0xe7,
  0x3c,
  0x5a,
  0x7f,
  0x3e,
  0x1c,
  0x1c,
  0x08,
  0x08,
  0x1c,
  0x1c,
  0x3e,
  0x7f,
  0x14,
  0x22,
  0x7f,
  0x22,
  0x14,
  0x5f,
  0x5f,
  0x00,
  0x5f,
  0x5f,
  0x06,
  0x09,
  0x7f,
  0x01,
  0x7f,
  0x00,
  0x66,
  0x89,
  0x95,
  0x6a,
  0x60,
  0x60,
  0x60,
  0x60,
  0x60,
  0x94,
  0xa2,
  0xff,
  0xa2,
  0x94,
  0x08,
  0x04,
  0x7e,
  0x04,
  0x08,
  0x10,
  0x20,
  0x7e,
  0x20,
  0x10,
  0x08,
  0x08,
  0x2a,
  0x1c,
  0x08,
  0x08,
  0x1c,
  0x2a,
  0x08,
  0x08,
  0x1e,
  0x10,
  0x10,
  0x10,
  0x10,
  0x0c,
  0x1e,
  0x0c,
  0x1e,
  0x0c,
  0x30,
  0x38,
  0x3e,
  0x38,
  0x30,
  0x06,
  0x0e,
  0x3e,
  0x0e,
  0x06,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x5f,
  0x00,
  0x00,
  0x00,
  0x07,
  0x00,
  0x07,
  0x00,
  0x14,
  0x7f,
  0x14,
  0x7f,
  0x14,
  0x24,
  0x2a,
  0x7f,
  0x2a,
  0x12,
  0x23,
  0x13,
  0x08,
  0x64,
  0x62,
  0x36,
  0x49,
  0x56,
  0x20,
  0x50,
  0x00,
  0x08,
  0x07,
  0x03,
  0x00,
  0x00,
  0x1c,
  0x22,
  0x41,
  0x00,
  0x00,
  0x41,
  0x22,
  0x1c,
  0x00,
  0x2a,
  0x1c,
  0x7f,
  0x1c,
  0x2a,
  0x08,
  0x08,
  0x3e,
  0x08,
  0x08,
  0x00,
  0x80,
  0x70,
  0x30,
  0x00,
  0x08,
  0x08,
  0x08,
  0x08,
  0x08,
  0x00,
  0x00,
  0x60,
  0x60,
  0x00,
  0x20,
  0x10,
  0x08,
  0x04,
  0x02,
  0x3e,
  0x51,
  0x49,
  0x45,
  0x3e,
  0x00,
  0x42,
  0x7f,
  0x40,
  0x00,
  0x72,
  0x49,
  0x49,
  0x49,
  0x46,
  0x21,
  0x41,
  0x49,
  0x4d,
  0x33,
  0x18,
  0x14,
  0x12,
  0x7f,
  0x10,
  0x27,
  0x45,
  0x45,
  0x45,
  0x39,
  0x3c,
  0x4a,
  0x49,
  0x49,
  0x31,
  0x41,
  0x21,
  0x11,
  0x09,
  0x07,
  0x36,
  0x49,
  0x49,
  0x49,
  0x36,
  0x46,
  0x49,
  0x49,
  0x29,
  0x1e,
  0x00,
  0x00,
  0x14,
  0x00,
  0x00,
  0x00,
  0x40,
  0x34,
  0x00,
  0x00,
  0x00,
  0x08,
  0x14,
  0x22,
  0x41,
  0x14,
  0x14,
  0x14,
  0x14,
  0x14,
  0x00,
  0x41,
  0x22,
  0x14,
  0x08,
  0x02,
  0x01,
  0x59,
  0x09,
  0x06,
  0x3e,
  0x41,
  0x5d,
  0x59,
  0x4e,
  0x7c,
  0x12,
  0x11,
  0x12,
  0x7c,
  0x7f,
  0x49,
  0x49,
  0x49,
  0x36,
  0x3e,
  0x41,
  0x41,
  0x41,
  0x22,
  0x7f,
  0x41,
  0x41,
  0x41,
  0x3e,
  0x7f,
  0x49,
  0x49,
  0x49,
  0x41,
  0x7f,
  0x09,
  0x09,
  0x09,
  0x01,
  0x3e,
  0x41,
  0x41,
  0x51,
  0x73,
  0x7f,
  0x08,
  0x08,
  0x08,
  0x7f,
  0x00,
  0x41,
  0x7f,
  0x41,
  0x00,
  0x20,
  0x40,
  0x41,
  0x3f,
  0x01,
  0x7f,
  0x08,
  0x14,
  0x22,
  0x41,
  0x7f,
  0x40,
  0x40,
  0x40,
  0x40,
  0x7f,
  0x02,
  0x1c,
  0x02,
  0x7f,
  0x7f,
  0x04,
  0x08,
  0x10,
  0x7f,
  0x3e,
  0x41,
  0x41,
  0x41,
  0x3e,
  0x7f,
  0x09,
  0x09,
  0x09,
  0x06,
  0x3e,
  0x41,
  0x51,
  0x21,
  0x5e,
  0x7f,
  0x09,
  0x19,
  0x29,
  0x46,
  0x26,
  0x49,
  0x49,
  0x49,
  0x32,
  0x03,
  0x01,
  0x7f,
  0x01,
  0x03,
  0x3f,
  0x40,
  0x40,
  0x40,
  0x3f,
  0x1f,
  0x20,
  0x40,
  0x20,
  0x1f,
  0x3f,
  0x40,
  0x38,
  0x40,
  0x3f,
  0x63,
  0x14,
  0x08,
  0x14,
  0x63,
  0x03,
  0x04,
  0x78,
  0x04,
  0x03,
  0x61,
  0x59,
  0x49,
  0x4d,
  0x43,
  0x00,
  0x7f,
  0x41,
  0x41,
  0x41,
  0x02,
  0x04,
  0x08,
  0x10,
  0x20,
  0x00,
  0x41,
  0x41,
  0x41,
  0x7f,
  0x04,
  0x02,
  0x01,
  0x02,
  0x04,
  0x40,
  0x40,
  0x40,
  0x40,
  0x40,
  0x00,
  0x03,
  0x07,
  0x08,
  0x00,
  0x20,
  0x54,
  0x54,
  0x78,
  0x40,
  0x7f,
  0x28,
  0x44,
  0x44,
  0x38,
  0x38,
  0x44,
  0x44,
  0x44,
  0x28,
  0x38,
  0x44,
  0x44,
  0x28,
  0x7f,
  0x38,
  0x54,
  0x54,
  0x54,
  0x18,
  0x00,
  0x08,
  0x7e,
  0x09,
  0x02,
  0x18,
  0xa4,
  0xa4,
  0x9c,
  0x78,
  0x7f,
  0x08,
  0x04,
  0x04,
  0x78,
  0x00,
  0x44,
  0x7d,
  0x40,
  0x00,
  0x20,
  0x40,
  0x40,
  0x3d,
  0x00,
  0x7f,
  0x10,
  0x28,
  0x44,
  0x00,
  0x00,
  0x41,
  0x7f,
  0x40,
  0x00,
  0x7c,
  0x04,
  0x78,
  0x04,
  0x78,
  0x7c,
  0x08,
  0x04,
  0x04,
  0x78,
  0x38,
  0x44,
  0x44,
  0x44,
  0x38,
  0xfc,
  0x18,
  0x24,
  0x24,
  0x18,
  0x18,
  0x24,
  0x24,
  0x18,
  0xfc,
  0x7c,
  0x08,
  0x04,
  0x04,
  0x08,
  0x48,
  0x54,
  0x54,
  0x54,
  0x24,
  0x04,
  0x04,
  0x3f,
  0x44,
  0x24,
  0x3c,
  0x40,
  0x40,
  0x20,
  0x7c,
  0x1c,
  0x20,
  0x40,
  0x20,
  0x1c,
  0x3c,
  0x40,
  0x30,
  0x40,
  0x3c,
  0x44,
  0x28,
  0x10,
  0x28,
  0x44,
  0x4c,
  0x90,
  0x90,
  0x90,
  0x7c,
  0x44,
  0x64,
  0x54,
  0x4c,
  0x44,
  0x00,
  0x08,
  0x36,
  0x41,
  0x00,
  0x00,
  0x00,
  0x77,
  0x00,
  0x00,
  0x00,
  0x41,
  0x36,
  0x08,
  0x00,
  0x02,
  0x01,
  0x02,
  0x04,
  0x02,
  0x3c,
  0x26,
  0x23,
  0x26,
  0x3c,
  0x1e,
  0xa1,
  0xa1,
  0x61,
  0x12,
  0x3a,
  0x40,
  0x40,
  0x20,
  0x7a,
  0x38,
  0x54,
  0x54,
  0x55,
  0x59,
  0x21,
  0x55,
  0x55,
  0x79,
  0x41,
  0x21,
  0x54,
  0x54,
  0x78,
  0x41,
  0x21,
  0x55,
  0x54,
  0x78,
  0x40,
  0x20,
  0x54,
  0x55,
  0x79,
  0x40,
  0x0c,
  0x1e,
  0x52,
  0x72,
  0x12,
  0x39,
  0x55,
  0x55,
  0x55,
  0x59,
  0x39,
  0x54,
  0x54,
  0x54,
  0x59,
  0x39,
  0x55,
  0x54,
  0x54,
  0x58,
  0x00,
  0x00,
  0x45,
  0x7c,
  0x41,
  0x00,
  0x02,
  0x45,
  0x7d,
  0x42,
  0x00,
  0x01,
  0x45,
  0x7c,
  0x40,
  0xf0,
  0x29,
  0x24,
  0x29,
  0xf0,
  0xf0,
  0x28,
  0x25,
  0x28,
  0xf0,
  0x7c,
  0x54,
  0x55,
  0x45,
  0x00,
  0x20,
  0x54,
  0x54,
  0x7c,
  0x54,
  0x7c,
  0x0a,
  0x09,
  0x7f,
  0x49,
  0x32,
  0x49,
  0x49,
  0x49,
  0x32,
  0x32,
  0x48,
  0x48,
  0x48,
  0x32,
  0x32,
  0x4a,
  0x48,
  0x48,
  0x30,
  0x3a,
  0x41,
  0x41,
  0x21,
  0x7a,
  0x3a,
  0x42,
  0x40,
  0x20,
  0x78,
  0x00,
  0x9d,
  0xa0,
  0xa0,
  0x7d,
  0x39,
  0x44,
  0x44,
  0x44,
  0x39,
  0x3d,
  0x40,
  0x40,
  0x40,
  0x3d,
  0x3c,
  0x24,
  0xff,
  0x24,
  0x24,
  0x48,
  0x7e,
  0x49,
  0x43,
  0x66,
  0x2b,
  0x2f,
  0xfc,
  0x2f,
  0x2b,
  0xff,
  0x09,
  0x29,
  0xf6,
  0x20,
  0xc0,
  0x88,
  0x7e,
  0x09,
  0x03,
  0x20,
  0x54,
  0x54,
  0x79,
  0x41,
  0x00,
  0x00,
  0x44,
  0x7d,
  0x41,
  0x30,
  0x48,
  0x48,
  0x4a,
  0x32,
  0x38,
  0x40,
  0x40,
  0x22,
  0x7a,
  0x00,
  0x7a,
  0x0a,
  0x0a,
  0x72,
  0x7d,
  0x0d,
  0x19,
  0x31,
  0x7d,
  0x26,
  0x29,
  0x29,
  0x2f,
  0x28,
  0x26,
  0x29,
  0x29,
  0x29,
  0x26,
  0x30,
  0x48,
  0x4d,
  0x40,
  0x20,
  0x38,
  0x08,
  0x08,
  0x08,
  0x08,
  0x08,
  0x08,
  0x08,
  0x08,
  0x38,
  0x2f,
  0x10,
  0xc8,
  0xac,
  0xba,
  0x2f,
  0x10,
  0x28,
  0x34,
  0xfa,
  0x00,
  0x00,
  0x7b,
  0x00,
  0x00,
  0x08,
  0x14,
  0x2a,
  0x14,
  0x22,
  0x22,
  0x14,
  0x2a,
  0x14,
  0x08,
  0xaa,
  0x00,
  0x55,
  0x00,
  0xaa,
  0xaa,
  0x55,
  0xaa,
  0x55,
  0xaa,
  0x00,
  0x00,
  0x00,
  0xff,
  0x00,
  0x10,
  0x10,
  0x10,
  0xff,
  0x00,
  0x14,
  0x14,
  0x14,
  0xff,
  0x00,
  0x10,
  0x10,
  0xff,
  0x00,
  0xff,
  0x10,
  0x10,
  0xf0,
  0x10,
  0xf0,
  0x14,
  0x14,
  0x14,
  0xfc,
  0x00,
  0x14,
  0x14,
  0xf7,
  0x00,
  0xff,
  0x00,
  0x00,
  0xff,
  0x00,
  0xff,
  0x14,
  0x14,
  0xf4,
  0x04,
  0xfc,
  0x14,
  0x14,
  0x17,
  0x10,
  0x1f,
  0x10,
  0x10,
  0x1f,
  0x10,
  0x1f,
  0x14,
  0x14,
  0x14,
  0x1f,
  0x00,
  0x10,
  0x10,
  0x10,
  0xf0,
  0x00,
  0x00,
  0x00,
  0x00,
  0x1f,
  0x10,
  0x10,
  0x10,
  0x10,
  0x1f,
  0x10,
  0x10,
  0x10,
  0x10,
  0xf0,
  0x10,
  0x00,
  0x00,
  0x00,
  0xff,
  0x10,
  0x10,
  0x10,
  0x10,
  0x10,
  0x10,
  0x10,
  0x10,
  0x10,
  0xff,
  0x10,
  0x00,
  0x00,
  0x00,
  0xff,
  0x14,
  0x00,
  0x00,
  0xff,
  0x00,
  0xff,
  0x00,
  0x00,
  0x1f,
  0x10,
  0x17,
  0x00,
  0x00,
  0xfc,
  0x04,
  0xf4,
  0x14,
  0x14,
  0x17,
  0x10,
  0x17,
  0x14,
  0x14,
  0xf4,
  0x04,
  0xf4,
  0x00,
  0x00,
  0xff,
  0x00,
  0xf7,
  0x14,
  0x14,
  0x14,
  0x14,
  0x14,
  0x14,
  0x14,
  0xf7,
  0x00,
  0xf7,
  0x14,
  0x14,
  0x14,
  0x17,
  0x14,
  0x10,
  0x10,
  0x1f,
  0x10,
  0x1f,
  0x14,
  0x14,
  0x14,
  0xf4,
  0x14,
  0x10,
  0x10,
  0xf0,
  0x10,
  0xf0,
  0x00,
  0x00,
  0x1f,
  0x10,
  0x1f,
  0x00,
  0x00,
  0x00,
  0x1f,
  0x14,
  0x00,
  0x00,
  0x00,
  0xfc,
  0x14,
  0x00,
  0x00,
  0xf0,
  0x10,
  0xf0,
  0x10,
  0x10,
  0xff,
  0x10,
  0xff,
  0x14,
  0x14,
  0x14,
  0xff,
  0x14,
  0x10,
  0x10,
  0x10,
  0x1f,
  0x00,
  0x00,
  0x00,
  0x00,
  0xf0,
  0x10,
  0xff,
  0xff,
  0xff,
  0xff,
  0xff,
  0xf0,
  0xf0,
  0xf0,
  0xf0,
  0xf0,
  0xff,
  0xff,
  0xff,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0xff,
  0xff,
  0x0f,
  0x0f,
  0x0f,
  0x0f,
  0x0f,
  0x38,
  0x44,
  0x44,
  0x38,
  0x44,
  0x7c,
  0x2a,
  0x2a,
  0x3e,
  0x14,
  0x7e,
  0x02,
  0x02,
  0x06,
  0x06,
  0x02,
  0x7e,
  0x02,
  0x7e,
  0x02,
  0x63,
  0x55,
  0x49,
  0x41,
  0x63,
  0x38,
  0x44,
  0x44,
  0x3c,
  0x04,
  0x40,
  0x7e,
  0x20,
  0x1e,
  0x20,
  0x06,
  0x02,
  0x7e,
  0x02,
  0x02,
  0x99,
  0xa5,
  0xe7,
  0xa5,
  0x99,
  0x1c,
  0x2a,
  0x49,
  0x2a,
  0x1c,
  0x4c,
  0x72,
  0x01,
  0x72,
  0x4c,
  0x30,
  0x4a,
  0x4d,
  0x4d,
  0x30,
  0x30,
  0x48,
  0x78,
  0x48,
  0x30,
  0xbc,
  0x62,
  0x5a,
  0x46,
  0x3d,
  0x3e,
  0x49,
  0x49,
  0x49,
  0x00,
  0x7e,
  0x01,
  0x01,
  0x01,
  0x7e,
  0x2a,
  0x2a,
  0x2a,
  0x2a,
  0x2a,
  0x44,
  0x44,
  0x5f,
  0x44,
  0x44,
  0x40,
  0x51,
  0x4a,
  0x44,
  0x40,
  0x40,
  0x44,
  0x4a,
  0x51,
  0x40,
  0x00,
  0x00,
  0xff,
  0x01,
  0x03,
  0xe0,
  0x80,
  0xff,
  0x00,
  0x00,
  0x08,
  0x08,
  0x6b,
  0x6b,
  0x08,
  0x36,
  0x12,
  0x36,
  0x24,
  0x36,
  0x06,
  0x0f,
  0x09,
  0x0f,
  0x06,
  0x00,
  0x00,
  0x18,
  0x18,
  0x00,
  0x00,
  0x00,
  0x10,
  0x10,
  0x00,
  0x30,
  0x40,
  0xff,
  0x01,
  0x01,
  0x00,
  0x1f,
  0x01,
  0x01,
  0x1e,
  0x00,
  0x19,
  0x1d,
  0x17,
  0x12,
  0x00,
  0x3c,
  0x3c,
  0x3c,
  0x3c,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
];
