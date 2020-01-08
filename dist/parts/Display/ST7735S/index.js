"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//SainSmart ST7735 1.8" TFT LCD 128x160 pixel
class ST7735S {
    constructor() {
        this.keys = ['sclk', 'mosi', 'cs', 'res', 'dc'];
        this.required = [];
    }
    static info() {
        return {
            name: 'ST7735S',
        };
    }
    wired(obniz) {
        this.debugprint = false;
        this.obniz = obniz;
        this.io_dc = obniz.getIO(this.params.dc);
        this.io_res = obniz.getIO(this.params.res);
        this.io_cs = obniz.getIO(this.params.cs);
        this.params.frequency = 16 * 1000 * 1000; //16MHz
        this.params.mode = 'master';
        this.params.clk = this.params.sclk;
        this.params.mosi = this.params.mosi;
        this.params.drive = '3v';
        this.spi = this.obniz.getSpiWithConfig(this.params);
        this.io_dc.output(true);
        this.io_cs.output(false);
        this.width = ST7735S_TFTWIDTH;
        this.height = ST7735S_TFTHEIGHT;
        this.rotation = 0;
        this.x_offset = 26;
        this.y_offset = 2;
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
        while (new Date() - startMsec < waitMsec)
            ;
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
        if (data.length == 0)
            return;
        this.writeCommand(cmd);
        this.writeData(data);
    }
    asyncwait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.spi.writeWait([0x00]);
        });
    }
    _writeFlush() {
        while (this.writeBuffer.length > 0) {
            if (this.writeBuffer.length > 1024) {
                let data = this.writeBuffer.slice(0, 1024);
                this.writeData(data);
                this.writeBuffer.splice(0, 1024);
            }
            else {
                if (this.writeBuffer.length > 0)
                    this.writeData(this.writeBuffer);
                this.writeBuffer = [];
            }
        }
    }
    _writeBuffer(data) {
        if (data && data.length > 0) {
            this.writeBuffer = this.writeBuffer.concat(data);
        }
        else {
            this._writeFlush();
        }
    }
    color16(r, g, b) {
        //  1st byte  (r & 0xF8 | g >> 5)
        //  2nd byte  (g & 0xFC << 3 | b >> 3)
        return ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3);
    }
    complementaryColor16(color) {
        let r = (color & 0xf800) >> 8;
        let g = (color & 0x7e0) >> 3;
        let b = (color & 0x1f) << 3;
        let x = Math.max(r, g, b) + Math.min(r, g, b);
        return this.color16(x - r, x - g, x - b);
    }
    reverseColor16(color) {
        let r = (color & 0xf800) >> 8;
        let g = (color & 0x7e0) >> 3;
        let b = (color & 0x1f) << 3;
        let x = 0xff;
        return this.color16(x - r, x - g, x - b);
    }
    _initG() {
        // initialize display
        this.writeCommand(ST7735_SWRESET);
        this.obniz.wait(150);
        this.writeCommand(ST7735_SLPOUT); //Sleep out & booster on
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
        if (on == true)
            this.setDisplayOn();
        else
            this.setDisplayOff();
    }
    setInversionOn() {
        this.writeCommand(ST7735_INVON);
    }
    setInversionOff() {
        this.writeCommand(ST7735_INVOFF);
    }
    setInversion(inversion) {
        if (inversion == true)
            this.setInversionOn();
        else
            this.setInversionOff();
    }
    setRotation(m) {
        const MADCTL_MY = 0x80;
        const MADCTL_MX = 0x40;
        const MADCTL_MV = 0x20;
        // const MADCTL_ML = 0x10;
        const MADCTL_RGB = 0x00; //always RGB, never BGR
        // const MADCTL_MH = 0x04;
        let data;
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
    setAddrWindow(x0, y0, x1, y1) {
        this.print_debug(`setAddrWindow: (x0: ${x0}, y0: ${y0}) - (x1: ${x1}, y1: ${y1})`);
        if (x0 < 0)
            x0 = 0;
        if (y0 < 0)
            y0 = 0;
        if (x1 < 0)
            x1 = 0;
        if (y1 < 0)
            y1 = 0;
        if (this.rotation == 0 || this.rotation == 2) {
            x0 = x0 + this.x_offset;
            x1 = x1 + this.x_offset;
            y0 = y0 + this.y_offset;
            y1 = y1 + this.y_offset;
        }
        else {
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
    //__swap(a, b) { let t = a; a = b; b = t; }
    fillScreen(color) {
        this.fillRect(0, 0, this.width, this.height, color);
    }
    _color2pixels(w, h, color) {
        return Array.from(new Array(Math.abs(w * h))).map((v, i) => color);
    }
    fillRect(x, y, w, h, color) {
        if (x >= this.width || y >= this.height)
            return;
        if (x + w - 1 >= this.width)
            w = this.width - x;
        if (y + h - 1 >= this.height)
            h = this.height - y;
        let pixels = this._color2pixels(w, h, color);
        this.rawBound16(x, y, w, h, pixels, true);
    }
    drawRect(x, y, w, h, color) {
        this.drawHLine(x, y, w, color);
        this.drawHLine(x, y + h - 1, w, color);
        this.drawVLine(x, y, h, color);
        this.drawVLine(x + w - 1, y, h, color);
    }
    drawCircle(x0, y0, r, color) {
        let f = 1 - r;
        let ddF_x = 1;
        let ddF_y = -2 * r;
        let x = 0;
        let y = r;
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
        let f = 1 - r;
        let ddF_x = 1;
        let ddF_y = -2 * r;
        let x = 0;
        let y = r;
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
    fillCircle(x0, y0, r, color) {
        this.drawVLine(x0, y0 - r, 2 * r + 1, color);
        this._fillCircleHelper(x0, y0, r, 3, 0, color);
    }
    _fillCircleHelper(x0, y0, r, cornername, delta, color) {
        let f = 1 - r;
        let ddF_x = 1;
        let ddF_y = -2 * r;
        let x = 0;
        let y = r;
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
    drawRoundRect(x, y, w, h, r, color) {
        this.drawHLine(x + r, y, w - 2 * r, color); // Top
        this.drawHLine(x + r, y + h - 1, w - 2 * r, color); // Bottom
        this.drawVLine(x, y + r, h - 2 * r, color); // Left
        this.drawVLine(x + w - 1, y + r, h - 2 * r, color); // Right
        this._drawCircleHelper(x + r, y + r, r, 1, color);
        this._drawCircleHelper(x + w - r - 1, y + r, r, 2, color);
        this._drawCircleHelper(x + w - r - 1, y + h - r - 1, r, 4, color);
        this._drawCircleHelper(x + r, y + h - r - 1, r, 8, color);
    }
    fillRoundRect(x, y, w, h, r, color) {
        this.fillRect(x + r, y, w - 2 * r, h, color);
        this._fillCircleHelper(x + w - r - 1, y + r, r, 1, h - 2 * r - 1, color);
        this._fillCircleHelper(x + r, y + r, r, 2, h - 2 * r - 1, color);
    }
    drawTriangle(x0, y0, x1, y1, x2, y2, color) {
        this.drawLine(x0, y0, x1, y1, color);
        this.drawLine(x1, y1, x2, y2, color);
        this.drawLine(x2, y2, x0, y0, color);
    }
    fillTriangle(x0, y0, x1, y1, x2, y2, color) {
        let a, b, y, last;
        // Sort coordinates by Y order (y2 >= y1 >= y0)
        if (y0 > y1) {
            y1 = [y0, (y0 = y1)][0]; //this._swap(y0, y1);
            x1 = [x0, (x0 = x1)][0]; //this._swap(x0, x1);
        }
        if (y1 > y2) {
            y2 = [y1, (y1 = y2)][0]; //this._swap(y2, y1);
            x2 = [x1, (x1 = x2)][0]; //this._swap(x2, x1);
        }
        if (y0 > y1) {
            y1 = [y0, (y0 = y1)][0]; //this._swap(y0, y1);
            x1 = [x0, (x0 = x1)][0]; //this._swap(x0, x1);
        }
        if (y0 == y2) {
            // Handle awkward all-on-same-line case as its own thing
            a = b = x0;
            if (x1 < a)
                a = x1;
            else if (x1 > b)
                b = x1;
            if (x2 < a)
                a = x2;
            else if (x2 > b)
                b = x2;
            this.drawHLine(a, y0, b - a + 1, color);
            return;
        }
        let dx01 = x1 - x0, dy01 = y1 - y0, dx02 = x2 - x0, dy02 = y2 - y0, dx12 = x2 - x1, dy12 = y2 - y1, sa = 0, sb = 0;
        if (y1 == y2)
            last = y1;
        // include y1 scanline
        else
            last = y1 - 1; // skip it
        for (y = y0; y <= last; y++) {
            a = x0 + Math.floor(sa / dy01);
            b = x0 + Math.floor(sb / dy02);
            sa += dx01;
            sb += dx02;
            if (a > b)
                b = [a, (a = b)][0]; //this._swap(a,b);
            this.drawHLine(a, y, b - a + 1, color);
        }
        sa = dx12 * (y - y1);
        sb = dx02 * (y - y0);
        for (; y <= y2; y++) {
            a = x1 + Math.floor(sa / dy12);
            b = x0 + Math.floor(sb / dy02);
            sa += dx12;
            sb += dx02;
            if (a > b)
                b = [a, (a = b)][0]; //this._swap(a,b);
            this.drawHLine(a, y, b - a + 1, color);
        }
    }
    drawVLine(x, y, h, color) {
        if (h < 0) {
            h = -h;
            y = y - h;
        }
        if (x >= this.width || y >= this.height)
            return;
        if (y + h - 1 >= this.height)
            h = this.height - y;
        let pixels = this._color2pixels(1, h, color);
        this.rawBound16(x, y, 1, h, pixels, false);
    }
    drawHLine(x, y, w, color) {
        if (w < 0) {
            w = -w;
            x = x - w;
        }
        if (x >= this.width || y >= this.height)
            return;
        if (x + w - 1 >= this.width)
            w = this.width - x;
        let pixels = this._color2pixels(w, 1, color);
        this.rawBound16(x, y, w, 1, pixels, false);
    }
    drawLine(x0, y0, x1, y1, color) {
        if (x0 == x1) {
            this.drawVLine(x0, y0, y1 - y0, color);
            return;
        }
        if (y0 == y1) {
            this.drawHLine(x0, y0, x1 - x0, color);
            return;
        }
        let step = Math.abs(y1 - y0) > Math.abs(x1 - x0);
        if (step) {
            y0 = [x0, (x0 = y0)][0]; //this._swap(x0, y0);
            y1 = [x1, (x1 = y1)][0]; //this._swap(x1, y1);
        }
        if (x0 > x1) {
            x1 = [x0, (x0 = x1)][0]; //this._swap(x0, x1);
            y1 = [y0, (y0 = y1)][0]; //this._swap(y0, y1);
        }
        let dx = x1 - x0;
        let dy = Math.abs(y1 - y0);
        let err = dx / 2;
        let ystep = y0 < y1 ? 1 : -1;
        for (; x0 <= x1; x0++) {
            if (step) {
                this.drawPixel(y0, x0, color);
            }
            else {
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
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            return;
        this.rawBound16(x, y, 1, 1, [color], false);
    }
    drawChar(x, y, ch, color, bg, size) {
        //  bg = bg || color;
        size = size || 1;
        if (x >= this.width || // Clip right
            y >= this.height || // Clip bottom
            x + 6 * size - 1 < 0 || // Clip left
            y + 8 * size - 1 < 0)
            // Clip top
            return;
        if (color != bg) {
            this.drawChar2(x, y, ch, color, bg, size);
            return;
        }
        let c = ch.charCodeAt(0);
        for (let i = 0; i < 6; i++) {
            let line = i == 5 ? 0 : font[c * 5 + i];
            for (let j = 0; j < 8; j++) {
                if (line & 0x1) {
                    if (size == 1)
                        // default size
                        this.drawPixel(x + i, y + j, color);
                    else {
                        // big size
                        this.fillRect(x + i * size, y + j * size, size, size, color);
                    }
                }
                else if (bg != color) {
                    if (size == 1)
                        // default size
                        this.drawPixel(x + i, y + j, bg);
                    else {
                        // big size
                        this.fillRect(x + i * size, y + j * size, size, size, bg);
                    }
                }
                line >>= 1;
            }
        }
    }
    drawChar2(x, y, ch, color, bg, size) {
        //  bg = bg || color;
        size = size || 1;
        if (x >= this.width || // Clip right
            y >= this.height || // Clip bottom
            x + 6 * size - 1 < 0 || // Clip left
            y + 8 * size - 1 < 0 // Clip top
        )
            return;
        let pixels = new Array(6 * 8 * size * size);
        let c = ch.charCodeAt(0);
        for (let i = 0; i < 6; i++) {
            let line = i == 5 ? 0 : font[c * 5 + i];
            for (let j = 0; j < 8; j++) {
                let cl = line & 0x1 ? color : bg;
                for (let w = 0; w < size; w++) {
                    for (let h = 0; h < size; h++) {
                        pixels[i * (1 * size) + w + (j * (6 * size * size) + h * (6 * size))] = cl;
                    }
                }
                line >>= 1;
            }
        }
        this.rawBound16(x, y, 6 * size, 8 * size, pixels);
    }
    rawBound16(x, y, width, height, pixels, flush) {
        let rgb = [];
        pixels.forEach(function (v) {
            let v2 = ((v & 0xf800) >> 11) | (v & 0x7e0) | ((v & 0x1f) << 11);
            rgb.push((v2 & 0xff00) >> 8);
            rgb.push(v2 & 0xff);
        });
        this.setAddrWindow(x, y, x + width - 1, y + height - 1);
        if (flush) {
            this._writeBuffer(rgb);
            this._writeBuffer(); //for flush
        }
        else {
            this.writeData(rgb);
        }
    }
    drawString(x, y, str, color, bg, size, wrap) {
        //  bg = bg || color;
        size = size || 1;
        //  wrap = wrap || true;
        for (let n = 0; n < str.length; n++) {
            let c = str.charAt(n);
            if (c == '\n') {
                y += size * 8;
                x = 0;
            }
            else if (c == '\r') {
                // skip em
            }
            else {
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
        let rgb = [];
        for (let n = 0; n < imageData.length; n += 4) {
            let r = imageData[n + 0];
            let g = imageData[n + 1];
            let b = imageData[n + 2];
            if (!gray) {
                rgb.push(b);
                rgb.push(g);
                rgb.push(r);
            }
            else {
                let gs = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                rgb.push(gs);
                rgb.push(gs);
                rgb.push(gs);
            }
        }
        this.write(ST7735_COLMOD, [ST7735_18bit]); //18bit/pixel
        this.setAddrWindow(x1, y1, x1 + width - 1, y1 + height - 1);
        this._writeBuffer(rgb);
        this._writeBuffer(); //for flush
        this.write(ST7735_COLMOD, [ST7735_16bit]); //16bit/pixel
    }
    drawContext(context, gray) {
        gray = gray || false;
        this.drawContextBound(context, 0, 0, this.width, this.height, 0, 0, gray);
    }
    draw(context, gray) {
        this.drawContext(context, gray);
    }
    rawBound(x, y, width, height, pixels) {
        let rgb = [];
        pixels.forEach(function (v) {
            rgb.push(v & 0xff);
            rgb.push((v & 0xff00) >> 8);
            rgb.push((v & 0xff0000) >> 16);
        });
        this.write(ST7735_COLMOD, [ST7735_18bit]); //18bit/pixel
        this.setAddrWindow(x, y, x + width - 1, y + height - 1);
        this._writeBuffer(rgb);
        this._writeBuffer(); //for flush
        this.write(ST7735_COLMOD, [ST7735_16bit]); //16bit/pixel
    }
    raw(pixels) {
        this.rawBound16(0, 0, this.width, this.height, pixels, true);
    }
    _setPresetColor() {
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
if (typeof module === 'object') {
    module.exports = ST7735S;
}
//----------------------------------------------------------
const ST7735S_TFTWIDTH = 80;
const ST7735S_TFTHEIGHT = 160;
// const ST7735_NOP = 0x00;
const ST7735_SWRESET = 0x01;
// const ST7735_RDDID = 0x04;
// const ST7735_RDDST = 0x09;
// const ST7735_RDDPM = 0x0a;
// const ST7735_SLPIN = 0x10;
const ST7735_SLPOUT = 0x11;
// const ST7735_PTLON = 0x12;
// const ST7735_NORON = 0x13;
const ST7735_INVOFF = 0x20;
const ST7735_INVON = 0x21;
const ST7735_DISPOFF = 0x28;
const ST7735_DISPON = 0x29;
const ST7735_CASET = 0x2a;
const ST7735_RASET = 0x2b;
const ST7735_RAMWR = 0x2c;
// const ST7735_RAMRD = 0x2e;
const ST7735_MADCTL = 0x36;
// const ST7735_PTLAR = 0x30;
const ST7735_COLMOD = 0x3a;
const ST7735_FRMCTR1 = 0xb1;
const ST7735_FRMCTR2 = 0xb2;
const ST7735_FRMCTR3 = 0xb3;
const ST7735_INVCTR = 0xb4;
// const ST7735_DISSET5 = 0xb6;
const ST7735_PWCTR1 = 0xc0;
const ST7735_PWCTR2 = 0xc1;
const ST7735_PWCTR3 = 0xc2;
const ST7735_PWCTR4 = 0xc3;
const ST7735_PWCTR5 = 0xc4;
const ST7735_VMCTR1 = 0xc5;
// const ST7735_RDID1 = 0xda;
// const ST7735_RDID2 = 0xdb;
// const ST7735_RDID3 = 0xdc;
// const ST7735_RDID4 = 0xdd;
// const ST7735_PWCTR6 = 0xfc;
const ST7735_GMCTRP1 = 0xe0;
const ST7735_GMCTRN1 = 0xe1;
const ST7735_18bit = 0x06; // 18bit/pixel
const ST7735_16bit = 0x05; // 16bit/pixel
// standard ascii 5x7 font
const font = [
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXNwbGF5L1NUNzczNVMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZDQUE2QztBQUM3QyxNQUFNLE9BQU87SUFDWDtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJO1FBQ1QsT0FBTztZQUNMLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU87UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpCLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQjtRQUU3QyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQ1QscUJBQXFCLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDdkUsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVELFVBQVUsQ0FBQyxRQUFRO1FBQ2pCLElBQUksU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDM0IsT0FBTyxJQUFJLElBQUksRUFBRSxHQUFHLFNBQVMsR0FBRyxRQUFRO1lBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQUc7UUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFJO1FBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSTtRQUNiLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQUUsT0FBTztRQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVLLFNBQVM7O1lBQ2IsT0FBTyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMs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RyxDQUFDLEVBQUU7WUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ1YsQ0FBQyxFQUFFLENBQUM7Z0JBQ0osS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFDWCxDQUFDLElBQUksS0FBSyxDQUFDO2FBQ1o7WUFDRCxDQUFDLEVBQUUsQ0FBQztZQUNKLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDLElBQUksS0FBSyxDQUFDO1lBRVgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUs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QUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU87UUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUTtRQUU1RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUs7UUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLO1FBQ3hDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFB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SUFBSSxDQUFDLENBQUMsY0FBYztBQUV6QywwQkFBMEI7QUFDMUIsTUFBTSxJQUFJLEdBQUc7SUFDWCxJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7Q0FDTCxDQUFDIiwiZmlsZSI6InBhcnRzL0Rpc3BsYXkvU1Q3NzM1Uy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vU2FpblNtYXJ0IFNUNzczNSAxLjhcIiBURlQgTENEIDEyOHgxNjAgcGl4ZWxcbmNsYXNzIFNUNzczNVMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3NjbGsnLCAnbW9zaScsICdjcycsICdyZXMnLCAnZGMnXTtcbiAgICB0aGlzLnJlcXVpcmVkID0gW107XG4gIH1cblxuICBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1NUNzczNVMnLFxuICAgIH07XG4gIH1cblxuICB3aXJlZChvYm5peikge1xuICAgIHRoaXMuZGVidWdwcmludCA9IGZhbHNlO1xuICAgIHRoaXMub2JuaXogPSBvYm5pejtcblxuICAgIHRoaXMuaW9fZGMgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5kYyk7XG4gICAgdGhpcy5pb19yZXMgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5yZXMpO1xuICAgIHRoaXMuaW9fY3MgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5jcyk7XG5cbiAgICB0aGlzLnBhcmFtcy5mcmVxdWVuY3kgPSAxNiAqIDEwMDAgKiAxMDAwOyAvLzE2TUh6XG4gICAgdGhpcy5wYXJhbXMubW9kZSA9ICdtYXN0ZXInO1xuICAgIHRoaXMucGFyYW1zLmNsayA9IHRoaXMucGFyYW1zLnNjbGs7XG4gICAgdGhpcy5wYXJhbXMubW9zaSA9IHRoaXMucGFyYW1zLm1vc2k7XG4gICAgdGhpcy5wYXJhbXMuZHJpdmUgPSAnM3YnO1xuICAgIHRoaXMuc3BpID0gdGhpcy5vYm5pei5nZXRTcGlXaXRoQ29uZmlnKHRoaXMucGFyYW1zKTtcblxuICAgIHRoaXMuaW9fZGMub3V0cHV0KHRydWUpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KGZhbHNlKTtcblxuICAgIHRoaXMud2lkdGggPSBTVDc3MzVTX1RGVFdJRFRIO1xuICAgIHRoaXMuaGVpZ2h0ID0gU1Q3NzM1U19URlRIRUlHSFQ7XG4gICAgdGhpcy5yb3RhdGlvbiA9IDA7XG4gICAgdGhpcy54X29mZnNldCA9IDI2O1xuICAgIHRoaXMueV9vZmZzZXQgPSAyO1xuXG4gICAgdGhpcy53cml0ZUJ1ZmZlciA9IFtdOyAvLzEwMjRieXRlcyBidWZmZXJyaW5nXG5cbiAgICB0aGlzLl9zZXRQcmVzZXRDb2xvcigpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHJpbnRfZGVidWcodikge1xuICAgIGlmICh0aGlzLmRlYnVncHJpbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnU2FpblNtYXJ0VEZUMThMQ0Q6ICcgKyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJycpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIF9kZWFkU2xlZXAod2FpdE1zZWMpIHtcbiAgICBsZXQgc3RhcnRNc2VjID0gbmV3IERhdGUoKTtcbiAgICB3aGlsZSAobmV3IERhdGUoKSAtIHN0YXJ0TXNlYyA8IHdhaXRNc2VjKTtcbiAgfVxuXG4gIF9yZXNldCgpIHtcbiAgICB0aGlzLmlvX3Jlcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuX2RlYWRTbGVlcCgxMCk7XG4gICAgdGhpcy5pb19yZXMub3V0cHV0KHRydWUpO1xuICAgIHRoaXMuX2RlYWRTbGVlcCgxMCk7XG4gIH1cblxuICB3cml0ZUNvbW1hbmQoY21kKSB7XG4gICAgdGhpcy5pb19kYy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KGZhbHNlKTtcbiAgICB0aGlzLnNwaS53cml0ZShbY21kXSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQodHJ1ZSk7XG4gIH1cblxuICB3cml0ZURhdGEoZGF0YSkge1xuICAgIHRoaXMuaW9fZGMub3V0cHV0KHRydWUpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KGZhbHNlKTtcbiAgICB0aGlzLnNwaS53cml0ZShkYXRhKTtcbiAgICB0aGlzLmlvX2NzLm91dHB1dCh0cnVlKTtcbiAgfVxuXG4gIHdyaXRlKGNtZCwgZGF0YSkge1xuICAgIGlmIChkYXRhLmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoY21kKTtcbiAgICB0aGlzLndyaXRlRGF0YShkYXRhKTtcbiAgfVxuXG4gIGFzeW5jIGFzeW5jd2FpdCgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5zcGkud3JpdGVXYWl0KFsweDAwXSk7XG4gIH1cblxuICBfd3JpdGVGbHVzaCgpIHtcbiAgICB3aGlsZSAodGhpcy53cml0ZUJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy53cml0ZUJ1ZmZlci5sZW5ndGggPiAxMDI0KSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy53cml0ZUJ1ZmZlci5zbGljZSgwLCAxMDI0KTtcbiAgICAgICAgdGhpcy53cml0ZURhdGEoZGF0YSk7XG4gICAgICAgIHRoaXMud3JpdGVCdWZmZXIuc3BsaWNlKDAsIDEwMjQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoID4gMCkgdGhpcy53cml0ZURhdGEodGhpcy53cml0ZUJ1ZmZlcik7XG4gICAgICAgIHRoaXMud3JpdGVCdWZmZXIgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfd3JpdGVCdWZmZXIoZGF0YSkge1xuICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy53cml0ZUJ1ZmZlciA9IHRoaXMud3JpdGVCdWZmZXIuY29uY2F0KGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93cml0ZUZsdXNoKCk7XG4gICAgfVxuICB9XG5cbiAgY29sb3IxNihyLCBnLCBiKSB7XG4gICAgLy8gIDFzdCBieXRlICAociAmIDB4RjggfCBnID4+IDUpXG4gICAgLy8gIDJuZCBieXRlICAoZyAmIDB4RkMgPDwgMyB8IGIgPj4gMylcbiAgICByZXR1cm4gKChyICYgMHhmOCkgPDwgOCkgfCAoKGcgJiAweGZjKSA8PCAzKSB8IChiID4+IDMpO1xuICB9XG5cbiAgY29tcGxlbWVudGFyeUNvbG9yMTYoY29sb3IpIHtcbiAgICBsZXQgciA9IChjb2xvciAmIDB4ZjgwMCkgPj4gODtcbiAgICBsZXQgZyA9IChjb2xvciAmIDB4N2UwKSA+PiAzO1xuICAgIGxldCBiID0gKGNvbG9yICYgMHgxZikgPDwgMztcbiAgICBsZXQgeCA9IE1hdGgubWF4KHIsIGcsIGIpICsgTWF0aC5taW4ociwgZywgYik7XG4gICAgcmV0dXJuIHRoaXMuY29sb3IxNih4IC0gciwgeCAtIGcsIHggLSBiKTtcbiAgfVxuXG4gIHJldmVyc2VDb2xvcjE2KGNvbG9yKSB7XG4gICAgbGV0IHIgPSAoY29sb3IgJiAweGY4MDApID4+IDg7XG4gICAgbGV0IGcgPSAoY29sb3IgJiAweDdlMCkgPj4gMztcbiAgICBsZXQgYiA9IChjb2xvciAmIDB4MWYpIDw8IDM7XG4gICAgbGV0IHggPSAweGZmO1xuICAgIHJldHVybiB0aGlzLmNvbG9yMTYoeCAtIHIsIHggLSBnLCB4IC0gYik7XG4gIH1cblxuICBfaW5pdEcoKSB7XG4gICAgLy8gaW5pdGlhbGl6ZSBkaXNwbGF5XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X1NXUkVTRVQpO1xuICAgIHRoaXMub2JuaXoud2FpdCgxNTApO1xuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9TTFBPVVQpOyAvL1NsZWVwIG91dCAmIGJvb3N0ZXIgb25cbiAgICB0aGlzLm9ibml6LndhaXQoNTAwKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9GUk1DVFIxLCBbMHgwMSwgMHgyYywgMHgyZF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0ZSTUNUUjIsIFsweDAxLCAweDJjLCAweDJkXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfRlJNQ1RSMywgWzB4MDEsIDB4MmMsIDB4MmQsIDB4MDEsIDB4MmMsIDB4MmRdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9JTlZDVFIsIFsweDA3XSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUFdDVFIxLCBbMHhhMiwgMHgwMiwgMHg4NF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1BXQ1RSMiwgWzB4YzVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9QV0NUUjMsIFsweDBhLCAweDAwXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUFdDVFI0LCBbMHg4YSwgMHgyYV0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1BXQ1RSNSwgWzB4OGEsIDB4ZWVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9WTUNUUjEsIFsweDBlXSk7XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X0lOVk9GRik7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfTUFEQ1RMLCBbMHhjOF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgWzB4MDVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DQVNFVCwgWzB4MDAsIDB4MDAsIDB4MDAsIDB4N2ZdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9SQVNFVCwgWzB4MDAsIDB4MDAsIDB4MDAsIDB4OWZdKTtcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfSU5WT04pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0dNQ1RSUDEsIFtcbiAgICAgIDB4MDIsXG4gICAgICAweDFjLFxuICAgICAgMHgwNyxcbiAgICAgIDB4MTIsXG4gICAgICAweDM3LFxuICAgICAgMHgzMixcbiAgICAgIDB4MjksXG4gICAgICAweDJkLFxuICAgICAgMHgyOSxcbiAgICAgIDB4MjUsXG4gICAgICAweDJiLFxuICAgICAgMHgzOSxcbiAgICAgIDB4MDAsXG4gICAgICAweDAxLFxuICAgICAgMHgwMyxcbiAgICAgIDB4MTAsXG4gICAgXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfR01DVFJOMSwgW1xuICAgICAgMHgwMyxcbiAgICAgIDB4MWQsXG4gICAgICAweDA3LFxuICAgICAgMHgwNixcbiAgICAgIDB4MmUsXG4gICAgICAweDJjLFxuICAgICAgMHgyOSxcbiAgICAgIDB4MmQsXG4gICAgICAweDJlLFxuICAgICAgMHgyZSxcbiAgICAgIDB4MzcsXG4gICAgICAweDNmLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweDAyLFxuICAgICAgMHgxMCxcbiAgICBdKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICB0aGlzLl9pbml0RygpO1xuICAgIHRoaXMuc2V0RGlzcGxheU9uKCk7XG4gICAgdGhpcy5zZXRSb3RhdGlvbigwKTtcbiAgfVxuXG4gIHNldERpc3BsYXlPbigpIHtcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfRElTUE9OKTtcbiAgfVxuXG4gIHNldERpc3BsYXlPZmYoKSB7XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X0RJU1BPRkYpO1xuICB9XG5cbiAgc2V0RGlzcGxheShvbikge1xuICAgIGlmIChvbiA9PSB0cnVlKSB0aGlzLnNldERpc3BsYXlPbigpO1xuICAgIGVsc2UgdGhpcy5zZXREaXNwbGF5T2ZmKCk7XG4gIH1cblxuICBzZXRJbnZlcnNpb25PbigpIHtcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfSU5WT04pO1xuICB9XG5cbiAgc2V0SW52ZXJzaW9uT2ZmKCkge1xuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9JTlZPRkYpO1xuICB9XG5cbiAgc2V0SW52ZXJzaW9uKGludmVyc2lvbikge1xuICAgIGlmIChpbnZlcnNpb24gPT0gdHJ1ZSkgdGhpcy5zZXRJbnZlcnNpb25PbigpO1xuICAgIGVsc2UgdGhpcy5zZXRJbnZlcnNpb25PZmYoKTtcbiAgfVxuXG4gIHNldFJvdGF0aW9uKG0pIHtcbiAgICBjb25zdCBNQURDVExfTVkgPSAweDgwO1xuICAgIGNvbnN0IE1BRENUTF9NWCA9IDB4NDA7XG4gICAgY29uc3QgTUFEQ1RMX01WID0gMHgyMDtcbiAgICAvLyBjb25zdCBNQURDVExfTUwgPSAweDEwO1xuICAgIGNvbnN0IE1BRENUTF9SR0IgPSAweDAwOyAvL2Fsd2F5cyBSR0IsIG5ldmVyIEJHUlxuICAgIC8vIGNvbnN0IE1BRENUTF9NSCA9IDB4MDQ7XG5cbiAgICBsZXQgZGF0YTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbSAlIDQ7IC8vIGNhbid0IGJlIGhpZ2hlciB0aGFuIDNcbiAgICBzd2l0Y2ggKHRoaXMucm90YXRpb24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGF0YSA9IFtNQURDVExfTVggfCBNQURDVExfTVkgfCBNQURDVExfUkdCXTtcbiAgICAgICAgdGhpcy53aWR0aCA9IFNUNzczNVNfVEZUV0lEVEg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gU1Q3NzM1U19URlRIRUlHSFQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBkYXRhID0gW01BRENUTF9NWSB8IE1BRENUTF9NViB8IE1BRENUTF9SR0JdO1xuICAgICAgICB0aGlzLndpZHRoID0gU1Q3NzM1U19URlRIRUlHSFQ7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gU1Q3NzM1U19URlRXSURUSDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGRhdGEgPSBbTUFEQ1RMX1JHQl07XG4gICAgICAgIHRoaXMud2lkdGggPSBTVDc3MzVTX1RGVFdJRFRIO1xuICAgICAgICB0aGlzLmhlaWdodCA9IFNUNzczNVNfVEZUSEVJR0hUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgZGF0YSA9IFtNQURDVExfTVggfCBNQURDVExfTVYgfCBNQURDVExfUkdCXTtcbiAgICAgICAgdGhpcy53aWR0aCA9IFNUNzczNVNfVEZUSEVJR0hUO1xuICAgICAgICB0aGlzLmhlaWdodCA9IFNUNzczNVNfVEZUV0lEVEg7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLndyaXRlKFNUNzczNV9NQURDVEwsIGRhdGEpO1xuICAgIHRoaXMuc2V0QWRkcldpbmRvdygwLCAwLCB0aGlzLndpZHRoIC0gMSwgdGhpcy5oZWlnaHQgLSAxKTtcbiAgfVxuXG4gIHNldEFkZHJXaW5kb3coeDAsIHkwLCB4MSwgeTEpIHtcbiAgICB0aGlzLnByaW50X2RlYnVnKFxuICAgICAgYHNldEFkZHJXaW5kb3c6ICh4MDogJHt4MH0sIHkwOiAke3kwfSkgLSAoeDE6ICR7eDF9LCB5MTogJHt5MX0pYFxuICAgICk7XG5cbiAgICBpZiAoeDAgPCAwKSB4MCA9IDA7XG4gICAgaWYgKHkwIDwgMCkgeTAgPSAwO1xuICAgIGlmICh4MSA8IDApIHgxID0gMDtcbiAgICBpZiAoeTEgPCAwKSB5MSA9IDA7XG5cbiAgICBpZiAodGhpcy5yb3RhdGlvbiA9PSAwIHx8IHRoaXMucm90YXRpb24gPT0gMikge1xuICAgICAgeDAgPSB4MCArIHRoaXMueF9vZmZzZXQ7XG4gICAgICB4MSA9IHgxICsgdGhpcy54X29mZnNldDtcbiAgICAgIHkwID0geTAgKyB0aGlzLnlfb2Zmc2V0O1xuICAgICAgeTEgPSB5MSArIHRoaXMueV9vZmZzZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHgwID0geDAgKyB0aGlzLnlfb2Zmc2V0O1xuICAgICAgeDEgPSB4MSArIHRoaXMueV9vZmZzZXQ7XG4gICAgICB5MCA9IHkwICsgdGhpcy54X29mZnNldDtcbiAgICAgIHkxID0geTEgKyB0aGlzLnhfb2Zmc2V0O1xuICAgIH1cblxuICAgIC8vIGNvbHVtbiBhZGRyIHNldFxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NBU0VULCBbMHgwMCwgeDAsIDB4MDAsIHgxXSk7IC8vIFhTVEFSVC1YRU5EXG4gICAgLy8gcm93IGFkZHIgc2V0XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUkFTRVQsIFsweDAwLCB5MCwgMHgwMCwgeTFdKTsgLy8gWVNUQVJULVlFTkRcbiAgICAvLyB3cml0ZSB0byBSQU1cbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfUkFNV1IpO1xuICAgIHRoaXMud3JpdGVCdWZmZXIgPSBbXTtcbiAgfVxuXG4gIC8vX19zd2FwKGEsIGIpIHsgbGV0IHQgPSBhOyBhID0gYjsgYiA9IHQ7IH1cblxuICBmaWxsU2NyZWVuKGNvbG9yKSB7XG4gICAgdGhpcy5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgY29sb3IpO1xuICB9XG5cbiAgX2NvbG9yMnBpeGVscyh3LCBoLCBjb2xvcikge1xuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBBcnJheShNYXRoLmFicyh3ICogaCkpKS5tYXAoKHYsIGkpID0+IGNvbG9yKTtcbiAgfVxuXG4gIGZpbGxSZWN0KHgsIHksIHcsIGgsIGNvbG9yKSB7XG4gICAgaWYgKHggPj0gdGhpcy53aWR0aCB8fCB5ID49IHRoaXMuaGVpZ2h0KSByZXR1cm47XG4gICAgaWYgKHggKyB3IC0gMSA+PSB0aGlzLndpZHRoKSB3ID0gdGhpcy53aWR0aCAtIHg7XG4gICAgaWYgKHkgKyBoIC0gMSA+PSB0aGlzLmhlaWdodCkgaCA9IHRoaXMuaGVpZ2h0IC0geTtcbiAgICBsZXQgcGl4ZWxzID0gdGhpcy5fY29sb3IycGl4ZWxzKHcsIGgsIGNvbG9yKTtcbiAgICB0aGlzLnJhd0JvdW5kMTYoeCwgeSwgdywgaCwgcGl4ZWxzLCB0cnVlKTtcbiAgfVxuXG4gIGRyYXdSZWN0KHgsIHksIHcsIGgsIGNvbG9yKSB7XG4gICAgdGhpcy5kcmF3SExpbmUoeCwgeSwgdywgY29sb3IpO1xuICAgIHRoaXMuZHJhd0hMaW5lKHgsIHkgKyBoIC0gMSwgdywgY29sb3IpO1xuICAgIHRoaXMuZHJhd1ZMaW5lKHgsIHksIGgsIGNvbG9yKTtcbiAgICB0aGlzLmRyYXdWTGluZSh4ICsgdyAtIDEsIHksIGgsIGNvbG9yKTtcbiAgfVxuXG4gIGRyYXdDaXJjbGUoeDAsIHkwLCByLCBjb2xvcikge1xuICAgIGxldCBmID0gMSAtIHI7XG4gICAgbGV0IGRkRl94ID0gMTtcbiAgICBsZXQgZGRGX3kgPSAtMiAqIHI7XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gcjtcblxuICAgIHRoaXMuZHJhd1BpeGVsKHgwLCB5MCArIHIsIGNvbG9yKTtcbiAgICB0aGlzLmRyYXdQaXhlbCh4MCwgeTAgLSByLCBjb2xvcik7XG4gICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyByLCB5MCwgY29sb3IpO1xuICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0gciwgeTAsIGNvbG9yKTtcblxuICAgIHdoaWxlICh4IDwgeSkge1xuICAgICAgaWYgKGYgPj0gMCkge1xuICAgICAgICB5LS07XG4gICAgICAgIGRkRl95ICs9IDI7XG4gICAgICAgIGYgKz0gZGRGX3k7XG4gICAgICB9XG4gICAgICB4Kys7XG4gICAgICBkZEZfeCArPSAyO1xuICAgICAgZiArPSBkZEZfeDtcblxuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB4LCB5MCArIHksIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geCwgeTAgKyB5LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHgsIHkwIC0geSwgY29sb3IpO1xuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgLSB4LCB5MCAtIHksIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeSwgeTAgKyB4LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHksIHkwICsgeCwgY29sb3IpO1xuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB5LCB5MCAtIHgsIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geSwgeTAgLSB4LCBjb2xvcik7XG4gICAgfVxuICB9XG5cbiAgX2RyYXdDaXJjbGVIZWxwZXIoeDAsIHkwLCByLCBjb3JuZXJuYW1lLCBjb2xvcikge1xuICAgIGxldCBmID0gMSAtIHI7XG4gICAgbGV0IGRkRl94ID0gMTtcbiAgICBsZXQgZGRGX3kgPSAtMiAqIHI7XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gcjtcblxuICAgIHdoaWxlICh4IDwgeSkge1xuICAgICAgaWYgKGYgPj0gMCkge1xuICAgICAgICB5LS07XG4gICAgICAgIGRkRl95ICs9IDI7XG4gICAgICAgIGYgKz0gZGRGX3k7XG4gICAgICB9XG4gICAgICB4Kys7XG4gICAgICBkZEZfeCArPSAyO1xuICAgICAgZiArPSBkZEZfeDtcbiAgICAgIGlmIChjb3JuZXJuYW1lICYgMHg0KSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeCwgeTAgKyB5LCBjb2xvcik7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeSwgeTAgKyB4LCBjb2xvcik7XG4gICAgICB9XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4Mikge1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHgsIHkwIC0geSwgY29sb3IpO1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHksIHkwIC0geCwgY29sb3IpO1xuICAgICAgfVxuICAgICAgaWYgKGNvcm5lcm5hbWUgJiAweDgpIHtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgLSB5LCB5MCArIHgsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgLSB4LCB5MCArIHksIGNvbG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb3JuZXJuYW1lICYgMHgxKSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geSwgeTAgLSB4LCBjb2xvcik7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geCwgeTAgLSB5LCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmlsbENpcmNsZSh4MCwgeTAsIHIsIGNvbG9yKSB7XG4gICAgdGhpcy5kcmF3VkxpbmUoeDAsIHkwIC0gciwgMiAqIHIgKyAxLCBjb2xvcik7XG4gICAgdGhpcy5fZmlsbENpcmNsZUhlbHBlcih4MCwgeTAsIHIsIDMsIDAsIGNvbG9yKTtcbiAgfVxuXG4gIF9maWxsQ2lyY2xlSGVscGVyKHgwLCB5MCwgciwgY29ybmVybmFtZSwgZGVsdGEsIGNvbG9yKSB7XG4gICAgbGV0IGYgPSAxIC0gcjtcbiAgICBsZXQgZGRGX3ggPSAxO1xuICAgIGxldCBkZEZfeSA9IC0yICogcjtcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSByO1xuXG4gICAgd2hpbGUgKHggPCB5KSB7XG4gICAgICBpZiAoZiA+PSAwKSB7XG4gICAgICAgIHktLTtcbiAgICAgICAgZGRGX3kgKz0gMjtcbiAgICAgICAgZiArPSBkZEZfeTtcbiAgICAgIH1cbiAgICAgIHgrKztcbiAgICAgIGRkRl94ICs9IDI7XG4gICAgICBmICs9IGRkRl94O1xuXG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4MSkge1xuICAgICAgICB0aGlzLmRyYXdWTGluZSh4MCArIHgsIHkwIC0geSwgMiAqIHkgKyAxICsgZGVsdGEsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3VkxpbmUoeDAgKyB5LCB5MCAtIHgsIDIgKiB4ICsgMSArIGRlbHRhLCBjb2xvcik7XG4gICAgICB9XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4Mikge1xuICAgICAgICB0aGlzLmRyYXdWTGluZSh4MCAtIHgsIHkwIC0geSwgMiAqIHkgKyAxICsgZGVsdGEsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3VkxpbmUoeDAgLSB5LCB5MCAtIHgsIDIgKiB4ICsgMSArIGRlbHRhLCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZHJhd1JvdW5kUmVjdCh4LCB5LCB3LCBoLCByLCBjb2xvcikge1xuICAgIHRoaXMuZHJhd0hMaW5lKHggKyByLCB5LCB3IC0gMiAqIHIsIGNvbG9yKTsgLy8gVG9wXG4gICAgdGhpcy5kcmF3SExpbmUoeCArIHIsIHkgKyBoIC0gMSwgdyAtIDIgKiByLCBjb2xvcik7IC8vIEJvdHRvbVxuICAgIHRoaXMuZHJhd1ZMaW5lKHgsIHkgKyByLCBoIC0gMiAqIHIsIGNvbG9yKTsgLy8gTGVmdFxuICAgIHRoaXMuZHJhd1ZMaW5lKHggKyB3IC0gMSwgeSArIHIsIGggLSAyICogciwgY29sb3IpOyAvLyBSaWdodFxuXG4gICAgdGhpcy5fZHJhd0NpcmNsZUhlbHBlcih4ICsgciwgeSArIHIsIHIsIDEsIGNvbG9yKTtcbiAgICB0aGlzLl9kcmF3Q2lyY2xlSGVscGVyKHggKyB3IC0gciAtIDEsIHkgKyByLCByLCAyLCBjb2xvcik7XG4gICAgdGhpcy5fZHJhd0NpcmNsZUhlbHBlcih4ICsgdyAtIHIgLSAxLCB5ICsgaCAtIHIgLSAxLCByLCA0LCBjb2xvcik7XG4gICAgdGhpcy5fZHJhd0NpcmNsZUhlbHBlcih4ICsgciwgeSArIGggLSByIC0gMSwgciwgOCwgY29sb3IpO1xuICB9XG5cbiAgZmlsbFJvdW5kUmVjdCh4LCB5LCB3LCBoLCByLCBjb2xvcikge1xuICAgIHRoaXMuZmlsbFJlY3QoeCArIHIsIHksIHcgLSAyICogciwgaCwgY29sb3IpO1xuXG4gICAgdGhpcy5fZmlsbENpcmNsZUhlbHBlcih4ICsgdyAtIHIgLSAxLCB5ICsgciwgciwgMSwgaCAtIDIgKiByIC0gMSwgY29sb3IpO1xuICAgIHRoaXMuX2ZpbGxDaXJjbGVIZWxwZXIoeCArIHIsIHkgKyByLCByLCAyLCBoIC0gMiAqIHIgLSAxLCBjb2xvcik7XG4gIH1cblxuICBkcmF3VHJpYW5nbGUoeDAsIHkwLCB4MSwgeTEsIHgyLCB5MiwgY29sb3IpIHtcbiAgICB0aGlzLmRyYXdMaW5lKHgwLCB5MCwgeDEsIHkxLCBjb2xvcik7XG4gICAgdGhpcy5kcmF3TGluZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IpO1xuICAgIHRoaXMuZHJhd0xpbmUoeDIsIHkyLCB4MCwgeTAsIGNvbG9yKTtcbiAgfVxuXG4gIGZpbGxUcmlhbmdsZSh4MCwgeTAsIHgxLCB5MSwgeDIsIHkyLCBjb2xvcikge1xuICAgIGxldCBhLCBiLCB5LCBsYXN0O1xuXG4gICAgLy8gU29ydCBjb29yZGluYXRlcyBieSBZIG9yZGVyICh5MiA+PSB5MSA+PSB5MClcbiAgICBpZiAoeTAgPiB5MSkge1xuICAgICAgeTEgPSBbeTAsICh5MCA9IHkxKV1bMF07IC8vdGhpcy5fc3dhcCh5MCwgeTEpO1xuICAgICAgeDEgPSBbeDAsICh4MCA9IHgxKV1bMF07IC8vdGhpcy5fc3dhcCh4MCwgeDEpO1xuICAgIH1cbiAgICBpZiAoeTEgPiB5Mikge1xuICAgICAgeTIgPSBbeTEsICh5MSA9IHkyKV1bMF07IC8vdGhpcy5fc3dhcCh5MiwgeTEpO1xuICAgICAgeDIgPSBbeDEsICh4MSA9IHgyKV1bMF07IC8vdGhpcy5fc3dhcCh4MiwgeDEpO1xuICAgIH1cbiAgICBpZiAoeTAgPiB5MSkge1xuICAgICAgeTEgPSBbeTAsICh5MCA9IHkxKV1bMF07IC8vdGhpcy5fc3dhcCh5MCwgeTEpO1xuICAgICAgeDEgPSBbeDAsICh4MCA9IHgxKV1bMF07IC8vdGhpcy5fc3dhcCh4MCwgeDEpO1xuICAgIH1cblxuICAgIGlmICh5MCA9PSB5Mikge1xuICAgICAgLy8gSGFuZGxlIGF3a3dhcmQgYWxsLW9uLXNhbWUtbGluZSBjYXNlIGFzIGl0cyBvd24gdGhpbmdcbiAgICAgIGEgPSBiID0geDA7XG4gICAgICBpZiAoeDEgPCBhKSBhID0geDE7XG4gICAgICBlbHNlIGlmICh4MSA+IGIpIGIgPSB4MTtcbiAgICAgIGlmICh4MiA8IGEpIGEgPSB4MjtcbiAgICAgIGVsc2UgaWYgKHgyID4gYikgYiA9IHgyO1xuICAgICAgdGhpcy5kcmF3SExpbmUoYSwgeTAsIGIgLSBhICsgMSwgY29sb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBkeDAxID0geDEgLSB4MCxcbiAgICAgIGR5MDEgPSB5MSAtIHkwLFxuICAgICAgZHgwMiA9IHgyIC0geDAsXG4gICAgICBkeTAyID0geTIgLSB5MCxcbiAgICAgIGR4MTIgPSB4MiAtIHgxLFxuICAgICAgZHkxMiA9IHkyIC0geTEsXG4gICAgICBzYSA9IDAsXG4gICAgICBzYiA9IDA7XG5cbiAgICBpZiAoeTEgPT0geTIpIGxhc3QgPSB5MTtcbiAgICAvLyBpbmNsdWRlIHkxIHNjYW5saW5lXG4gICAgZWxzZSBsYXN0ID0geTEgLSAxOyAvLyBza2lwIGl0XG5cbiAgICBmb3IgKHkgPSB5MDsgeSA8PSBsYXN0OyB5KyspIHtcbiAgICAgIGEgPSB4MCArIE1hdGguZmxvb3Ioc2EgLyBkeTAxKTtcbiAgICAgIGIgPSB4MCArIE1hdGguZmxvb3Ioc2IgLyBkeTAyKTtcbiAgICAgIHNhICs9IGR4MDE7XG4gICAgICBzYiArPSBkeDAyO1xuICAgICAgaWYgKGEgPiBiKSBiID0gW2EsIChhID0gYildWzBdOyAvL3RoaXMuX3N3YXAoYSxiKTtcbiAgICAgIHRoaXMuZHJhd0hMaW5lKGEsIHksIGIgLSBhICsgMSwgY29sb3IpO1xuICAgIH1cblxuICAgIHNhID0gZHgxMiAqICh5IC0geTEpO1xuICAgIHNiID0gZHgwMiAqICh5IC0geTApO1xuICAgIGZvciAoOyB5IDw9IHkyOyB5KyspIHtcbiAgICAgIGEgPSB4MSArIE1hdGguZmxvb3Ioc2EgLyBkeTEyKTtcbiAgICAgIGIgPSB4MCArIE1hdGguZmxvb3Ioc2IgLyBkeTAyKTtcbiAgICAgIHNhICs9IGR4MTI7XG4gICAgICBzYiArPSBkeDAyO1xuICAgICAgaWYgKGEgPiBiKSBiID0gW2EsIChhID0gYildWzBdOyAvL3RoaXMuX3N3YXAoYSxiKTtcbiAgICAgIHRoaXMuZHJhd0hMaW5lKGEsIHksIGIgLSBhICsgMSwgY29sb3IpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdWTGluZSh4LCB5LCBoLCBjb2xvcikge1xuICAgIGlmIChoIDwgMCkge1xuICAgICAgaCA9IC1oO1xuICAgICAgeSA9IHkgLSBoO1xuICAgIH1cbiAgICBpZiAoeCA+PSB0aGlzLndpZHRoIHx8IHkgPj0gdGhpcy5oZWlnaHQpIHJldHVybjtcbiAgICBpZiAoeSArIGggLSAxID49IHRoaXMuaGVpZ2h0KSBoID0gdGhpcy5oZWlnaHQgLSB5O1xuICAgIGxldCBwaXhlbHMgPSB0aGlzLl9jb2xvcjJwaXhlbHMoMSwgaCwgY29sb3IpO1xuICAgIHRoaXMucmF3Qm91bmQxNih4LCB5LCAxLCBoLCBwaXhlbHMsIGZhbHNlKTtcbiAgfVxuXG4gIGRyYXdITGluZSh4LCB5LCB3LCBjb2xvcikge1xuICAgIGlmICh3IDwgMCkge1xuICAgICAgdyA9IC13O1xuICAgICAgeCA9IHggLSB3O1xuICAgIH1cbiAgICBpZiAoeCA+PSB0aGlzLndpZHRoIHx8IHkgPj0gdGhpcy5oZWlnaHQpIHJldHVybjtcbiAgICBpZiAoeCArIHcgLSAxID49IHRoaXMud2lkdGgpIHcgPSB0aGlzLndpZHRoIC0geDtcbiAgICBsZXQgcGl4ZWxzID0gdGhpcy5fY29sb3IycGl4ZWxzKHcsIDEsIGNvbG9yKTtcbiAgICB0aGlzLnJhd0JvdW5kMTYoeCwgeSwgdywgMSwgcGl4ZWxzLCBmYWxzZSk7XG4gIH1cblxuICBkcmF3TGluZSh4MCwgeTAsIHgxLCB5MSwgY29sb3IpIHtcbiAgICBpZiAoeDAgPT0geDEpIHtcbiAgICAgIHRoaXMuZHJhd1ZMaW5lKHgwLCB5MCwgeTEgLSB5MCwgY29sb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoeTAgPT0geTEpIHtcbiAgICAgIHRoaXMuZHJhd0hMaW5lKHgwLCB5MCwgeDEgLSB4MCwgY29sb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzdGVwID0gTWF0aC5hYnMoeTEgLSB5MCkgPiBNYXRoLmFicyh4MSAtIHgwKTtcbiAgICBpZiAoc3RlcCkge1xuICAgICAgeTAgPSBbeDAsICh4MCA9IHkwKV1bMF07IC8vdGhpcy5fc3dhcCh4MCwgeTApO1xuICAgICAgeTEgPSBbeDEsICh4MSA9IHkxKV1bMF07IC8vdGhpcy5fc3dhcCh4MSwgeTEpO1xuICAgIH1cbiAgICBpZiAoeDAgPiB4MSkge1xuICAgICAgeDEgPSBbeDAsICh4MCA9IHgxKV1bMF07IC8vdGhpcy5fc3dhcCh4MCwgeDEpO1xuICAgICAgeTEgPSBbeTAsICh5MCA9IHkxKV1bMF07IC8vdGhpcy5fc3dhcCh5MCwgeTEpO1xuICAgIH1cblxuICAgIGxldCBkeCA9IHgxIC0geDA7XG4gICAgbGV0IGR5ID0gTWF0aC5hYnMoeTEgLSB5MCk7XG5cbiAgICBsZXQgZXJyID0gZHggLyAyO1xuICAgIGxldCB5c3RlcCA9IHkwIDwgeTEgPyAxIDogLTE7XG5cbiAgICBmb3IgKDsgeDAgPD0geDE7IHgwKyspIHtcbiAgICAgIGlmIChzdGVwKSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHkwLCB4MCwgY29sb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAsIHkwLCBjb2xvcik7XG4gICAgICB9XG4gICAgICBlcnIgLT0gZHk7XG4gICAgICBpZiAoZXJyIDwgMCkge1xuICAgICAgICB5MCArPSB5c3RlcDtcbiAgICAgICAgZXJyICs9IGR4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRyYXdQaXhlbCh4LCB5LCBjb2xvcikge1xuICAgIGlmICh4IDwgMCB8fCB4ID49IHRoaXMud2lkdGggfHwgeSA8IDAgfHwgeSA+PSB0aGlzLmhlaWdodCkgcmV0dXJuO1xuICAgIHRoaXMucmF3Qm91bmQxNih4LCB5LCAxLCAxLCBbY29sb3JdLCBmYWxzZSk7XG4gIH1cblxuICBkcmF3Q2hhcih4LCB5LCBjaCwgY29sb3IsIGJnLCBzaXplKSB7XG4gICAgLy8gIGJnID0gYmcgfHwgY29sb3I7XG4gICAgc2l6ZSA9IHNpemUgfHwgMTtcbiAgICBpZiAoXG4gICAgICB4ID49IHRoaXMud2lkdGggfHwgLy8gQ2xpcCByaWdodFxuICAgICAgeSA+PSB0aGlzLmhlaWdodCB8fCAvLyBDbGlwIGJvdHRvbVxuICAgICAgeCArIDYgKiBzaXplIC0gMSA8IDAgfHwgLy8gQ2xpcCBsZWZ0XG4gICAgICB5ICsgOCAqIHNpemUgLSAxIDwgMFxuICAgIClcbiAgICAgIC8vIENsaXAgdG9wXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAoY29sb3IgIT0gYmcpIHtcbiAgICAgIHRoaXMuZHJhd0NoYXIyKHgsIHksIGNoLCBjb2xvciwgYmcsIHNpemUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjID0gY2guY2hhckNvZGVBdCgwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgbGV0IGxpbmUgPSBpID09IDUgPyAwIDogZm9udFtjICogNSArIGldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA4OyBqKyspIHtcbiAgICAgICAgaWYgKGxpbmUgJiAweDEpIHtcbiAgICAgICAgICBpZiAoc2l6ZSA9PSAxKVxuICAgICAgICAgICAgLy8gZGVmYXVsdCBzaXplXG4gICAgICAgICAgICB0aGlzLmRyYXdQaXhlbCh4ICsgaSwgeSArIGosIGNvbG9yKTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJpZyBzaXplXG4gICAgICAgICAgICB0aGlzLmZpbGxSZWN0KHggKyBpICogc2l6ZSwgeSArIGogKiBzaXplLCBzaXplLCBzaXplLCBjb2xvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGJnICE9IGNvbG9yKSB7XG4gICAgICAgICAgaWYgKHNpemUgPT0gMSlcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgc2l6ZVxuICAgICAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeCArIGksIHkgKyBqLCBiZyk7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBiaWcgc2l6ZVxuICAgICAgICAgICAgdGhpcy5maWxsUmVjdCh4ICsgaSAqIHNpemUsIHkgKyBqICogc2l6ZSwgc2l6ZSwgc2l6ZSwgYmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsaW5lID4+PSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRyYXdDaGFyMih4LCB5LCBjaCwgY29sb3IsIGJnLCBzaXplKSB7XG4gICAgLy8gIGJnID0gYmcgfHwgY29sb3I7XG4gICAgc2l6ZSA9IHNpemUgfHwgMTtcbiAgICBpZiAoXG4gICAgICB4ID49IHRoaXMud2lkdGggfHwgLy8gQ2xpcCByaWdodFxuICAgICAgeSA+PSB0aGlzLmhlaWdodCB8fCAvLyBDbGlwIGJvdHRvbVxuICAgICAgeCArIDYgKiBzaXplIC0gMSA8IDAgfHwgLy8gQ2xpcCBsZWZ0XG4gICAgICB5ICsgOCAqIHNpemUgLSAxIDwgMCAvLyBDbGlwIHRvcFxuICAgIClcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBwaXhlbHMgPSBuZXcgQXJyYXkoNiAqIDggKiBzaXplICogc2l6ZSk7XG4gICAgbGV0IGMgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICBsZXQgbGluZSA9IGkgPT0gNSA/IDAgOiBmb250W2MgKiA1ICsgaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDg7IGorKykge1xuICAgICAgICBsZXQgY2wgPSBsaW5lICYgMHgxID8gY29sb3IgOiBiZztcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBzaXplOyB3KyspIHtcbiAgICAgICAgICBmb3IgKGxldCBoID0gMDsgaCA8IHNpemU7IGgrKykge1xuICAgICAgICAgICAgcGl4ZWxzW1xuICAgICAgICAgICAgICBpICogKDEgKiBzaXplKSArIHcgKyAoaiAqICg2ICogc2l6ZSAqIHNpemUpICsgaCAqICg2ICogc2l6ZSkpXG4gICAgICAgICAgICBdID0gY2w7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxpbmUgPj49IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmF3Qm91bmQxNih4LCB5LCA2ICogc2l6ZSwgOCAqIHNpemUsIHBpeGVscyk7XG4gIH1cblxuICByYXdCb3VuZDE2KHgsIHksIHdpZHRoLCBoZWlnaHQsIHBpeGVscywgZmx1c2gpIHtcbiAgICBsZXQgcmdiID0gW107XG4gICAgcGl4ZWxzLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgICAgbGV0IHYyID0gKCh2ICYgMHhmODAwKSA+PiAxMSkgfCAodiAmIDB4N2UwKSB8ICgodiAmIDB4MWYpIDw8IDExKTtcbiAgICAgIHJnYi5wdXNoKCh2MiAmIDB4ZmYwMCkgPj4gOCk7XG4gICAgICByZ2IucHVzaCh2MiAmIDB4ZmYpO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0QWRkcldpbmRvdyh4LCB5LCB4ICsgd2lkdGggLSAxLCB5ICsgaGVpZ2h0IC0gMSk7XG4gICAgaWYgKGZsdXNoKSB7XG4gICAgICB0aGlzLl93cml0ZUJ1ZmZlcihyZ2IpO1xuICAgICAgdGhpcy5fd3JpdGVCdWZmZXIoKTsgLy9mb3IgZmx1c2hcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53cml0ZURhdGEocmdiKTtcbiAgICB9XG4gIH1cblxuICBkcmF3U3RyaW5nKHgsIHksIHN0ciwgY29sb3IsIGJnLCBzaXplLCB3cmFwKSB7XG4gICAgLy8gIGJnID0gYmcgfHwgY29sb3I7XG4gICAgc2l6ZSA9IHNpemUgfHwgMTtcbiAgICAvLyAgd3JhcCA9IHdyYXAgfHwgdHJ1ZTtcbiAgICBmb3IgKGxldCBuID0gMDsgbiA8IHN0ci5sZW5ndGg7IG4rKykge1xuICAgICAgbGV0IGMgPSBzdHIuY2hhckF0KG4pO1xuICAgICAgaWYgKGMgPT0gJ1xcbicpIHtcbiAgICAgICAgeSArPSBzaXplICogODtcbiAgICAgICAgeCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGMgPT0gJ1xccicpIHtcbiAgICAgICAgLy8gc2tpcCBlbVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmF3Q2hhcih4LCB5LCBjLCBjb2xvciwgYmcsIHNpemUpO1xuICAgICAgICB4ICs9IHNpemUgKiA2O1xuICAgICAgICBpZiAod3JhcCAmJiB4ID4gdGhpcy53aWR0aCAtIHNpemUgKiA2KSB7XG4gICAgICAgICAgeSArPSBzaXplICogODtcbiAgICAgICAgICB4ID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW3gsIHldO1xuICB9XG5cbiAgZHJhd0NvbnRleHRCb3VuZChjb250ZXh0LCB4MCwgeTAsIHdpZHRoLCBoZWlnaHQsIHgxLCB5MSwgZ3JheSkge1xuICAgIHgwID0geDAgfHwgMDtcbiAgICB5MCA9IHkwIHx8IDA7XG4gICAgd2lkdGggPSB3aWR0aCB8fCBjb250ZXh0LmNhbnZhcy5jbGllbnRXaWR0aDtcbiAgICBoZWlnaHQgPSBoZWlnaHQgfHwgY29udGV4dC5jYW52YXMuY2xpZW50SGVpZ2h0O1xuICAgIHgxID0geDEgfHwgMDtcbiAgICB5MSA9IHkxIHx8IDA7XG4gICAgZ3JheSA9IGdyYXkgfHwgZmFsc2U7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfQ09MTU9ELCBbU1Q3NzM1XzE4Yml0XSk7IC8vMThiaXQvcGl4ZWxcbiAgICBsZXQgaW1hZ2VEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoeDAsIHkwLCB3aWR0aCwgaGVpZ2h0KS5kYXRhO1xuICAgIGxldCByZ2IgPSBbXTtcbiAgICBmb3IgKGxldCBuID0gMDsgbiA8IGltYWdlRGF0YS5sZW5ndGg7IG4gKz0gNCkge1xuICAgICAgbGV0IHIgPSBpbWFnZURhdGFbbiArIDBdO1xuICAgICAgbGV0IGcgPSBpbWFnZURhdGFbbiArIDFdO1xuICAgICAgbGV0IGIgPSBpbWFnZURhdGFbbiArIDJdO1xuICAgICAgaWYgKCFncmF5KSB7XG4gICAgICAgIHJnYi5wdXNoKGIpO1xuICAgICAgICByZ2IucHVzaChnKTtcbiAgICAgICAgcmdiLnB1c2gocik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZ3MgPSBNYXRoLnJvdW5kKDAuMjk5ICogciArIDAuNTg3ICogZyArIDAuMTE0ICogYik7XG4gICAgICAgIHJnYi5wdXNoKGdzKTtcbiAgICAgICAgcmdiLnB1c2goZ3MpO1xuICAgICAgICByZ2IucHVzaChncyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xOGJpdF0pOyAvLzE4Yml0L3BpeGVsXG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgxLCB5MSwgeDEgKyB3aWR0aCAtIDEsIHkxICsgaGVpZ2h0IC0gMSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIocmdiKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcigpOyAvL2ZvciBmbHVzaFxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xNmJpdF0pOyAvLzE2Yml0L3BpeGVsXG4gIH1cblxuICBkcmF3Q29udGV4dChjb250ZXh0LCBncmF5KSB7XG4gICAgZ3JheSA9IGdyYXkgfHwgZmFsc2U7XG4gICAgdGhpcy5kcmF3Q29udGV4dEJvdW5kKGNvbnRleHQsIDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCAwLCAwLCBncmF5KTtcbiAgfVxuXG4gIGRyYXcoY29udGV4dCwgZ3JheSkge1xuICAgIHRoaXMuZHJhd0NvbnRleHQoY29udGV4dCwgZ3JheSk7XG4gIH1cblxuICByYXdCb3VuZCh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwaXhlbHMpIHtcbiAgICBsZXQgcmdiID0gW107XG4gICAgcGl4ZWxzLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgICAgcmdiLnB1c2godiAmIDB4ZmYpO1xuICAgICAgcmdiLnB1c2goKHYgJiAweGZmMDApID4+IDgpO1xuICAgICAgcmdiLnB1c2goKHYgJiAweGZmMDAwMCkgPj4gMTYpO1xuICAgIH0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xOGJpdF0pOyAvLzE4Yml0L3BpeGVsXG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgsIHksIHggKyB3aWR0aCAtIDEsIHkgKyBoZWlnaHQgLSAxKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcihyZ2IpO1xuICAgIHRoaXMuX3dyaXRlQnVmZmVyKCk7IC8vZm9yIGZsdXNoXG4gICAgdGhpcy53cml0ZShTVDc3MzVfQ09MTU9ELCBbU1Q3NzM1XzE2Yml0XSk7IC8vMTZiaXQvcGl4ZWxcbiAgfVxuXG4gIHJhdyhwaXhlbHMpIHtcbiAgICB0aGlzLnJhd0JvdW5kMTYoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHBpeGVscywgdHJ1ZSk7XG4gIH1cblxuICBfc2V0UHJlc2V0Q29sb3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IHtcbiAgICAgIEFsaWNlQmx1ZTogMHhmN2RmLFxuICAgICAgQW50aXF1ZVdoaXRlOiAweGZmNWEsXG4gICAgICBBcXVhOiAweDA3ZmYsXG4gICAgICBBcXVhbWFyaW5lOiAweDdmZmEsXG4gICAgICBBenVyZTogMHhmN2ZmLFxuICAgICAgQmVpZ2U6IDB4ZjdiYixcbiAgICAgIEJpc3F1ZTogMHhmZjM4LFxuICAgICAgQmxhY2s6IDB4MDAwMCxcbiAgICAgIEJsYW5jaGVkQWxtb25kOiAweGZmNTksXG4gICAgICBCbHVlOiAweDAwMWYsXG4gICAgICBCbHVlVmlvbGV0OiAweDg5NWMsXG4gICAgICBCcm93bjogMHhhMTQ1LFxuICAgICAgQnVybHlXb29kOiAweGRkZDAsXG4gICAgICBDYWRldEJsdWU6IDB4NWNmNCxcbiAgICAgIENoYXJ0cmV1c2U6IDB4N2ZlMCxcbiAgICAgIENob2NvbGF0ZTogMHhkMzQzLFxuICAgICAgQ29yYWw6IDB4ZmJlYSxcbiAgICAgIENvcm5mbG93ZXJCbHVlOiAweDY0YmQsXG4gICAgICBDb3Juc2lsazogMHhmZmRiLFxuICAgICAgQ3JpbXNvbjogMHhkOGE3LFxuICAgICAgQ3lhbjogMHgwN2ZmLFxuICAgICAgRGFya0JsdWU6IDB4MDAxMSxcbiAgICAgIERhcmtDeWFuOiAweDA0NTEsXG4gICAgICBEYXJrR29sZGVuUm9kOiAweGJjMjEsXG4gICAgICBEYXJrR3JheTogMHhhZDU1LFxuICAgICAgRGFya0dyZWVuOiAweDAzMjAsXG4gICAgICBEYXJrS2hha2k6IDB4YmRhZCxcbiAgICAgIERhcmtNYWdlbnRhOiAweDg4MTEsXG4gICAgICBEYXJrT2xpdmVHcmVlbjogMHg1MzQ1LFxuICAgICAgRGFya09yYW5nZTogMHhmYzYwLFxuICAgICAgRGFya09yY2hpZDogMHg5OTk5LFxuICAgICAgRGFya1JlZDogMHg4ODAwLFxuICAgICAgRGFya1NhbG1vbjogMHhlY2FmLFxuICAgICAgRGFya1NlYUdyZWVuOiAweDhkZjEsXG4gICAgICBEYXJrU2xhdGVCbHVlOiAweDQ5ZjEsXG4gICAgICBEYXJrU2xhdGVHcmF5OiAweDJhNjksXG4gICAgICBEYXJrVHVycXVvaXNlOiAweDA2N2EsXG4gICAgICBEYXJrVmlvbGV0OiAweDkwMWEsXG4gICAgICBEZWVwUGluazogMHhmOGIyLFxuICAgICAgRGVlcFNreUJsdWU6IDB4MDVmZixcbiAgICAgIERpbUdyYXk6IDB4NmI0ZCxcbiAgICAgIERvZGdlckJsdWU6IDB4MWM5ZixcbiAgICAgIEZpcmVCcmljazogMHhiMTA0LFxuICAgICAgRmxvcmFsV2hpdGU6IDB4ZmZkZSxcbiAgICAgIEZvcmVzdEdyZWVuOiAweDI0NDQsXG4gICAgICBGdWNoc2lhOiAweGY4MWYsXG4gICAgICBHYWluc2Jvcm86IDB4ZGVmYixcbiAgICAgIEdob3N0V2hpdGU6IDB4ZmZkZixcbiAgICAgIEdvbGQ6IDB4ZmVhMCxcbiAgICAgIEdvbGRlblJvZDogMHhkZDI0LFxuICAgICAgR3JheTogMHg4NDEwLFxuICAgICAgR3JlZW46IDB4MDQwMCxcbiAgICAgIEdyZWVuWWVsbG93OiAweGFmZTUsXG4gICAgICBIb25leURldzogMHhmN2ZlLFxuICAgICAgSG90UGluazogMHhmYjU2LFxuICAgICAgSW5kaWFuUmVkOiAweGNhZWIsXG4gICAgICBJbmRpZ286IDB4NDgxMCxcbiAgICAgIEl2b3J5OiAweGZmZmUsXG4gICAgICBLaGFraTogMHhmNzMxLFxuICAgICAgTGF2ZW5kZXI6IDB4ZTczZixcbiAgICAgIExhdmVuZGVyQmx1c2g6IDB4ZmY5ZSxcbiAgICAgIExhd25HcmVlbjogMHg3ZmUwLFxuICAgICAgTGVtb25DaGlmZm9uOiAweGZmZDksXG4gICAgICBMaWdodEJsdWU6IDB4YWVkYyxcbiAgICAgIExpZ2h0Q29yYWw6IDB4ZjQxMCxcbiAgICAgIExpZ2h0Q3lhbjogMHhlN2ZmLFxuICAgICAgTGlnaHRHb2xkZW5Sb2RZZWxsb3c6IDB4ZmZkYSxcbiAgICAgIExpZ2h0R3JheTogMHhkNjlhLFxuICAgICAgTGlnaHRHcmVlbjogMHg5NzcyLFxuICAgICAgTGlnaHRQaW5rOiAweGZkYjgsXG4gICAgICBMaWdodFNhbG1vbjogMHhmZDBmLFxuICAgICAgTGlnaHRTZWFHcmVlbjogMHgyNTk1LFxuICAgICAgTGlnaHRTa3lCbHVlOiAweDg2N2YsXG4gICAgICBMaWdodFNsYXRlR3JheTogMHg3NDUzLFxuICAgICAgTGlnaHRTdGVlbEJsdWU6IDB4YjYzYixcbiAgICAgIExpZ2h0WWVsbG93OiAweGZmZmMsXG4gICAgICBMaW1lOiAweDA3ZTAsXG4gICAgICBMaW1lR3JlZW46IDB4MzY2NixcbiAgICAgIExpbmVuOiAweGZmOWMsXG4gICAgICBNYWdlbnRhOiAweGY4MWYsXG4gICAgICBNYXJvb246IDB4ODAwMCxcbiAgICAgIE1lZGl1bUFxdWFNYXJpbmU6IDB4NjY3NSxcbiAgICAgIE1lZGl1bUJsdWU6IDB4MDAxOSxcbiAgICAgIE1lZGl1bU9yY2hpZDogMHhiYWJhLFxuICAgICAgTWVkaXVtUHVycGxlOiAweDkzOWIsXG4gICAgICBNZWRpdW1TZWFHcmVlbjogMHgzZDhlLFxuICAgICAgTWVkaXVtU2xhdGVCbHVlOiAweDdiNWQsXG4gICAgICBNZWRpdW1TcHJpbmdHcmVlbjogMHgwN2QzLFxuICAgICAgTWVkaXVtVHVycXVvaXNlOiAweDRlOTksXG4gICAgICBNZWRpdW1WaW9sZXRSZWQ6IDB4YzBiMCxcbiAgICAgIE1pZG5pZ2h0Qmx1ZTogMHgxOGNlLFxuICAgICAgTWludENyZWFtOiAweGY3ZmYsXG4gICAgICBNaXN0eVJvc2U6IDB4ZmYzYyxcbiAgICAgIE1vY2Nhc2luOiAweGZmMzYsXG4gICAgICBOYXZham9XaGl0ZTogMHhmZWY1LFxuICAgICAgTmF2eTogMHgwMDEwLFxuICAgICAgT2xkTGFjZTogMHhmZmJjLFxuICAgICAgT2xpdmU6IDB4ODQwMCxcbiAgICAgIE9saXZlRHJhYjogMHg2YzY0LFxuICAgICAgT3JhbmdlOiAweGZkMjAsXG4gICAgICBPcmFuZ2VSZWQ6IDB4ZmEyMCxcbiAgICAgIE9yY2hpZDogMHhkYjlhLFxuICAgICAgUGFsZUdvbGRlblJvZDogMHhlZjU1LFxuICAgICAgUGFsZUdyZWVuOiAweDlmZDMsXG4gICAgICBQYWxlVHVycXVvaXNlOiAweGFmN2QsXG4gICAgICBQYWxlVmlvbGV0UmVkOiAweGRiOTIsXG4gICAgICBQYXBheWFXaGlwOiAweGZmN2EsXG4gICAgICBQZWFjaFB1ZmY6IDB4ZmVkNyxcbiAgICAgIFBlcnU6IDB4Y2MyNyxcbiAgICAgIFBpbms6IDB4ZmUxOSxcbiAgICAgIFBsdW06IDB4ZGQxYixcbiAgICAgIFBvd2RlckJsdWU6IDB4YjcxYyxcbiAgICAgIFB1cnBsZTogMHg4MDEwLFxuICAgICAgUmViZWNjYVB1cnBsZTogMHg2MTkzLFxuICAgICAgUmVkOiAweGY4MDAsXG4gICAgICBSb3N5QnJvd246IDB4YmM3MSxcbiAgICAgIFJveWFsQmx1ZTogMHg0MzVjLFxuICAgICAgU2FkZGxlQnJvd246IDB4OGEyMixcbiAgICAgIFNhbG1vbjogMHhmYzBlLFxuICAgICAgU2FuZHlCcm93bjogMHhmNTJjLFxuICAgICAgU2VhR3JlZW46IDB4MmM0YSxcbiAgICAgIFNlYVNoZWxsOiAweGZmYmQsXG4gICAgICBTaWVubmE6IDB4YTI4NSxcbiAgICAgIFNpbHZlcjogMHhjNjE4LFxuICAgICAgU2t5Qmx1ZTogMHg4NjdkLFxuICAgICAgU2xhdGVCbHVlOiAweDZhZDksXG4gICAgICBTbGF0ZUdyYXk6IDB4NzQxMixcbiAgICAgIFNub3c6IDB4ZmZkZixcbiAgICAgIFNwcmluZ0dyZWVuOiAweDA3ZWYsXG4gICAgICBTdGVlbEJsdWU6IDB4NDQxNixcbiAgICAgIFRhbjogMHhkNWIxLFxuICAgICAgVGVhbDogMHgwNDEwLFxuICAgICAgVGhpc3RsZTogMHhkZGZiLFxuICAgICAgVG9tYXRvOiAweGZiMDgsXG4gICAgICBUdXJxdW9pc2U6IDB4NDcxYSxcbiAgICAgIFZpb2xldDogMHhlYzFkLFxuICAgICAgV2hlYXQ6IDB4ZjZmNixcbiAgICAgIFdoaXRlOiAweGZmZmYsXG4gICAgICBXaGl0ZVNtb2tlOiAweGY3YmUsXG4gICAgICBZZWxsb3c6IDB4ZmZlMCxcbiAgICAgIFllbGxvd0dyZWVuOiAweDllNjYsXG4gICAgfTtcbiAgfVxufVxuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBTVDc3MzVTO1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgU1Q3NzM1U19URlRXSURUSCA9IDgwO1xuY29uc3QgU1Q3NzM1U19URlRIRUlHSFQgPSAxNjA7XG5cbi8vIGNvbnN0IFNUNzczNV9OT1AgPSAweDAwO1xuY29uc3QgU1Q3NzM1X1NXUkVTRVQgPSAweDAxO1xuLy8gY29uc3QgU1Q3NzM1X1JERElEID0gMHgwNDtcbi8vIGNvbnN0IFNUNzczNV9SRERTVCA9IDB4MDk7XG4vLyBjb25zdCBTVDc3MzVfUkREUE0gPSAweDBhO1xuXG4vLyBjb25zdCBTVDc3MzVfU0xQSU4gPSAweDEwO1xuY29uc3QgU1Q3NzM1X1NMUE9VVCA9IDB4MTE7XG4vLyBjb25zdCBTVDc3MzVfUFRMT04gPSAweDEyO1xuLy8gY29uc3QgU1Q3NzM1X05PUk9OID0gMHgxMztcblxuY29uc3QgU1Q3NzM1X0lOVk9GRiA9IDB4MjA7XG5jb25zdCBTVDc3MzVfSU5WT04gPSAweDIxO1xuY29uc3QgU1Q3NzM1X0RJU1BPRkYgPSAweDI4O1xuY29uc3QgU1Q3NzM1X0RJU1BPTiA9IDB4Mjk7XG5jb25zdCBTVDc3MzVfQ0FTRVQgPSAweDJhO1xuY29uc3QgU1Q3NzM1X1JBU0VUID0gMHgyYjtcbmNvbnN0IFNUNzczNV9SQU1XUiA9IDB4MmM7XG4vLyBjb25zdCBTVDc3MzVfUkFNUkQgPSAweDJlO1xuY29uc3QgU1Q3NzM1X01BRENUTCA9IDB4MzY7XG4vLyBjb25zdCBTVDc3MzVfUFRMQVIgPSAweDMwO1xuY29uc3QgU1Q3NzM1X0NPTE1PRCA9IDB4M2E7XG5cbmNvbnN0IFNUNzczNV9GUk1DVFIxID0gMHhiMTtcbmNvbnN0IFNUNzczNV9GUk1DVFIyID0gMHhiMjtcbmNvbnN0IFNUNzczNV9GUk1DVFIzID0gMHhiMztcbmNvbnN0IFNUNzczNV9JTlZDVFIgPSAweGI0O1xuLy8gY29uc3QgU1Q3NzM1X0RJU1NFVDUgPSAweGI2O1xuXG5jb25zdCBTVDc3MzVfUFdDVFIxID0gMHhjMDtcbmNvbnN0IFNUNzczNV9QV0NUUjIgPSAweGMxO1xuY29uc3QgU1Q3NzM1X1BXQ1RSMyA9IDB4YzI7XG5jb25zdCBTVDc3MzVfUFdDVFI0ID0gMHhjMztcbmNvbnN0IFNUNzczNV9QV0NUUjUgPSAweGM0O1xuY29uc3QgU1Q3NzM1X1ZNQ1RSMSA9IDB4YzU7XG5cbi8vIGNvbnN0IFNUNzczNV9SRElEMSA9IDB4ZGE7XG4vLyBjb25zdCBTVDc3MzVfUkRJRDIgPSAweGRiO1xuLy8gY29uc3QgU1Q3NzM1X1JESUQzID0gMHhkYztcbi8vIGNvbnN0IFNUNzczNV9SRElENCA9IDB4ZGQ7XG5cbi8vIGNvbnN0IFNUNzczNV9QV0NUUjYgPSAweGZjO1xuXG5jb25zdCBTVDc3MzVfR01DVFJQMSA9IDB4ZTA7XG5jb25zdCBTVDc3MzVfR01DVFJOMSA9IDB4ZTE7XG5cbmNvbnN0IFNUNzczNV8xOGJpdCA9IDB4MDY7IC8vIDE4Yml0L3BpeGVsXG5jb25zdCBTVDc3MzVfMTZiaXQgPSAweDA1OyAvLyAxNmJpdC9waXhlbFxuXG4vLyBzdGFuZGFyZCBhc2NpaSA1eDcgZm9udFxuY29uc3QgZm9udCA9IFtcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgzZSxcbiAgMHg1YixcbiAgMHg0ZixcbiAgMHg1YixcbiAgMHgzZSxcbiAgMHgzZSxcbiAgMHg2YixcbiAgMHg0ZixcbiAgMHg2YixcbiAgMHgzZSxcbiAgMHgxYyxcbiAgMHgzZSxcbiAgMHg3YyxcbiAgMHgzZSxcbiAgMHgxYyxcbiAgMHgxOCxcbiAgMHgzYyxcbiAgMHg3ZSxcbiAgMHgzYyxcbiAgMHgxOCxcbiAgMHgxYyxcbiAgMHg1NyxcbiAgMHg3ZCxcbiAgMHg1NyxcbiAgMHgxYyxcbiAgMHgxYyxcbiAgMHg1ZSxcbiAgMHg3ZixcbiAgMHg1ZSxcbiAgMHgxYyxcbiAgMHgwMCxcbiAgMHgxOCxcbiAgMHgzYyxcbiAgMHgxOCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHhlNyxcbiAgMHhjMyxcbiAgMHhlNyxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgxOCxcbiAgMHgyNCxcbiAgMHgxOCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHhlNyxcbiAgMHhkYixcbiAgMHhlNyxcbiAgMHhmZixcbiAgMHgzMCxcbiAgMHg0OCxcbiAgMHgzYSxcbiAgMHgwNixcbiAgMHgwZSxcbiAgMHgyNixcbiAgMHgyOSxcbiAgMHg3OSxcbiAgMHgyOSxcbiAgMHgyNixcbiAgMHg0MCxcbiAgMHg3ZixcbiAgMHgwNSxcbiAgMHgwNSxcbiAgMHgwNyxcbiAgMHg0MCxcbiAgMHg3ZixcbiAgMHgwNSxcbiAgMHgyNSxcbiAgMHgzZixcbiAgMHg1YSxcbiAgMHgzYyxcbiAgMHhlNyxcbiAgMHgzYyxcbiAgMHg1YSxcbiAgMHg3ZixcbiAgMHgzZSxcbiAgMHgxYyxcbiAgMHgxYyxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgxYyxcbiAgMHgxYyxcbiAgMHgzZSxcbiAgMHg3ZixcbiAgMHgxNCxcbiAgMHgyMixcbiAgMHg3ZixcbiAgMHgyMixcbiAgMHgxNCxcbiAgMHg1ZixcbiAgMHg1ZixcbiAgMHgwMCxcbiAgMHg1ZixcbiAgMHg1ZixcbiAgMHgwNixcbiAgMHgwOSxcbiAgMHg3ZixcbiAgMHgwMSxcbiAgMHg3ZixcbiAgMHgwMCxcbiAgMHg2NixcbiAgMHg4OSxcbiAgMHg5NSxcbiAgMHg2YSxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHg5NCxcbiAgMHhhMixcbiAgMHhmZixcbiAgMHhhMixcbiAgMHg5NCxcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHg3ZSxcbiAgMHgwNCxcbiAgMHgwOCxcbiAgMHgxMCxcbiAgMHgyMCxcbiAgMHg3ZSxcbiAgMHgyMCxcbiAgMHgxMCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgyYSxcbiAgMHgxYyxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgxYyxcbiAgMHgyYSxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgxZSxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgwYyxcbiAgMHgxZSxcbiAgMHgwYyxcbiAgMHgxZSxcbiAgMHgwYyxcbiAgMHgzMCxcbiAgMHgzOCxcbiAgMHgzZSxcbiAgMHgzOCxcbiAgMHgzMCxcbiAgMHgwNixcbiAgMHgwZSxcbiAgMHgzZSxcbiAgMHgwZSxcbiAgMHgwNixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg1ZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwNyxcbiAgMHgwMCxcbiAgMHgwNyxcbiAgMHgwMCxcbiAgMHgxNCxcbiAgMHg3ZixcbiAgMHgxNCxcbiAgMHg3ZixcbiAgMHgxNCxcbiAgMHgyNCxcbiAgMHgyYSxcbiAgMHg3ZixcbiAgMHgyYSxcbiAgMHgxMixcbiAgMHgyMyxcbiAgMHgxMyxcbiAgMHgwOCxcbiAgMHg2NCxcbiAgMHg2MixcbiAgMHgzNixcbiAgMHg0OSxcbiAgMHg1NixcbiAgMHgyMCxcbiAgMHg1MCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgwNyxcbiAgMHgwMyxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxYyxcbiAgMHgyMixcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHgyMixcbiAgMHgxYyxcbiAgMHgwMCxcbiAgMHgyYSxcbiAgMHgxYyxcbiAgMHg3ZixcbiAgMHgxYyxcbiAgMHgyYSxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgzZSxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwMCxcbiAgMHg4MCxcbiAgMHg3MCxcbiAgMHgzMCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHgxMCxcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHgwMixcbiAgMHgzZSxcbiAgMHg1MSxcbiAgMHg0OSxcbiAgMHg0NSxcbiAgMHgzZSxcbiAgMHgwMCxcbiAgMHg0MixcbiAgMHg3ZixcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHg3MixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0NixcbiAgMHgyMSxcbiAgMHg0MSxcbiAgMHg0OSxcbiAgMHg0ZCxcbiAgMHgzMyxcbiAgMHgxOCxcbiAgMHgxNCxcbiAgMHgxMixcbiAgMHg3ZixcbiAgMHgxMCxcbiAgMHgyNyxcbiAgMHg0NSxcbiAgMHg0NSxcbiAgMHg0NSxcbiAgMHgzOSxcbiAgMHgzYyxcbiAgMHg0YSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzMSxcbiAgMHg0MSxcbiAgMHgyMSxcbiAgMHgxMSxcbiAgMHgwOSxcbiAgMHgwNyxcbiAgMHgzNixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzNixcbiAgMHg0NixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgyOSxcbiAgMHgxZSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0MCxcbiAgMHgzNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgxNCxcbiAgMHgyMixcbiAgMHg0MSxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHgyMixcbiAgMHgxNCxcbiAgMHgwOCxcbiAgMHgwMixcbiAgMHgwMSxcbiAgMHg1OSxcbiAgMHgwOSxcbiAgMHgwNixcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg1ZCxcbiAgMHg1OSxcbiAgMHg0ZSxcbiAgMHg3YyxcbiAgMHgxMixcbiAgMHgxMSxcbiAgMHgxMixcbiAgMHg3YyxcbiAgMHg3ZixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzNixcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgyMixcbiAgMHg3ZixcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgzZSxcbiAgMHg3ZixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHgwOSxcbiAgMHgwOSxcbiAgMHgwOSxcbiAgMHgwMSxcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg1MSxcbiAgMHg3MyxcbiAgMHg3ZixcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHg3ZixcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHg0MCxcbiAgMHg0MSxcbiAgMHgzZixcbiAgMHgwMSxcbiAgMHg3ZixcbiAgMHgwOCxcbiAgMHgxNCxcbiAgMHgyMixcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg3ZixcbiAgMHgwMixcbiAgMHgxYyxcbiAgMHgwMixcbiAgMHg3ZixcbiAgMHg3ZixcbiAgMHgwNCxcbiAgMHgwOCxcbiAgMHgxMCxcbiAgMHg3ZixcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgzZSxcbiAgMHg3ZixcbiAgMHgwOSxcbiAgMHgwOSxcbiAgMHgwOSxcbiAgMHgwNixcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg1MSxcbiAgMHgyMSxcbiAgMHg1ZSxcbiAgMHg3ZixcbiAgMHgwOSxcbiAgMHgxOSxcbiAgMHgyOSxcbiAgMHg0NixcbiAgMHgyNixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzMixcbiAgMHgwMyxcbiAgMHgwMSxcbiAgMHg3ZixcbiAgMHgwMSxcbiAgMHgwMyxcbiAgMHgzZixcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgzZixcbiAgMHgxZixcbiAgMHgyMCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHgxZixcbiAgMHgzZixcbiAgMHg0MCxcbiAgMHgzOCxcbiAgMHg0MCxcbiAgMHgzZixcbiAgMHg2MyxcbiAgMHgxNCxcbiAgMHgwOCxcbiAgMHgxNCxcbiAgMHg2MyxcbiAgMHgwMyxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHgwNCxcbiAgMHgwMyxcbiAgMHg2MSxcbiAgMHg1OSxcbiAgMHg0OSxcbiAgMHg0ZCxcbiAgMHg0MyxcbiAgMHgwMCxcbiAgMHg3ZixcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgwMixcbiAgMHgwNCxcbiAgMHgwOCxcbiAgMHgxMCxcbiAgMHgyMCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHgwNCxcbiAgMHgwMixcbiAgMHgwMSxcbiAgMHgwMixcbiAgMHgwNCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHgwMyxcbiAgMHgwNyxcbiAgMHgwOCxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg3OCxcbiAgMHg0MCxcbiAgMHg3ZixcbiAgMHgyOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzOCxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgyOCxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgyOCxcbiAgMHg3ZixcbiAgMHgzOCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHgxOCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHg3ZSxcbiAgMHgwOSxcbiAgMHgwMixcbiAgMHgxOCxcbiAgMHhhNCxcbiAgMHhhNCxcbiAgMHg5YyxcbiAgMHg3OCxcbiAgMHg3ZixcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHgwMCxcbiAgMHg0NCxcbiAgMHg3ZCxcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgzZCxcbiAgMHgwMCxcbiAgMHg3ZixcbiAgMHgxMCxcbiAgMHgyOCxcbiAgMHg0NCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHg3YyxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHg3YyxcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzOCxcbiAgMHhmYyxcbiAgMHgxOCxcbiAgMHgyNCxcbiAgMHgyNCxcbiAgMHgxOCxcbiAgMHgxOCxcbiAgMHgyNCxcbiAgMHgyNCxcbiAgMHgxOCxcbiAgMHhmYyxcbiAgMHg3YyxcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHgwNCxcbiAgMHgwOCxcbiAgMHg0OCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHgyNCxcbiAgMHgwNCxcbiAgMHgwNCxcbiAgMHgzZixcbiAgMHg0NCxcbiAgMHgyNCxcbiAgMHgzYyxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHg3YyxcbiAgMHgxYyxcbiAgMHgyMCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHgxYyxcbiAgMHgzYyxcbiAgMHg0MCxcbiAgMHgzMCxcbiAgMHg0MCxcbiAgMHgzYyxcbiAgMHg0NCxcbiAgMHgyOCxcbiAgMHgxMCxcbiAgMHgyOCxcbiAgMHg0NCxcbiAgMHg0YyxcbiAgMHg5MCxcbiAgMHg5MCxcbiAgMHg5MCxcbiAgMHg3YyxcbiAgMHg0NCxcbiAgMHg2NCxcbiAgMHg1NCxcbiAgMHg0YyxcbiAgMHg0NCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgzNixcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg3NyxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHgzNixcbiAgMHgwOCxcbiAgMHgwMCxcbiAgMHgwMixcbiAgMHgwMSxcbiAgMHgwMixcbiAgMHgwNCxcbiAgMHgwMixcbiAgMHgzYyxcbiAgMHgyNixcbiAgMHgyMyxcbiAgMHgyNixcbiAgMHgzYyxcbiAgMHgxZSxcbiAgMHhhMSxcbiAgMHhhMSxcbiAgMHg2MSxcbiAgMHgxMixcbiAgMHgzYSxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHg3YSxcbiAgMHgzOCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1NSxcbiAgMHg1OSxcbiAgMHgyMSxcbiAgMHg1NSxcbiAgMHg1NSxcbiAgMHg3OSxcbiAgMHg0MSxcbiAgMHgyMSxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg3OCxcbiAgMHg0MSxcbiAgMHgyMSxcbiAgMHg1NSxcbiAgMHg1NCxcbiAgMHg3OCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHg1NCxcbiAgMHg1NSxcbiAgMHg3OSxcbiAgMHg0MCxcbiAgMHgwYyxcbiAgMHgxZSxcbiAgMHg1MixcbiAgMHg3MixcbiAgMHgxMixcbiAgMHgzOSxcbiAgMHg1NSxcbiAgMHg1NSxcbiAgMHg1NSxcbiAgMHg1OSxcbiAgMHgzOSxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1OSxcbiAgMHgzOSxcbiAgMHg1NSxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1OCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0NSxcbiAgMHg3YyxcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgwMixcbiAgMHg0NSxcbiAgMHg3ZCxcbiAgMHg0MixcbiAgMHgwMCxcbiAgMHgwMSxcbiAgMHg0NSxcbiAgMHg3YyxcbiAgMHg0MCxcbiAgMHhmMCxcbiAgMHgyOSxcbiAgMHgyNCxcbiAgMHgyOSxcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHgyOCxcbiAgMHgyNSxcbiAgMHgyOCxcbiAgMHhmMCxcbiAgMHg3YyxcbiAgMHg1NCxcbiAgMHg1NSxcbiAgMHg0NSxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg3YyxcbiAgMHg1NCxcbiAgMHg3YyxcbiAgMHgwYSxcbiAgMHgwOSxcbiAgMHg3ZixcbiAgMHg0OSxcbiAgMHgzMixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzMixcbiAgMHgzMixcbiAgMHg0OCxcbiAgMHg0OCxcbiAgMHg0OCxcbiAgMHgzMixcbiAgMHgzMixcbiAgMHg0YSxcbiAgMHg0OCxcbiAgMHg0OCxcbiAgMHgzMCxcbiAgMHgzYSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgyMSxcbiAgMHg3YSxcbiAgMHgzYSxcbiAgMHg0MixcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHg3OCxcbiAgMHgwMCxcbiAgMHg5ZCxcbiAgMHhhMCxcbiAgMHhhMCxcbiAgMHg3ZCxcbiAgMHgzOSxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzOSxcbiAgMHgzZCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgzZCxcbiAgMHgzYyxcbiAgMHgyNCxcbiAgMHhmZixcbiAgMHgyNCxcbiAgMHgyNCxcbiAgMHg0OCxcbiAgMHg3ZSxcbiAgMHg0OSxcbiAgMHg0MyxcbiAgMHg2NixcbiAgMHgyYixcbiAgMHgyZixcbiAgMHhmYyxcbiAgMHgyZixcbiAgMHgyYixcbiAgMHhmZixcbiAgMHgwOSxcbiAgMHgyOSxcbiAgMHhmNixcbiAgMHgyMCxcbiAgMHhjMCxcbiAgMHg4OCxcbiAgMHg3ZSxcbiAgMHgwOSxcbiAgMHgwMyxcbiAgMHgyMCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg3OSxcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0NCxcbiAgMHg3ZCxcbiAgMHg0MSxcbiAgMHgzMCxcbiAgMHg0OCxcbiAgMHg0OCxcbiAgMHg0YSxcbiAgMHgzMixcbiAgMHgzOCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgyMixcbiAgMHg3YSxcbiAgMHgwMCxcbiAgMHg3YSxcbiAgMHgwYSxcbiAgMHgwYSxcbiAgMHg3MixcbiAgMHg3ZCxcbiAgMHgwZCxcbiAgMHgxOSxcbiAgMHgzMSxcbiAgMHg3ZCxcbiAgMHgyNixcbiAgMHgyOSxcbiAgMHgyOSxcbiAgMHgyZixcbiAgMHgyOCxcbiAgMHgyNixcbiAgMHgyOSxcbiAgMHgyOSxcbiAgMHgyOSxcbiAgMHgyNixcbiAgMHgzMCxcbiAgMHg0OCxcbiAgMHg0ZCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHgzOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgzOCxcbiAgMHgyZixcbiAgMHgxMCxcbiAgMHhjOCxcbiAgMHhhYyxcbiAgMHhiYSxcbiAgMHgyZixcbiAgMHgxMCxcbiAgMHgyOCxcbiAgMHgzNCxcbiAgMHhmYSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg3YixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgxNCxcbiAgMHgyYSxcbiAgMHgxNCxcbiAgMHgyMixcbiAgMHgyMixcbiAgMHgxNCxcbiAgMHgyYSxcbiAgMHgxNCxcbiAgMHgwOCxcbiAgMHhhYSxcbiAgMHgwMCxcbiAgMHg1NSxcbiAgMHgwMCxcbiAgMHhhYSxcbiAgMHhhYSxcbiAgMHg1NSxcbiAgMHhhYSxcbiAgMHg1NSxcbiAgMHhhYSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmYyxcbiAgMHgwMCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNyxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNCxcbiAgMHgwNCxcbiAgMHhmYyxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNyxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxZixcbiAgMHgwMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgxMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxNyxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmYyxcbiAgMHgwNCxcbiAgMHhmNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNyxcbiAgMHgxMCxcbiAgMHgxNyxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNCxcbiAgMHgwNCxcbiAgMHhmNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHhmNyxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNyxcbiAgMHgwMCxcbiAgMHhmNyxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNyxcbiAgMHgxNCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNCxcbiAgMHgxNCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmYyxcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmZixcbiAgMHgxNCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHhmZixcbiAgMHgwZixcbiAgMHgwZixcbiAgMHgwZixcbiAgMHgwZixcbiAgMHgwZixcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg3YyxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHgzZSxcbiAgMHgxNCxcbiAgMHg3ZSxcbiAgMHgwMixcbiAgMHgwMixcbiAgMHgwNixcbiAgMHgwNixcbiAgMHgwMixcbiAgMHg3ZSxcbiAgMHgwMixcbiAgMHg3ZSxcbiAgMHgwMixcbiAgMHg2MyxcbiAgMHg1NSxcbiAgMHg0OSxcbiAgMHg0MSxcbiAgMHg2MyxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzYyxcbiAgMHgwNCxcbiAgMHg0MCxcbiAgMHg3ZSxcbiAgMHgyMCxcbiAgMHgxZSxcbiAgMHgyMCxcbiAgMHgwNixcbiAgMHgwMixcbiAgMHg3ZSxcbiAgMHgwMixcbiAgMHgwMixcbiAgMHg5OSxcbiAgMHhhNSxcbiAgMHhlNyxcbiAgMHhhNSxcbiAgMHg5OSxcbiAgMHgxYyxcbiAgMHgyYSxcbiAgMHg0OSxcbiAgMHgyYSxcbiAgMHgxYyxcbiAgMHg0YyxcbiAgMHg3MixcbiAgMHgwMSxcbiAgMHg3MixcbiAgMHg0YyxcbiAgMHgzMCxcbiAgMHg0YSxcbiAgMHg0ZCxcbiAgMHg0ZCxcbiAgMHgzMCxcbiAgMHgzMCxcbiAgMHg0OCxcbiAgMHg3OCxcbiAgMHg0OCxcbiAgMHgzMCxcbiAgMHhiYyxcbiAgMHg2MixcbiAgMHg1YSxcbiAgMHg0NixcbiAgMHgzZCxcbiAgMHgzZSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgwMCxcbiAgMHg3ZSxcbiAgMHgwMSxcbiAgMHgwMSxcbiAgMHgwMSxcbiAgMHg3ZSxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg1ZixcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg0MCxcbiAgMHg1MSxcbiAgMHg0YSxcbiAgMHg0NCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0NCxcbiAgMHg0YSxcbiAgMHg1MSxcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMSxcbiAgMHgwMyxcbiAgMHhlMCxcbiAgMHg4MCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHg2YixcbiAgMHg2YixcbiAgMHgwOCxcbiAgMHgzNixcbiAgMHgxMixcbiAgMHgzNixcbiAgMHgyNCxcbiAgMHgzNixcbiAgMHgwNixcbiAgMHgwZixcbiAgMHgwOSxcbiAgMHgwZixcbiAgMHgwNixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxOCxcbiAgMHgxOCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgwMCxcbiAgMHgzMCxcbiAgMHg0MCxcbiAgMHhmZixcbiAgMHgwMSxcbiAgMHgwMSxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgwMSxcbiAgMHgwMSxcbiAgMHgxZSxcbiAgMHgwMCxcbiAgMHgxOSxcbiAgMHgxZCxcbiAgMHgxNyxcbiAgMHgxMixcbiAgMHgwMCxcbiAgMHgzYyxcbiAgMHgzYyxcbiAgMHgzYyxcbiAgMHgzYyxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbl07XG4iXX0=
