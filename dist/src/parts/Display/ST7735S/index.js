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
Object.defineProperty(exports, "__esModule", { value: true });
// SainSmart ST7735 1.8" TFT LCD 128x160 pixel
class ST7735S {
    constructor() {
        this.keys = ["sclk", "mosi", "cs", "res", "dc"];
        this.required = [];
    }
    static info() {
        return {
            name: "ST7735S",
        };
    }
    wired(obniz) {
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
    print_debug(v) {
        if (this.debugprint) {
            console.log("SainSmartTFT18LCD: " + Array.prototype.slice.call(arguments).join(""));
        }
    }
    _deadSleep(waitMsec) {
        const startMsec = new Date();
        while (new Date() - startMsec < waitMsec) {
        }
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
        if (data.length === 0) {
            return;
        }
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
                const data = this.writeBuffer.slice(0, 1024);
                this.writeData(data);
                this.writeBuffer.splice(0, 1024);
            }
            else {
                if (this.writeBuffer.length > 0) {
                    this.writeData(this.writeBuffer);
                }
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
        const r = (color & 0xf800) >> 8;
        const g = (color & 0x7e0) >> 3;
        const b = (color & 0x1f) << 3;
        const x = Math.max(r, g, b) + Math.min(r, g, b);
        return this.color16(x - r, x - g, x - b);
    }
    reverseColor16(color) {
        const r = (color & 0xf800) >> 8;
        const g = (color & 0x7e0) >> 3;
        const b = (color & 0x1f) << 3;
        const x = 0xff;
        return this.color16(x - r, x - g, x - b);
    }
    _initG() {
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
        if (on === true) {
            this.setDisplayOn();
        }
        else {
            this.setDisplayOff();
        }
    }
    setInversionOn() {
        this.writeCommand(ST7735_INVON);
    }
    setInversionOff() {
        this.writeCommand(ST7735_INVOFF);
    }
    setInversion(inversion) {
        if (inversion === true) {
            this.setInversionOn();
        }
        else {
            this.setInversionOff();
        }
    }
    setRotation(m) {
        const MADCTL_MY = 0x80;
        const MADCTL_MX = 0x40;
        const MADCTL_MV = 0x20;
        // const MADCTL_ML = 0x10;
        const MADCTL_RGB = 0x00; // always RGB, never BGR
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
    // __swap(a, b) { let t = a; a = b; b = t; }
    fillScreen(color) {
        this.fillRect(0, 0, this.width, this.height, color);
    }
    _color2pixels(w, h, color) {
        return Array.from(new Array(Math.abs(w * h))).map((v, i) => color);
    }
    fillRect(x, y, w, h, color) {
        if (x >= this.width || y >= this.height) {
            return;
        }
        if (x + w - 1 >= this.width) {
            w = this.width - x;
        }
        if (y + h - 1 >= this.height) {
            h = this.height - y;
        }
        const pixels = this._color2pixels(w, h, color);
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
        let a;
        let b;
        let y;
        let last;
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
            }
            else if (x1 > b) {
                b = x1;
            }
            if (x2 < a) {
                a = x2;
            }
            else if (x2 > b) {
                b = x2;
            }
            this.drawHLine(a, y0, b - a + 1, color);
            return;
        }
        const dx01 = x1 - x0;
        const dy01 = y1 - y0;
        const dx02 = x2 - x0;
        const dy02 = y2 - y0;
        const dx12 = x2 - x1;
        const dy12 = y2 - y1;
        let sa = 0;
        let sb = 0;
        if (y1 === y2) {
            last = y1;
        }
        else {
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
    drawVLine(x, y, h, color) {
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
        const pixels = this._color2pixels(1, h, color);
        this.rawBound16(x, y, 1, h, pixels, false);
    }
    drawHLine(x, y, w, color) {
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
        const pixels = this._color2pixels(w, 1, color);
        this.rawBound16(x, y, w, 1, pixels, false);
    }
    drawLine(x0, y0, x1, y1, color) {
        if (x0 === x1) {
            this.drawVLine(x0, y0, y1 - y0, color);
            return;
        }
        if (y0 === y1) {
            this.drawHLine(x0, y0, x1 - x0, color);
            return;
        }
        const step = Math.abs(y1 - y0) > Math.abs(x1 - x0);
        if (step) {
            y0 = [x0, (x0 = y0)][0]; // this._swap(x0, y0);
            y1 = [x1, (x1 = y1)][0]; // this._swap(x1, y1);
        }
        if (x0 > x1) {
            x1 = [x0, (x0 = x1)][0]; // this._swap(x0, x1);
            y1 = [y0, (y0 = y1)][0]; // this._swap(y0, y1);
        }
        const dx = x1 - x0;
        const dy = Math.abs(y1 - y0);
        let err = dx / 2;
        const ystep = y0 < y1 ? 1 : -1;
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
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        this.rawBound16(x, y, 1, 1, [color], false);
    }
    drawChar(x, y, ch, color, bg, size) {
        //  bg = bg || color;
        size = size || 1;
        if (x >= this.width || // Clip right
            y >= this.height || // Clip bottom
            x + 6 * size - 1 < 0 || // Clip left
            y + 8 * size - 1 < 0) {
            // Clip top
            return;
        }
        if (color !== bg) {
            this.drawChar2(x, y, ch, color, bg, size);
            return;
        }
        const c = ch.charCodeAt(0);
        for (let i = 0; i < 6; i++) {
            let line = i === 5 ? 0 : font[c * 5 + i];
            for (let j = 0; j < 8; j++) {
                if (line & 0x1) {
                    if (size === 1) {
                        // default size
                        this.drawPixel(x + i, y + j, color);
                    }
                    else {
                        // big size
                        this.fillRect(x + i * size, y + j * size, size, size, color);
                    }
                }
                else if (bg !== color) {
                    if (size === 1) {
                        // default size
                        this.drawPixel(x + i, y + j, bg);
                    }
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
        ) {
            return;
        }
        const pixels = new Array(6 * 8 * size * size);
        const c = ch.charCodeAt(0);
        for (let i = 0; i < 6; i++) {
            let line = i === 5 ? 0 : font[c * 5 + i];
            for (let j = 0; j < 8; j++) {
                const cl = line & 0x1 ? color : bg;
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
        const rgb = [];
        pixels.forEach((v) => {
            const v2 = ((v & 0xf800) >> 11) | (v & 0x7e0) | ((v & 0x1f) << 11);
            rgb.push((v2 & 0xff00) >> 8);
            rgb.push(v2 & 0xff);
        });
        this.setAddrWindow(x, y, x + width - 1, y + height - 1);
        if (flush) {
            this._writeBuffer(rgb);
            this._writeBuffer(); // for flush
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
            const c = str.charAt(n);
            if (c === "\n") {
                y += size * 8;
                x = 0;
            }
            else if (c === "\r") {
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
        this.write(ST7735_COLMOD, [ST7735_18bit]); // 18bit/pixel
        const imageData = context.getImageData(x0, y0, width, height).data;
        const rgb = [];
        for (let n = 0; n < imageData.length; n += 4) {
            const r = imageData[n + 0];
            const g = imageData[n + 1];
            const b = imageData[n + 2];
            if (!gray) {
                rgb.push(b);
                rgb.push(g);
                rgb.push(r);
            }
            else {
                const gs = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
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
    drawContext(context, gray) {
        gray = gray || false;
        this.drawContextBound(context, 0, 0, this.width, this.height, 0, 0, gray);
    }
    draw(context, gray) {
        this.drawContext(context, gray);
    }
    rawBound(x, y, width, height, pixels) {
        const rgb = [];
        pixels.forEach((v) => {
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
exports.default = ST7735S;
// ----------------------------------------------------------
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXNwbGF5L1NUNzczNVMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBOEM7QUFDOUMsTUFBTSxPQUFPO0lBeUJYO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBMUJNLE1BQU0sQ0FBQyxJQUFJO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDO0lBQ0osQ0FBQztJQXdCTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVE7UUFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElB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QUFFLENBQU0sRUFBRSxDQUFNLEVBQUUsS0FBVTtRQUNyRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTTtRQUNsRCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVE7UUFFNUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLGlC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Q0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0NBQ0wsQ0FBQyIsImZpbGUiOiJzcmMvcGFydHMvRGlzcGxheS9TVDc3MzVTL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU2FpblNtYXJ0IFNUNzczNSAxLjhcIiBURlQgTENEIDEyOHgxNjAgcGl4ZWxcbmNsYXNzIFNUNzczNVMge1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5mbygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJTVDc3MzVTXCIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBrZXlzOiBhbnk7XG4gIHB1YmxpYyByZXF1aXJlZDogYW55O1xuICBwdWJsaWMgZGVidWdwcmludDogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIGlvX2RjOiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIGlvX3JlczogYW55O1xuICBwdWJsaWMgaW9fY3M6IGFueTtcbiAgcHVibGljIHNwaTogYW55O1xuICBwdWJsaWMgd2lkdGg6IGFueTtcbiAgcHVibGljIGhlaWdodDogYW55O1xuICBwdWJsaWMgcm90YXRpb246IGFueTtcbiAgcHVibGljIHhfb2Zmc2V0OiBhbnk7XG4gIHB1YmxpYyB5X29mZnNldDogYW55O1xuICBwdWJsaWMgd3JpdGVCdWZmZXI6IGFueTtcbiAgcHVibGljIGNvbG9yOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gW1wic2Nsa1wiLCBcIm1vc2lcIiwgXCJjc1wiLCBcInJlc1wiLCBcImRjXCJdO1xuICAgIHRoaXMucmVxdWlyZWQgPSBbXTtcbiAgfVxuXG4gIHB1YmxpYyB3aXJlZChvYm5pejogYW55KSB7XG4gICAgdGhpcy5kZWJ1Z3ByaW50ID0gZmFsc2U7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuXG4gICAgdGhpcy5pb19kYyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmRjKTtcbiAgICB0aGlzLmlvX3JlcyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnJlcyk7XG4gICAgdGhpcy5pb19jcyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmNzKTtcblxuICAgIHRoaXMucGFyYW1zLmZyZXF1ZW5jeSA9IDE2ICogMTAwMCAqIDEwMDA7IC8vIDE2TUh6XG4gICAgdGhpcy5wYXJhbXMubW9kZSA9IFwibWFzdGVyXCI7XG4gICAgdGhpcy5wYXJhbXMuY2xrID0gdGhpcy5wYXJhbXMuc2NsaztcbiAgICB0aGlzLnBhcmFtcy5tb3NpID0gdGhpcy5wYXJhbXMubW9zaTtcbiAgICB0aGlzLnBhcmFtcy5kcml2ZSA9IFwiM3ZcIjtcbiAgICB0aGlzLnNwaSA9IHRoaXMub2JuaXouZ2V0U3BpV2l0aENvbmZpZyh0aGlzLnBhcmFtcyk7XG5cbiAgICB0aGlzLmlvX2RjLm91dHB1dCh0cnVlKTtcbiAgICB0aGlzLmlvX2NzLm91dHB1dChmYWxzZSk7XG5cbiAgICB0aGlzLndpZHRoID0gU1Q3NzM1U19URlRXSURUSDtcbiAgICB0aGlzLmhlaWdodCA9IFNUNzczNVNfVEZUSEVJR0hUO1xuICAgIHRoaXMucm90YXRpb24gPSAwO1xuICAgIHRoaXMueF9vZmZzZXQgPSAyNjtcbiAgICB0aGlzLnlfb2Zmc2V0ID0gMjtcblxuICAgIHRoaXMud3JpdGVCdWZmZXIgPSBbXTsgLy8gMTAyNGJ5dGVzIGJ1ZmZlcnJpbmdcblxuICAgIHRoaXMuX3NldFByZXNldENvbG9yKCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwdWJsaWMgcHJpbnRfZGVidWcodjogYW55KSB7XG4gICAgaWYgKHRoaXMuZGVidWdwcmludCkge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiU2FpblNtYXJ0VEZUMThMQ0Q6IFwiICsgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5qb2luKFwiXCIpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX2RlYWRTbGVlcCh3YWl0TXNlYzogYW55KSB7XG4gICAgY29uc3Qgc3RhcnRNc2VjOiBhbnkgPSBuZXcgRGF0ZSgpO1xuICAgIHdoaWxlICgobmV3IERhdGUoKSBhcyBhbnkpIC0gc3RhcnRNc2VjIDwgd2FpdE1zZWMpIHtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX3Jlc2V0KCkge1xuICAgIHRoaXMuaW9fcmVzLm91dHB1dChmYWxzZSk7XG4gICAgdGhpcy5fZGVhZFNsZWVwKDEwKTtcbiAgICB0aGlzLmlvX3Jlcy5vdXRwdXQodHJ1ZSk7XG4gICAgdGhpcy5fZGVhZFNsZWVwKDEwKTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZUNvbW1hbmQoY21kOiBhbnkpIHtcbiAgICB0aGlzLmlvX2RjLm91dHB1dChmYWxzZSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuc3BpLndyaXRlKFtjbWRdKTtcbiAgICB0aGlzLmlvX2NzLm91dHB1dCh0cnVlKTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZURhdGEoZGF0YTogYW55KSB7XG4gICAgdGhpcy5pb19kYy5vdXRwdXQodHJ1ZSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuc3BpLndyaXRlKGRhdGEpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KHRydWUpO1xuICB9XG5cbiAgcHVibGljIHdyaXRlKGNtZDogYW55LCBkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoY21kKTtcbiAgICB0aGlzLndyaXRlRGF0YShkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBhc3luY3dhaXQoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuc3BpLndyaXRlV2FpdChbMHgwMF0pO1xuICB9XG5cbiAgcHVibGljIF93cml0ZUZsdXNoKCkge1xuICAgIHdoaWxlICh0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCA+IDEwMjQpIHtcbiAgICAgICAgY29uc3QgZGF0YTogYW55ID0gdGhpcy53cml0ZUJ1ZmZlci5zbGljZSgwLCAxMDI0KTtcbiAgICAgICAgdGhpcy53cml0ZURhdGEoZGF0YSk7XG4gICAgICAgIHRoaXMud3JpdGVCdWZmZXIuc3BsaWNlKDAsIDEwMjQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMud3JpdGVCdWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMud3JpdGVEYXRhKHRoaXMud3JpdGVCdWZmZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud3JpdGVCdWZmZXIgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX3dyaXRlQnVmZmVyKGRhdGE/OiBhbnkpIHtcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMud3JpdGVCdWZmZXIgPSB0aGlzLndyaXRlQnVmZmVyLmNvbmNhdChkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd3JpdGVGbHVzaCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjb2xvcjE2KHI6IGFueSwgZzogYW55LCBiOiBhbnkpIHtcbiAgICAvLyAgMXN0IGJ5dGUgIChyICYgMHhGOCB8IGcgPj4gNSlcbiAgICAvLyAgMm5kIGJ5dGUgIChnICYgMHhGQyA8PCAzIHwgYiA+PiAzKVxuICAgIHJldHVybiAoKHIgJiAweGY4KSA8PCA4KSB8ICgoZyAmIDB4ZmMpIDw8IDMpIHwgKGIgPj4gMyk7XG4gIH1cblxuICBwdWJsaWMgY29tcGxlbWVudGFyeUNvbG9yMTYoY29sb3I6IGFueSkge1xuICAgIGNvbnN0IHI6IGFueSA9IChjb2xvciAmIDB4ZjgwMCkgPj4gODtcbiAgICBjb25zdCBnOiBhbnkgPSAoY29sb3IgJiAweDdlMCkgPj4gMztcbiAgICBjb25zdCBiOiBhbnkgPSAoY29sb3IgJiAweDFmKSA8PCAzO1xuICAgIGNvbnN0IHg6IGFueSA9IE1hdGgubWF4KHIsIGcsIGIpICsgTWF0aC5taW4ociwgZywgYik7XG4gICAgcmV0dXJuIHRoaXMuY29sb3IxNih4IC0gciwgeCAtIGcsIHggLSBiKTtcbiAgfVxuXG4gIHB1YmxpYyByZXZlcnNlQ29sb3IxNihjb2xvcjogYW55KSB7XG4gICAgY29uc3QgcjogYW55ID0gKGNvbG9yICYgMHhmODAwKSA+PiA4O1xuICAgIGNvbnN0IGc6IGFueSA9IChjb2xvciAmIDB4N2UwKSA+PiAzO1xuICAgIGNvbnN0IGI6IGFueSA9IChjb2xvciAmIDB4MWYpIDw8IDM7XG4gICAgY29uc3QgeDogYW55ID0gMHhmZjtcbiAgICByZXR1cm4gdGhpcy5jb2xvcjE2KHggLSByLCB4IC0gZywgeCAtIGIpO1xuICB9XG5cbiAgcHVibGljIF9pbml0RygpIHtcbiAgICAvLyBpbml0aWFsaXplIGRpc3BsYXlcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfU1dSRVNFVCk7XG4gICAgdGhpcy5vYm5pei53YWl0KDE1MCk7XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X1NMUE9VVCk7IC8vIFNsZWVwIG91dCAmIGJvb3N0ZXIgb25cbiAgICB0aGlzLm9ibml6LndhaXQoNTAwKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9GUk1DVFIxLCBbMHgwMSwgMHgyYywgMHgyZF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0ZSTUNUUjIsIFsweDAxLCAweDJjLCAweDJkXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfRlJNQ1RSMywgWzB4MDEsIDB4MmMsIDB4MmQsIDB4MDEsIDB4MmMsIDB4MmRdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9JTlZDVFIsIFsweDA3XSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUFdDVFIxLCBbMHhhMiwgMHgwMiwgMHg4NF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1BXQ1RSMiwgWzB4YzVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9QV0NUUjMsIFsweDBhLCAweDAwXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUFdDVFI0LCBbMHg4YSwgMHgyYV0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1BXQ1RSNSwgWzB4OGEsIDB4ZWVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9WTUNUUjEsIFsweDBlXSk7XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X0lOVk9GRik7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfTUFEQ1RMLCBbMHhjOF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgWzB4MDVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DQVNFVCwgWzB4MDAsIDB4MDAsIDB4MDAsIDB4N2ZdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9SQVNFVCwgWzB4MDAsIDB4MDAsIDB4MDAsIDB4OWZdKTtcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfSU5WT04pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0dNQ1RSUDEsIFtcbiAgICAgIDB4MDIsXG4gICAgICAweDFjLFxuICAgICAgMHgwNyxcbiAgICAgIDB4MTIsXG4gICAgICAweDM3LFxuICAgICAgMHgzMixcbiAgICAgIDB4MjksXG4gICAgICAweDJkLFxuICAgICAgMHgyOSxcbiAgICAgIDB4MjUsXG4gICAgICAweDJiLFxuICAgICAgMHgzOSxcbiAgICAgIDB4MDAsXG4gICAgICAweDAxLFxuICAgICAgMHgwMyxcbiAgICAgIDB4MTAsXG4gICAgXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfR01DVFJOMSwgW1xuICAgICAgMHgwMyxcbiAgICAgIDB4MWQsXG4gICAgICAweDA3LFxuICAgICAgMHgwNixcbiAgICAgIDB4MmUsXG4gICAgICAweDJjLFxuICAgICAgMHgyOSxcbiAgICAgIDB4MmQsXG4gICAgICAweDJlLFxuICAgICAgMHgyZSxcbiAgICAgIDB4MzcsXG4gICAgICAweDNmLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDAsXG4gICAgICAweDAyLFxuICAgICAgMHgxMCxcbiAgICBdKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KCkge1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgdGhpcy5faW5pdEcoKTtcbiAgICB0aGlzLnNldERpc3BsYXlPbigpO1xuICAgIHRoaXMuc2V0Um90YXRpb24oMCk7XG4gIH1cblxuICBwdWJsaWMgc2V0RGlzcGxheU9uKCkge1xuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9ESVNQT04pO1xuICB9XG5cbiAgcHVibGljIHNldERpc3BsYXlPZmYoKSB7XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X0RJU1BPRkYpO1xuICB9XG5cbiAgcHVibGljIHNldERpc3BsYXkob246IGFueSkge1xuICAgIGlmIChvbiA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5zZXREaXNwbGF5T24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXREaXNwbGF5T2ZmKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldEludmVyc2lvbk9uKCkge1xuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9JTlZPTik7XG4gIH1cblxuICBwdWJsaWMgc2V0SW52ZXJzaW9uT2ZmKCkge1xuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9JTlZPRkYpO1xuICB9XG5cbiAgcHVibGljIHNldEludmVyc2lvbihpbnZlcnNpb246IGFueSkge1xuICAgIGlmIChpbnZlcnNpb24gPT09IHRydWUpIHtcbiAgICAgIHRoaXMuc2V0SW52ZXJzaW9uT24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRJbnZlcnNpb25PZmYoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0Um90YXRpb24obTogYW55KSB7XG4gICAgY29uc3QgTUFEQ1RMX01ZOiBhbnkgPSAweDgwO1xuICAgIGNvbnN0IE1BRENUTF9NWDogYW55ID0gMHg0MDtcbiAgICBjb25zdCBNQURDVExfTVY6IGFueSA9IDB4MjA7XG4gICAgLy8gY29uc3QgTUFEQ1RMX01MID0gMHgxMDtcbiAgICBjb25zdCBNQURDVExfUkdCOiBhbnkgPSAweDAwOyAvLyBhbHdheXMgUkdCLCBuZXZlciBCR1JcbiAgICAvLyBjb25zdCBNQURDVExfTUggPSAweDA0O1xuXG4gICAgbGV0IGRhdGE6IGFueTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbSAlIDQ7IC8vIGNhbid0IGJlIGhpZ2hlciB0aGFuIDNcbiAgICBzd2l0Y2ggKHRoaXMucm90YXRpb24pIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGF0YSA9IFtNQURDVExfTVggfCBNQURDVExfTVkgfCBNQURDVExfUkdCXTtcbiAgICAgICAgdGhpcy53aWR0aCA9IFNUNzczNVNfVEZUV0lEVEg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gU1Q3NzM1U19URlRIRUlHSFQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBkYXRhID0gW01BRENUTF9NWSB8IE1BRENUTF9NViB8IE1BRENUTF9SR0JdO1xuICAgICAgICB0aGlzLndpZHRoID0gU1Q3NzM1U19URlRIRUlHSFQ7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gU1Q3NzM1U19URlRXSURUSDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGRhdGEgPSBbTUFEQ1RMX1JHQl07XG4gICAgICAgIHRoaXMud2lkdGggPSBTVDc3MzVTX1RGVFdJRFRIO1xuICAgICAgICB0aGlzLmhlaWdodCA9IFNUNzczNVNfVEZUSEVJR0hUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgZGF0YSA9IFtNQURDVExfTVggfCBNQURDVExfTVYgfCBNQURDVExfUkdCXTtcbiAgICAgICAgdGhpcy53aWR0aCA9IFNUNzczNVNfVEZUSEVJR0hUO1xuICAgICAgICB0aGlzLmhlaWdodCA9IFNUNzczNVNfVEZUV0lEVEg7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLndyaXRlKFNUNzczNV9NQURDVEwsIGRhdGEpO1xuICAgIHRoaXMuc2V0QWRkcldpbmRvdygwLCAwLCB0aGlzLndpZHRoIC0gMSwgdGhpcy5oZWlnaHQgLSAxKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRBZGRyV2luZG93KHgwOiBhbnksIHkwOiBhbnksIHgxOiBhbnksIHkxOiBhbnkpIHtcbiAgICB0aGlzLnByaW50X2RlYnVnKFxuICAgICAgYHNldEFkZHJXaW5kb3c6ICh4MDogJHt4MH0sIHkwOiAke3kwfSkgLSAoeDE6ICR7eDF9LCB5MTogJHt5MX0pYCxcbiAgICApO1xuXG4gICAgaWYgKHgwIDwgMCkge1xuICAgICAgeDAgPSAwO1xuICAgIH1cbiAgICBpZiAoeTAgPCAwKSB7XG4gICAgICB5MCA9IDA7XG4gICAgfVxuICAgIGlmICh4MSA8IDApIHtcbiAgICAgIHgxID0gMDtcbiAgICB9XG4gICAgaWYgKHkxIDwgMCkge1xuICAgICAgeTEgPSAwO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJvdGF0aW9uID09PSAwIHx8IHRoaXMucm90YXRpb24gPT09IDIpIHtcbiAgICAgIHgwID0geDAgKyB0aGlzLnhfb2Zmc2V0O1xuICAgICAgeDEgPSB4MSArIHRoaXMueF9vZmZzZXQ7XG4gICAgICB5MCA9IHkwICsgdGhpcy55X29mZnNldDtcbiAgICAgIHkxID0geTEgKyB0aGlzLnlfb2Zmc2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICB4MCA9IHgwICsgdGhpcy55X29mZnNldDtcbiAgICAgIHgxID0geDEgKyB0aGlzLnlfb2Zmc2V0O1xuICAgICAgeTAgPSB5MCArIHRoaXMueF9vZmZzZXQ7XG4gICAgICB5MSA9IHkxICsgdGhpcy54X29mZnNldDtcbiAgICB9XG5cbiAgICAvLyBjb2x1bW4gYWRkciBzZXRcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DQVNFVCwgWzB4MDAsIHgwLCAweDAwLCB4MV0pOyAvLyBYU1RBUlQtWEVORFxuICAgIC8vIHJvdyBhZGRyIHNldFxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1JBU0VULCBbMHgwMCwgeTAsIDB4MDAsIHkxXSk7IC8vIFlTVEFSVC1ZRU5EXG4gICAgLy8gd3JpdGUgdG8gUkFNXG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X1JBTVdSKTtcbiAgICB0aGlzLndyaXRlQnVmZmVyID0gW107XG4gIH1cblxuICAvLyBfX3N3YXAoYSwgYikgeyBsZXQgdCA9IGE7IGEgPSBiOyBiID0gdDsgfVxuXG4gIHB1YmxpYyBmaWxsU2NyZWVuKGNvbG9yOiBhbnkpIHtcbiAgICB0aGlzLmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCBjb2xvcik7XG4gIH1cblxuICBwdWJsaWMgX2NvbG9yMnBpeGVscyh3OiBhbnksIGg6IGFueSwgY29sb3I6IGFueSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBBcnJheShNYXRoLmFicyh3ICogaCkpKS5tYXAoKHYsIGkpID0+IGNvbG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBmaWxsUmVjdCh4OiBhbnksIHk6IGFueSwgdzogYW55LCBoOiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICBpZiAoeCA+PSB0aGlzLndpZHRoIHx8IHkgPj0gdGhpcy5oZWlnaHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHggKyB3IC0gMSA+PSB0aGlzLndpZHRoKSB7XG4gICAgICB3ID0gdGhpcy53aWR0aCAtIHg7XG4gICAgfVxuICAgIGlmICh5ICsgaCAtIDEgPj0gdGhpcy5oZWlnaHQpIHtcbiAgICAgIGggPSB0aGlzLmhlaWdodCAtIHk7XG4gICAgfVxuICAgIGNvbnN0IHBpeGVsczogYW55ID0gdGhpcy5fY29sb3IycGl4ZWxzKHcsIGgsIGNvbG9yKTtcbiAgICB0aGlzLnJhd0JvdW5kMTYoeCwgeSwgdywgaCwgcGl4ZWxzLCB0cnVlKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3UmVjdCh4OiBhbnksIHk6IGFueSwgdzogYW55LCBoOiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICB0aGlzLmRyYXdITGluZSh4LCB5LCB3LCBjb2xvcik7XG4gICAgdGhpcy5kcmF3SExpbmUoeCwgeSArIGggLSAxLCB3LCBjb2xvcik7XG4gICAgdGhpcy5kcmF3VkxpbmUoeCwgeSwgaCwgY29sb3IpO1xuICAgIHRoaXMuZHJhd1ZMaW5lKHggKyB3IC0gMSwgeSwgaCwgY29sb3IpO1xuICB9XG5cbiAgcHVibGljIGRyYXdDaXJjbGUoeDA6IGFueSwgeTA6IGFueSwgcjogYW55LCBjb2xvcjogYW55KSB7XG4gICAgbGV0IGY6IGFueSA9IDEgLSByO1xuICAgIGxldCBkZEZfeDogYW55ID0gMTtcbiAgICBsZXQgZGRGX3k6IGFueSA9IC0yICogcjtcbiAgICBsZXQgeDogYW55ID0gMDtcbiAgICBsZXQgeTogYW55ID0gcjtcblxuICAgIHRoaXMuZHJhd1BpeGVsKHgwLCB5MCArIHIsIGNvbG9yKTtcbiAgICB0aGlzLmRyYXdQaXhlbCh4MCwgeTAgLSByLCBjb2xvcik7XG4gICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyByLCB5MCwgY29sb3IpO1xuICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0gciwgeTAsIGNvbG9yKTtcblxuICAgIHdoaWxlICh4IDwgeSkge1xuICAgICAgaWYgKGYgPj0gMCkge1xuICAgICAgICB5LS07XG4gICAgICAgIGRkRl95ICs9IDI7XG4gICAgICAgIGYgKz0gZGRGX3k7XG4gICAgICB9XG4gICAgICB4Kys7XG4gICAgICBkZEZfeCArPSAyO1xuICAgICAgZiArPSBkZEZfeDtcblxuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB4LCB5MCArIHksIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geCwgeTAgKyB5LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHgsIHkwIC0geSwgY29sb3IpO1xuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgLSB4LCB5MCAtIHksIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeSwgeTAgKyB4LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHksIHkwICsgeCwgY29sb3IpO1xuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB5LCB5MCAtIHgsIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geSwgeTAgLSB4LCBjb2xvcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9kcmF3Q2lyY2xlSGVscGVyKHgwOiBhbnksIHkwOiBhbnksIHI6IGFueSwgY29ybmVybmFtZTogYW55LCBjb2xvcjogYW55KSB7XG4gICAgbGV0IGY6IGFueSA9IDEgLSByO1xuICAgIGxldCBkZEZfeDogYW55ID0gMTtcbiAgICBsZXQgZGRGX3k6IGFueSA9IC0yICogcjtcbiAgICBsZXQgeDogYW55ID0gMDtcbiAgICBsZXQgeTogYW55ID0gcjtcblxuICAgIHdoaWxlICh4IDwgeSkge1xuICAgICAgaWYgKGYgPj0gMCkge1xuICAgICAgICB5LS07XG4gICAgICAgIGRkRl95ICs9IDI7XG4gICAgICAgIGYgKz0gZGRGX3k7XG4gICAgICB9XG4gICAgICB4Kys7XG4gICAgICBkZEZfeCArPSAyO1xuICAgICAgZiArPSBkZEZfeDtcbiAgICAgIGlmIChjb3JuZXJuYW1lICYgMHg0KSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeCwgeTAgKyB5LCBjb2xvcik7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeSwgeTAgKyB4LCBjb2xvcik7XG4gICAgICB9XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4Mikge1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHgsIHkwIC0geSwgY29sb3IpO1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHksIHkwIC0geCwgY29sb3IpO1xuICAgICAgfVxuICAgICAgaWYgKGNvcm5lcm5hbWUgJiAweDgpIHtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgLSB5LCB5MCArIHgsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgLSB4LCB5MCArIHksIGNvbG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb3JuZXJuYW1lICYgMHgxKSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geSwgeTAgLSB4LCBjb2xvcik7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geCwgeTAgLSB5LCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZpbGxDaXJjbGUoeDA6IGFueSwgeTA6IGFueSwgcjogYW55LCBjb2xvcjogYW55KSB7XG4gICAgdGhpcy5kcmF3VkxpbmUoeDAsIHkwIC0gciwgMiAqIHIgKyAxLCBjb2xvcik7XG4gICAgdGhpcy5fZmlsbENpcmNsZUhlbHBlcih4MCwgeTAsIHIsIDMsIDAsIGNvbG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBfZmlsbENpcmNsZUhlbHBlcih4MDogYW55LCB5MDogYW55LCByOiBhbnksIGNvcm5lcm5hbWU6IGFueSwgZGVsdGE6IGFueSwgY29sb3I6IGFueSkge1xuICAgIGxldCBmOiBhbnkgPSAxIC0gcjtcbiAgICBsZXQgZGRGX3g6IGFueSA9IDE7XG4gICAgbGV0IGRkRl95OiBhbnkgPSAtMiAqIHI7XG4gICAgbGV0IHg6IGFueSA9IDA7XG4gICAgbGV0IHk6IGFueSA9IHI7XG5cbiAgICB3aGlsZSAoeCA8IHkpIHtcbiAgICAgIGlmIChmID49IDApIHtcbiAgICAgICAgeS0tO1xuICAgICAgICBkZEZfeSArPSAyO1xuICAgICAgICBmICs9IGRkRl95O1xuICAgICAgfVxuICAgICAgeCsrO1xuICAgICAgZGRGX3ggKz0gMjtcbiAgICAgIGYgKz0gZGRGX3g7XG5cbiAgICAgIGlmIChjb3JuZXJuYW1lICYgMHgxKSB7XG4gICAgICAgIHRoaXMuZHJhd1ZMaW5lKHgwICsgeCwgeTAgLSB5LCAyICogeSArIDEgKyBkZWx0YSwgY29sb3IpO1xuICAgICAgICB0aGlzLmRyYXdWTGluZSh4MCArIHksIHkwIC0geCwgMiAqIHggKyAxICsgZGVsdGEsIGNvbG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb3JuZXJuYW1lICYgMHgyKSB7XG4gICAgICAgIHRoaXMuZHJhd1ZMaW5lKHgwIC0geCwgeTAgLSB5LCAyICogeSArIDEgKyBkZWx0YSwgY29sb3IpO1xuICAgICAgICB0aGlzLmRyYXdWTGluZSh4MCAtIHksIHkwIC0geCwgMiAqIHggKyAxICsgZGVsdGEsIGNvbG9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZHJhd1JvdW5kUmVjdCh4OiBhbnksIHk6IGFueSwgdzogYW55LCBoOiBhbnksIHI6IGFueSwgY29sb3I6IGFueSkge1xuICAgIHRoaXMuZHJhd0hMaW5lKHggKyByLCB5LCB3IC0gMiAqIHIsIGNvbG9yKTsgLy8gVG9wXG4gICAgdGhpcy5kcmF3SExpbmUoeCArIHIsIHkgKyBoIC0gMSwgdyAtIDIgKiByLCBjb2xvcik7IC8vIEJvdHRvbVxuICAgIHRoaXMuZHJhd1ZMaW5lKHgsIHkgKyByLCBoIC0gMiAqIHIsIGNvbG9yKTsgLy8gTGVmdFxuICAgIHRoaXMuZHJhd1ZMaW5lKHggKyB3IC0gMSwgeSArIHIsIGggLSAyICogciwgY29sb3IpOyAvLyBSaWdodFxuXG4gICAgdGhpcy5fZHJhd0NpcmNsZUhlbHBlcih4ICsgciwgeSArIHIsIHIsIDEsIGNvbG9yKTtcbiAgICB0aGlzLl9kcmF3Q2lyY2xlSGVscGVyKHggKyB3IC0gciAtIDEsIHkgKyByLCByLCAyLCBjb2xvcik7XG4gICAgdGhpcy5fZHJhd0NpcmNsZUhlbHBlcih4ICsgdyAtIHIgLSAxLCB5ICsgaCAtIHIgLSAxLCByLCA0LCBjb2xvcik7XG4gICAgdGhpcy5fZHJhd0NpcmNsZUhlbHBlcih4ICsgciwgeSArIGggLSByIC0gMSwgciwgOCwgY29sb3IpO1xuICB9XG5cbiAgcHVibGljIGZpbGxSb3VuZFJlY3QoeDogYW55LCB5OiBhbnksIHc6IGFueSwgaDogYW55LCByOiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICB0aGlzLmZpbGxSZWN0KHggKyByLCB5LCB3IC0gMiAqIHIsIGgsIGNvbG9yKTtcblxuICAgIHRoaXMuX2ZpbGxDaXJjbGVIZWxwZXIoeCArIHcgLSByIC0gMSwgeSArIHIsIHIsIDEsIGggLSAyICogciAtIDEsIGNvbG9yKTtcbiAgICB0aGlzLl9maWxsQ2lyY2xlSGVscGVyKHggKyByLCB5ICsgciwgciwgMiwgaCAtIDIgKiByIC0gMSwgY29sb3IpO1xuICB9XG5cbiAgcHVibGljIGRyYXdUcmlhbmdsZSh4MDogYW55LCB5MDogYW55LCB4MTogYW55LCB5MTogYW55LCB4MjogYW55LCB5MjogYW55LCBjb2xvcjogYW55KSB7XG4gICAgdGhpcy5kcmF3TGluZSh4MCwgeTAsIHgxLCB5MSwgY29sb3IpO1xuICAgIHRoaXMuZHJhd0xpbmUoeDEsIHkxLCB4MiwgeTIsIGNvbG9yKTtcbiAgICB0aGlzLmRyYXdMaW5lKHgyLCB5MiwgeDAsIHkwLCBjb2xvcik7XG4gIH1cblxuICBwdWJsaWMgZmlsbFRyaWFuZ2xlKHgwOiBhbnksIHkwOiBhbnksIHgxOiBhbnksIHkxOiBhbnksIHgyOiBhbnksIHkyOiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICBsZXQgYTogYW55O1xuICAgIGxldCBiOiBhbnk7XG4gICAgbGV0IHk6IGFueTtcbiAgICBsZXQgbGFzdDogYW55O1xuXG4gICAgLy8gU29ydCBjb29yZGluYXRlcyBieSBZIG9yZGVyICh5MiA+PSB5MSA+PSB5MClcbiAgICBpZiAoeTAgPiB5MSkge1xuICAgICAgeTEgPSBbeTAsICh5MCA9IHkxKV1bMF07IC8vIHRoaXMuX3N3YXAoeTAsIHkxKTtcbiAgICAgIHgxID0gW3gwLCAoeDAgPSB4MSldWzBdOyAvLyB0aGlzLl9zd2FwKHgwLCB4MSk7XG4gICAgfVxuICAgIGlmICh5MSA+IHkyKSB7XG4gICAgICB5MiA9IFt5MSwgKHkxID0geTIpXVswXTsgLy8gdGhpcy5fc3dhcCh5MiwgeTEpO1xuICAgICAgeDIgPSBbeDEsICh4MSA9IHgyKV1bMF07IC8vIHRoaXMuX3N3YXAoeDIsIHgxKTtcbiAgICB9XG4gICAgaWYgKHkwID4geTEpIHtcbiAgICAgIHkxID0gW3kwLCAoeTAgPSB5MSldWzBdOyAvLyB0aGlzLl9zd2FwKHkwLCB5MSk7XG4gICAgICB4MSA9IFt4MCwgKHgwID0geDEpXVswXTsgLy8gdGhpcy5fc3dhcCh4MCwgeDEpO1xuICAgIH1cblxuICAgIGlmICh5MCA9PT0geTIpIHtcbiAgICAgIC8vIEhhbmRsZSBhd2t3YXJkIGFsbC1vbi1zYW1lLWxpbmUgY2FzZSBhcyBpdHMgb3duIHRoaW5nXG4gICAgICBhID0gYiA9IHgwO1xuICAgICAgaWYgKHgxIDwgYSkge1xuICAgICAgICBhID0geDE7XG4gICAgICB9IGVsc2UgaWYgKHgxID4gYikge1xuICAgICAgICBiID0geDE7XG4gICAgICB9XG4gICAgICBpZiAoeDIgPCBhKSB7XG4gICAgICAgIGEgPSB4MjtcbiAgICAgIH0gZWxzZSBpZiAoeDIgPiBiKSB7XG4gICAgICAgIGIgPSB4MjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZHJhd0hMaW5lKGEsIHkwLCBiIC0gYSArIDEsIGNvbG9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkeDAxOiBhbnkgPSB4MSAtIHgwO1xuICAgIGNvbnN0IGR5MDE6IGFueSA9IHkxIC0geTA7XG4gICAgY29uc3QgZHgwMjogYW55ID0geDIgLSB4MDtcbiAgICBjb25zdCBkeTAyOiBhbnkgPSB5MiAtIHkwO1xuICAgIGNvbnN0IGR4MTI6IGFueSA9IHgyIC0geDE7XG4gICAgY29uc3QgZHkxMjogYW55ID0geTIgLSB5MTtcbiAgICBsZXQgc2E6IGFueSA9IDA7XG4gICAgbGV0IHNiOiBhbnkgPSAwO1xuXG4gICAgaWYgKHkxID09PSB5Mikge1xuICAgICAgbGFzdCA9IHkxO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0ID0geTEgLSAxO1xuICAgIH0gLy8gc2tpcCBpdFxuXG4gICAgZm9yICh5ID0geTA7IHkgPD0gbGFzdDsgeSsrKSB7XG4gICAgICBhID0geDAgKyBNYXRoLmZsb29yKHNhIC8gZHkwMSk7XG4gICAgICBiID0geDAgKyBNYXRoLmZsb29yKHNiIC8gZHkwMik7XG4gICAgICBzYSArPSBkeDAxO1xuICAgICAgc2IgKz0gZHgwMjtcbiAgICAgIGlmIChhID4gYikge1xuICAgICAgICBiID0gW2EsIChhID0gYildWzBdO1xuICAgICAgfSAvLyB0aGlzLl9zd2FwKGEsYik7XG4gICAgICB0aGlzLmRyYXdITGluZShhLCB5LCBiIC0gYSArIDEsIGNvbG9yKTtcbiAgICB9XG5cbiAgICBzYSA9IGR4MTIgKiAoeSAtIHkxKTtcbiAgICBzYiA9IGR4MDIgKiAoeSAtIHkwKTtcbiAgICBmb3IgKDsgeSA8PSB5MjsgeSsrKSB7XG4gICAgICBhID0geDEgKyBNYXRoLmZsb29yKHNhIC8gZHkxMik7XG4gICAgICBiID0geDAgKyBNYXRoLmZsb29yKHNiIC8gZHkwMik7XG4gICAgICBzYSArPSBkeDEyO1xuICAgICAgc2IgKz0gZHgwMjtcbiAgICAgIGlmIChhID4gYikge1xuICAgICAgICBiID0gW2EsIChhID0gYildWzBdO1xuICAgICAgfSAvLyB0aGlzLl9zd2FwKGEsYik7XG4gICAgICB0aGlzLmRyYXdITGluZShhLCB5LCBiIC0gYSArIDEsIGNvbG9yKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZHJhd1ZMaW5lKHg6IGFueSwgeTogYW55LCBoOiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICBpZiAoaCA8IDApIHtcbiAgICAgIGggPSAtaDtcbiAgICAgIHkgPSB5IC0gaDtcbiAgICB9XG4gICAgaWYgKHggPj0gdGhpcy53aWR0aCB8fCB5ID49IHRoaXMuaGVpZ2h0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh5ICsgaCAtIDEgPj0gdGhpcy5oZWlnaHQpIHtcbiAgICAgIGggPSB0aGlzLmhlaWdodCAtIHk7XG4gICAgfVxuICAgIGNvbnN0IHBpeGVsczogYW55ID0gdGhpcy5fY29sb3IycGl4ZWxzKDEsIGgsIGNvbG9yKTtcbiAgICB0aGlzLnJhd0JvdW5kMTYoeCwgeSwgMSwgaCwgcGl4ZWxzLCBmYWxzZSk7XG4gIH1cblxuICBwdWJsaWMgZHJhd0hMaW5lKHg6IGFueSwgeTogYW55LCB3OiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICBpZiAodyA8IDApIHtcbiAgICAgIHcgPSAtdztcbiAgICAgIHggPSB4IC0gdztcbiAgICB9XG4gICAgaWYgKHggPj0gdGhpcy53aWR0aCB8fCB5ID49IHRoaXMuaGVpZ2h0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh4ICsgdyAtIDEgPj0gdGhpcy53aWR0aCkge1xuICAgICAgdyA9IHRoaXMud2lkdGggLSB4O1xuICAgIH1cbiAgICBjb25zdCBwaXhlbHM6IGFueSA9IHRoaXMuX2NvbG9yMnBpeGVscyh3LCAxLCBjb2xvcik7XG4gICAgdGhpcy5yYXdCb3VuZDE2KHgsIHksIHcsIDEsIHBpeGVscywgZmFsc2UpO1xuICB9XG5cbiAgcHVibGljIGRyYXdMaW5lKHgwOiBhbnksIHkwOiBhbnksIHgxOiBhbnksIHkxOiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICBpZiAoeDAgPT09IHgxKSB7XG4gICAgICB0aGlzLmRyYXdWTGluZSh4MCwgeTAsIHkxIC0geTAsIGNvbG9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHkwID09PSB5MSkge1xuICAgICAgdGhpcy5kcmF3SExpbmUoeDAsIHkwLCB4MSAtIHgwLCBjb2xvcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3RlcDogYW55ID0gTWF0aC5hYnMoeTEgLSB5MCkgPiBNYXRoLmFicyh4MSAtIHgwKTtcbiAgICBpZiAoc3RlcCkge1xuICAgICAgeTAgPSBbeDAsICh4MCA9IHkwKV1bMF07IC8vIHRoaXMuX3N3YXAoeDAsIHkwKTtcbiAgICAgIHkxID0gW3gxLCAoeDEgPSB5MSldWzBdOyAvLyB0aGlzLl9zd2FwKHgxLCB5MSk7XG4gICAgfVxuICAgIGlmICh4MCA+IHgxKSB7XG4gICAgICB4MSA9IFt4MCwgKHgwID0geDEpXVswXTsgLy8gdGhpcy5fc3dhcCh4MCwgeDEpO1xuICAgICAgeTEgPSBbeTAsICh5MCA9IHkxKV1bMF07IC8vIHRoaXMuX3N3YXAoeTAsIHkxKTtcbiAgICB9XG5cbiAgICBjb25zdCBkeDogYW55ID0geDEgLSB4MDtcbiAgICBjb25zdCBkeTogYW55ID0gTWF0aC5hYnMoeTEgLSB5MCk7XG5cbiAgICBsZXQgZXJyOiBhbnkgPSBkeCAvIDI7XG4gICAgY29uc3QgeXN0ZXA6IGFueSA9IHkwIDwgeTEgPyAxIDogLTE7XG5cbiAgICBmb3IgKDsgeDAgPD0geDE7IHgwKyspIHtcbiAgICAgIGlmIChzdGVwKSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHkwLCB4MCwgY29sb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAsIHkwLCBjb2xvcik7XG4gICAgICB9XG4gICAgICBlcnIgLT0gZHk7XG4gICAgICBpZiAoZXJyIDwgMCkge1xuICAgICAgICB5MCArPSB5c3RlcDtcbiAgICAgICAgZXJyICs9IGR4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkcmF3UGl4ZWwoeDogYW55LCB5OiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICBpZiAoeCA8IDAgfHwgeCA+PSB0aGlzLndpZHRoIHx8IHkgPCAwIHx8IHkgPj0gdGhpcy5oZWlnaHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yYXdCb3VuZDE2KHgsIHksIDEsIDEsIFtjb2xvcl0sIGZhbHNlKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3Q2hhcih4OiBhbnksIHk6IGFueSwgY2g6IGFueSwgY29sb3I6IGFueSwgYmc6IGFueSwgc2l6ZTogYW55KSB7XG4gICAgLy8gIGJnID0gYmcgfHwgY29sb3I7XG4gICAgc2l6ZSA9IHNpemUgfHwgMTtcbiAgICBpZiAoXG4gICAgICB4ID49IHRoaXMud2lkdGggfHwgLy8gQ2xpcCByaWdodFxuICAgICAgeSA+PSB0aGlzLmhlaWdodCB8fCAvLyBDbGlwIGJvdHRvbVxuICAgICAgeCArIDYgKiBzaXplIC0gMSA8IDAgfHwgLy8gQ2xpcCBsZWZ0XG4gICAgICB5ICsgOCAqIHNpemUgLSAxIDwgMFxuICAgICkge1xuICAgICAgLy8gQ2xpcCB0b3BcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29sb3IgIT09IGJnKSB7XG4gICAgICB0aGlzLmRyYXdDaGFyMih4LCB5LCBjaCwgY29sb3IsIGJnLCBzaXplKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjOiBhbnkgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICBsZXQgbGluZTogYW55ID0gaSA9PT0gNSA/IDAgOiBmb250W2MgKiA1ICsgaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDg7IGorKykge1xuICAgICAgICBpZiAobGluZSAmIDB4MSkge1xuICAgICAgICAgIGlmIChzaXplID09PSAxKSB7XG4gICAgICAgICAgICAvLyBkZWZhdWx0IHNpemVcbiAgICAgICAgICAgIHRoaXMuZHJhd1BpeGVsKHggKyBpLCB5ICsgaiwgY29sb3IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBiaWcgc2l6ZVxuICAgICAgICAgICAgdGhpcy5maWxsUmVjdCh4ICsgaSAqIHNpemUsIHkgKyBqICogc2l6ZSwgc2l6ZSwgc2l6ZSwgY29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChiZyAhPT0gY29sb3IpIHtcbiAgICAgICAgICBpZiAoc2l6ZSA9PT0gMSkge1xuICAgICAgICAgICAgLy8gZGVmYXVsdCBzaXplXG4gICAgICAgICAgICB0aGlzLmRyYXdQaXhlbCh4ICsgaSwgeSArIGosIGJnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYmlnIHNpemVcbiAgICAgICAgICAgIHRoaXMuZmlsbFJlY3QoeCArIGkgKiBzaXplLCB5ICsgaiAqIHNpemUsIHNpemUsIHNpemUsIGJnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGluZSA+Pj0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZHJhd0NoYXIyKHg6IGFueSwgeTogYW55LCBjaDogYW55LCBjb2xvcjogYW55LCBiZzogYW55LCBzaXplOiBhbnkpIHtcbiAgICAvLyAgYmcgPSBiZyB8fCBjb2xvcjtcbiAgICBzaXplID0gc2l6ZSB8fCAxO1xuICAgIGlmIChcbiAgICAgIHggPj0gdGhpcy53aWR0aCB8fCAvLyBDbGlwIHJpZ2h0XG4gICAgICB5ID49IHRoaXMuaGVpZ2h0IHx8IC8vIENsaXAgYm90dG9tXG4gICAgICB4ICsgNiAqIHNpemUgLSAxIDwgMCB8fCAvLyBDbGlwIGxlZnRcbiAgICAgIHkgKyA4ICogc2l6ZSAtIDEgPCAwIC8vIENsaXAgdG9wXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGl4ZWxzOiBhbnkgPSBuZXcgQXJyYXkoNiAqIDggKiBzaXplICogc2l6ZSk7XG4gICAgY29uc3QgYzogYW55ID0gY2guY2hhckNvZGVBdCgwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgbGV0IGxpbmU6IGFueSA9IGkgPT09IDUgPyAwIDogZm9udFtjICogNSArIGldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA4OyBqKyspIHtcbiAgICAgICAgY29uc3QgY2w6IGFueSA9IGxpbmUgJiAweDEgPyBjb2xvciA6IGJnO1xuICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IHNpemU7IHcrKykge1xuICAgICAgICAgIGZvciAobGV0IGggPSAwOyBoIDwgc2l6ZTsgaCsrKSB7XG4gICAgICAgICAgICBwaXhlbHNbXG4gICAgICAgICAgICBpICogKDEgKiBzaXplKSArIHcgKyAoaiAqICg2ICogc2l6ZSAqIHNpemUpICsgaCAqICg2ICogc2l6ZSkpXG4gICAgICAgICAgICAgIF0gPSBjbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGluZSA+Pj0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yYXdCb3VuZDE2KHgsIHksIDYgKiBzaXplLCA4ICogc2l6ZSwgcGl4ZWxzKTtcbiAgfVxuXG4gIHB1YmxpYyByYXdCb3VuZDE2KHg6IGFueSwgeTogYW55LCB3aWR0aDogYW55LCBoZWlnaHQ6IGFueSwgcGl4ZWxzOiBhbnksIGZsdXNoPzogYW55KSB7XG4gICAgY29uc3QgcmdiOiBhbnkgPSBbXTtcbiAgICBwaXhlbHMuZm9yRWFjaCgodjogYW55KSA9PiB7XG4gICAgICBjb25zdCB2MjogYW55ID0gKCh2ICYgMHhmODAwKSA+PiAxMSkgfCAodiAmIDB4N2UwKSB8ICgodiAmIDB4MWYpIDw8IDExKTtcbiAgICAgIHJnYi5wdXNoKCh2MiAmIDB4ZmYwMCkgPj4gOCk7XG4gICAgICByZ2IucHVzaCh2MiAmIDB4ZmYpO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0QWRkcldpbmRvdyh4LCB5LCB4ICsgd2lkdGggLSAxLCB5ICsgaGVpZ2h0IC0gMSk7XG4gICAgaWYgKGZsdXNoKSB7XG4gICAgICB0aGlzLl93cml0ZUJ1ZmZlcihyZ2IpO1xuICAgICAgdGhpcy5fd3JpdGVCdWZmZXIoKTsgLy8gZm9yIGZsdXNoXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud3JpdGVEYXRhKHJnYik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRyYXdTdHJpbmcoeDogYW55LCB5OiBhbnksIHN0cjogYW55LCBjb2xvcjogYW55LCBiZzogYW55LCBzaXplOiBhbnksIHdyYXA6IGFueSkge1xuICAgIC8vICBiZyA9IGJnIHx8IGNvbG9yO1xuICAgIHNpemUgPSBzaXplIHx8IDE7XG4gICAgLy8gIHdyYXAgPSB3cmFwIHx8IHRydWU7XG4gICAgZm9yIChsZXQgbiA9IDA7IG4gPCBzdHIubGVuZ3RoOyBuKyspIHtcbiAgICAgIGNvbnN0IGM6IGFueSA9IHN0ci5jaGFyQXQobik7XG4gICAgICBpZiAoYyA9PT0gXCJcXG5cIikge1xuICAgICAgICB5ICs9IHNpemUgKiA4O1xuICAgICAgICB4ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJcXHJcIikge1xuICAgICAgICAvLyBza2lwIGVtXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdDaGFyKHgsIHksIGMsIGNvbG9yLCBiZywgc2l6ZSk7XG4gICAgICAgIHggKz0gc2l6ZSAqIDY7XG4gICAgICAgIGlmICh3cmFwICYmIHggPiB0aGlzLndpZHRoIC0gc2l6ZSAqIDYpIHtcbiAgICAgICAgICB5ICs9IHNpemUgKiA4O1xuICAgICAgICAgIHggPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBwdWJsaWMgZHJhd0NvbnRleHRCb3VuZChjb250ZXh0OiBhbnksIHgwOiBhbnksIHkwOiBhbnksIHdpZHRoOiBhbnksIGhlaWdodDogYW55LCB4MTogYW55LCB5MTogYW55LCBncmF5OiBhbnkpIHtcbiAgICB4MCA9IHgwIHx8IDA7XG4gICAgeTAgPSB5MCB8fCAwO1xuICAgIHdpZHRoID0gd2lkdGggfHwgY29udGV4dC5jYW52YXMuY2xpZW50V2lkdGg7XG4gICAgaGVpZ2h0ID0gaGVpZ2h0IHx8IGNvbnRleHQuY2FudmFzLmNsaWVudEhlaWdodDtcbiAgICB4MSA9IHgxIHx8IDA7XG4gICAgeTEgPSB5MSB8fCAwO1xuICAgIGdyYXkgPSBncmF5IHx8IGZhbHNlO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xOGJpdF0pOyAvLyAxOGJpdC9waXhlbFxuICAgIGNvbnN0IGltYWdlRGF0YTogYW55ID0gY29udGV4dC5nZXRJbWFnZURhdGEoeDAsIHkwLCB3aWR0aCwgaGVpZ2h0KS5kYXRhO1xuICAgIGNvbnN0IHJnYjogYW55ID0gW107XG4gICAgZm9yIChsZXQgbiA9IDA7IG4gPCBpbWFnZURhdGEubGVuZ3RoOyBuICs9IDQpIHtcbiAgICAgIGNvbnN0IHI6IGFueSA9IGltYWdlRGF0YVtuICsgMF07XG4gICAgICBjb25zdCBnOiBhbnkgPSBpbWFnZURhdGFbbiArIDFdO1xuICAgICAgY29uc3QgYjogYW55ID0gaW1hZ2VEYXRhW24gKyAyXTtcbiAgICAgIGlmICghZ3JheSkge1xuICAgICAgICByZ2IucHVzaChiKTtcbiAgICAgICAgcmdiLnB1c2goZyk7XG4gICAgICAgIHJnYi5wdXNoKHIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZ3M6IGFueSA9IE1hdGgucm91bmQoMC4yOTkgKiByICsgMC41ODcgKiBnICsgMC4xMTQgKiBiKTtcbiAgICAgICAgcmdiLnB1c2goZ3MpO1xuICAgICAgICByZ2IucHVzaChncyk7XG4gICAgICAgIHJnYi5wdXNoKGdzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy53cml0ZShTVDc3MzVfQ09MTU9ELCBbU1Q3NzM1XzE4Yml0XSk7IC8vIDE4Yml0L3BpeGVsXG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgxLCB5MSwgeDEgKyB3aWR0aCAtIDEsIHkxICsgaGVpZ2h0IC0gMSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIocmdiKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcigpOyAvLyBmb3IgZmx1c2hcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DT0xNT0QsIFtTVDc3MzVfMTZiaXRdKTsgLy8gMTZiaXQvcGl4ZWxcbiAgfVxuXG4gIHB1YmxpYyBkcmF3Q29udGV4dChjb250ZXh0OiBhbnksIGdyYXk6IGFueSkge1xuICAgIGdyYXkgPSBncmF5IHx8IGZhbHNlO1xuICAgIHRoaXMuZHJhd0NvbnRleHRCb3VuZChjb250ZXh0LCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgMCwgMCwgZ3JheSk7XG4gIH1cblxuICBwdWJsaWMgZHJhdyhjb250ZXh0OiBhbnksIGdyYXk6IGFueSkge1xuICAgIHRoaXMuZHJhd0NvbnRleHQoY29udGV4dCwgZ3JheSk7XG4gIH1cblxuICBwdWJsaWMgcmF3Qm91bmQoeDogYW55LCB5OiBhbnksIHdpZHRoOiBhbnksIGhlaWdodDogYW55LCBwaXhlbHM6IGFueSkge1xuICAgIGNvbnN0IHJnYjogYW55ID0gW107XG4gICAgcGl4ZWxzLmZvckVhY2goKHY6IGFueSkgPT4ge1xuICAgICAgcmdiLnB1c2godiAmIDB4ZmYpO1xuICAgICAgcmdiLnB1c2goKHYgJiAweGZmMDApID4+IDgpO1xuICAgICAgcmdiLnB1c2goKHYgJiAweGZmMDAwMCkgPj4gMTYpO1xuICAgIH0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xOGJpdF0pOyAvLyAxOGJpdC9waXhlbFxuICAgIHRoaXMuc2V0QWRkcldpbmRvdyh4LCB5LCB4ICsgd2lkdGggLSAxLCB5ICsgaGVpZ2h0IC0gMSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIocmdiKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcigpOyAvLyBmb3IgZmx1c2hcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DT0xNT0QsIFtTVDc3MzVfMTZiaXRdKTsgLy8gMTZiaXQvcGl4ZWxcbiAgfVxuXG4gIHB1YmxpYyByYXcocGl4ZWxzOiBhbnkpIHtcbiAgICB0aGlzLnJhd0JvdW5kMTYoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHBpeGVscywgdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgX3NldFByZXNldENvbG9yKCkge1xuICAgIHRoaXMuY29sb3IgPSB7XG4gICAgICBBbGljZUJsdWU6IDB4ZjdkZixcbiAgICAgIEFudGlxdWVXaGl0ZTogMHhmZjVhLFxuICAgICAgQXF1YTogMHgwN2ZmLFxuICAgICAgQXF1YW1hcmluZTogMHg3ZmZhLFxuICAgICAgQXp1cmU6IDB4ZjdmZixcbiAgICAgIEJlaWdlOiAweGY3YmIsXG4gICAgICBCaXNxdWU6IDB4ZmYzOCxcbiAgICAgIEJsYWNrOiAweDAwMDAsXG4gICAgICBCbGFuY2hlZEFsbW9uZDogMHhmZjU5LFxuICAgICAgQmx1ZTogMHgwMDFmLFxuICAgICAgQmx1ZVZpb2xldDogMHg4OTVjLFxuICAgICAgQnJvd246IDB4YTE0NSxcbiAgICAgIEJ1cmx5V29vZDogMHhkZGQwLFxuICAgICAgQ2FkZXRCbHVlOiAweDVjZjQsXG4gICAgICBDaGFydHJldXNlOiAweDdmZTAsXG4gICAgICBDaG9jb2xhdGU6IDB4ZDM0MyxcbiAgICAgIENvcmFsOiAweGZiZWEsXG4gICAgICBDb3JuZmxvd2VyQmx1ZTogMHg2NGJkLFxuICAgICAgQ29ybnNpbGs6IDB4ZmZkYixcbiAgICAgIENyaW1zb246IDB4ZDhhNyxcbiAgICAgIEN5YW46IDB4MDdmZixcbiAgICAgIERhcmtCbHVlOiAweDAwMTEsXG4gICAgICBEYXJrQ3lhbjogMHgwNDUxLFxuICAgICAgRGFya0dvbGRlblJvZDogMHhiYzIxLFxuICAgICAgRGFya0dyYXk6IDB4YWQ1NSxcbiAgICAgIERhcmtHcmVlbjogMHgwMzIwLFxuICAgICAgRGFya0toYWtpOiAweGJkYWQsXG4gICAgICBEYXJrTWFnZW50YTogMHg4ODExLFxuICAgICAgRGFya09saXZlR3JlZW46IDB4NTM0NSxcbiAgICAgIERhcmtPcmFuZ2U6IDB4ZmM2MCxcbiAgICAgIERhcmtPcmNoaWQ6IDB4OTk5OSxcbiAgICAgIERhcmtSZWQ6IDB4ODgwMCxcbiAgICAgIERhcmtTYWxtb246IDB4ZWNhZixcbiAgICAgIERhcmtTZWFHcmVlbjogMHg4ZGYxLFxuICAgICAgRGFya1NsYXRlQmx1ZTogMHg0OWYxLFxuICAgICAgRGFya1NsYXRlR3JheTogMHgyYTY5LFxuICAgICAgRGFya1R1cnF1b2lzZTogMHgwNjdhLFxuICAgICAgRGFya1Zpb2xldDogMHg5MDFhLFxuICAgICAgRGVlcFBpbms6IDB4ZjhiMixcbiAgICAgIERlZXBTa3lCbHVlOiAweDA1ZmYsXG4gICAgICBEaW1HcmF5OiAweDZiNGQsXG4gICAgICBEb2RnZXJCbHVlOiAweDFjOWYsXG4gICAgICBGaXJlQnJpY2s6IDB4YjEwNCxcbiAgICAgIEZsb3JhbFdoaXRlOiAweGZmZGUsXG4gICAgICBGb3Jlc3RHcmVlbjogMHgyNDQ0LFxuICAgICAgRnVjaHNpYTogMHhmODFmLFxuICAgICAgR2FpbnNib3JvOiAweGRlZmIsXG4gICAgICBHaG9zdFdoaXRlOiAweGZmZGYsXG4gICAgICBHb2xkOiAweGZlYTAsXG4gICAgICBHb2xkZW5Sb2Q6IDB4ZGQyNCxcbiAgICAgIEdyYXk6IDB4ODQxMCxcbiAgICAgIEdyZWVuOiAweDA0MDAsXG4gICAgICBHcmVlblllbGxvdzogMHhhZmU1LFxuICAgICAgSG9uZXlEZXc6IDB4ZjdmZSxcbiAgICAgIEhvdFBpbms6IDB4ZmI1NixcbiAgICAgIEluZGlhblJlZDogMHhjYWViLFxuICAgICAgSW5kaWdvOiAweDQ4MTAsXG4gICAgICBJdm9yeTogMHhmZmZlLFxuICAgICAgS2hha2k6IDB4ZjczMSxcbiAgICAgIExhdmVuZGVyOiAweGU3M2YsXG4gICAgICBMYXZlbmRlckJsdXNoOiAweGZmOWUsXG4gICAgICBMYXduR3JlZW46IDB4N2ZlMCxcbiAgICAgIExlbW9uQ2hpZmZvbjogMHhmZmQ5LFxuICAgICAgTGlnaHRCbHVlOiAweGFlZGMsXG4gICAgICBMaWdodENvcmFsOiAweGY0MTAsXG4gICAgICBMaWdodEN5YW46IDB4ZTdmZixcbiAgICAgIExpZ2h0R29sZGVuUm9kWWVsbG93OiAweGZmZGEsXG4gICAgICBMaWdodEdyYXk6IDB4ZDY5YSxcbiAgICAgIExpZ2h0R3JlZW46IDB4OTc3MixcbiAgICAgIExpZ2h0UGluazogMHhmZGI4LFxuICAgICAgTGlnaHRTYWxtb246IDB4ZmQwZixcbiAgICAgIExpZ2h0U2VhR3JlZW46IDB4MjU5NSxcbiAgICAgIExpZ2h0U2t5Qmx1ZTogMHg4NjdmLFxuICAgICAgTGlnaHRTbGF0ZUdyYXk6IDB4NzQ1MyxcbiAgICAgIExpZ2h0U3RlZWxCbHVlOiAweGI2M2IsXG4gICAgICBMaWdodFllbGxvdzogMHhmZmZjLFxuICAgICAgTGltZTogMHgwN2UwLFxuICAgICAgTGltZUdyZWVuOiAweDM2NjYsXG4gICAgICBMaW5lbjogMHhmZjljLFxuICAgICAgTWFnZW50YTogMHhmODFmLFxuICAgICAgTWFyb29uOiAweDgwMDAsXG4gICAgICBNZWRpdW1BcXVhTWFyaW5lOiAweDY2NzUsXG4gICAgICBNZWRpdW1CbHVlOiAweDAwMTksXG4gICAgICBNZWRpdW1PcmNoaWQ6IDB4YmFiYSxcbiAgICAgIE1lZGl1bVB1cnBsZTogMHg5MzliLFxuICAgICAgTWVkaXVtU2VhR3JlZW46IDB4M2Q4ZSxcbiAgICAgIE1lZGl1bVNsYXRlQmx1ZTogMHg3YjVkLFxuICAgICAgTWVkaXVtU3ByaW5nR3JlZW46IDB4MDdkMyxcbiAgICAgIE1lZGl1bVR1cnF1b2lzZTogMHg0ZTk5LFxuICAgICAgTWVkaXVtVmlvbGV0UmVkOiAweGMwYjAsXG4gICAgICBNaWRuaWdodEJsdWU6IDB4MThjZSxcbiAgICAgIE1pbnRDcmVhbTogMHhmN2ZmLFxuICAgICAgTWlzdHlSb3NlOiAweGZmM2MsXG4gICAgICBNb2NjYXNpbjogMHhmZjM2LFxuICAgICAgTmF2YWpvV2hpdGU6IDB4ZmVmNSxcbiAgICAgIE5hdnk6IDB4MDAxMCxcbiAgICAgIE9sZExhY2U6IDB4ZmZiYyxcbiAgICAgIE9saXZlOiAweDg0MDAsXG4gICAgICBPbGl2ZURyYWI6IDB4NmM2NCxcbiAgICAgIE9yYW5nZTogMHhmZDIwLFxuICAgICAgT3JhbmdlUmVkOiAweGZhMjAsXG4gICAgICBPcmNoaWQ6IDB4ZGI5YSxcbiAgICAgIFBhbGVHb2xkZW5Sb2Q6IDB4ZWY1NSxcbiAgICAgIFBhbGVHcmVlbjogMHg5ZmQzLFxuICAgICAgUGFsZVR1cnF1b2lzZTogMHhhZjdkLFxuICAgICAgUGFsZVZpb2xldFJlZDogMHhkYjkyLFxuICAgICAgUGFwYXlhV2hpcDogMHhmZjdhLFxuICAgICAgUGVhY2hQdWZmOiAweGZlZDcsXG4gICAgICBQZXJ1OiAweGNjMjcsXG4gICAgICBQaW5rOiAweGZlMTksXG4gICAgICBQbHVtOiAweGRkMWIsXG4gICAgICBQb3dkZXJCbHVlOiAweGI3MWMsXG4gICAgICBQdXJwbGU6IDB4ODAxMCxcbiAgICAgIFJlYmVjY2FQdXJwbGU6IDB4NjE5MyxcbiAgICAgIFJlZDogMHhmODAwLFxuICAgICAgUm9zeUJyb3duOiAweGJjNzEsXG4gICAgICBSb3lhbEJsdWU6IDB4NDM1YyxcbiAgICAgIFNhZGRsZUJyb3duOiAweDhhMjIsXG4gICAgICBTYWxtb246IDB4ZmMwZSxcbiAgICAgIFNhbmR5QnJvd246IDB4ZjUyYyxcbiAgICAgIFNlYUdyZWVuOiAweDJjNGEsXG4gICAgICBTZWFTaGVsbDogMHhmZmJkLFxuICAgICAgU2llbm5hOiAweGEyODUsXG4gICAgICBTaWx2ZXI6IDB4YzYxOCxcbiAgICAgIFNreUJsdWU6IDB4ODY3ZCxcbiAgICAgIFNsYXRlQmx1ZTogMHg2YWQ5LFxuICAgICAgU2xhdGVHcmF5OiAweDc0MTIsXG4gICAgICBTbm93OiAweGZmZGYsXG4gICAgICBTcHJpbmdHcmVlbjogMHgwN2VmLFxuICAgICAgU3RlZWxCbHVlOiAweDQ0MTYsXG4gICAgICBUYW46IDB4ZDViMSxcbiAgICAgIFRlYWw6IDB4MDQxMCxcbiAgICAgIFRoaXN0bGU6IDB4ZGRmYixcbiAgICAgIFRvbWF0bzogMHhmYjA4LFxuICAgICAgVHVycXVvaXNlOiAweDQ3MWEsXG4gICAgICBWaW9sZXQ6IDB4ZWMxZCxcbiAgICAgIFdoZWF0OiAweGY2ZjYsXG4gICAgICBXaGl0ZTogMHhmZmZmLFxuICAgICAgV2hpdGVTbW9rZTogMHhmN2JlLFxuICAgICAgWWVsbG93OiAweGZmZTAsXG4gICAgICBZZWxsb3dHcmVlbjogMHg5ZTY2LFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1Q3NzM1UztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jb25zdCBTVDc3MzVTX1RGVFdJRFRIOiBhbnkgPSA4MDtcbmNvbnN0IFNUNzczNVNfVEZUSEVJR0hUOiBhbnkgPSAxNjA7XG5cbi8vIGNvbnN0IFNUNzczNV9OT1AgPSAweDAwO1xuY29uc3QgU1Q3NzM1X1NXUkVTRVQ6IGFueSA9IDB4MDE7XG4vLyBjb25zdCBTVDc3MzVfUkRESUQgPSAweDA0O1xuLy8gY29uc3QgU1Q3NzM1X1JERFNUID0gMHgwOTtcbi8vIGNvbnN0IFNUNzczNV9SRERQTSA9IDB4MGE7XG5cbi8vIGNvbnN0IFNUNzczNV9TTFBJTiA9IDB4MTA7XG5jb25zdCBTVDc3MzVfU0xQT1VUOiBhbnkgPSAweDExO1xuLy8gY29uc3QgU1Q3NzM1X1BUTE9OID0gMHgxMjtcbi8vIGNvbnN0IFNUNzczNV9OT1JPTiA9IDB4MTM7XG5cbmNvbnN0IFNUNzczNV9JTlZPRkY6IGFueSA9IDB4MjA7XG5jb25zdCBTVDc3MzVfSU5WT046IGFueSA9IDB4MjE7XG5jb25zdCBTVDc3MzVfRElTUE9GRjogYW55ID0gMHgyODtcbmNvbnN0IFNUNzczNV9ESVNQT046IGFueSA9IDB4Mjk7XG5jb25zdCBTVDc3MzVfQ0FTRVQ6IGFueSA9IDB4MmE7XG5jb25zdCBTVDc3MzVfUkFTRVQ6IGFueSA9IDB4MmI7XG5jb25zdCBTVDc3MzVfUkFNV1I6IGFueSA9IDB4MmM7XG4vLyBjb25zdCBTVDc3MzVfUkFNUkQgPSAweDJlO1xuY29uc3QgU1Q3NzM1X01BRENUTDogYW55ID0gMHgzNjtcbi8vIGNvbnN0IFNUNzczNV9QVExBUiA9IDB4MzA7XG5jb25zdCBTVDc3MzVfQ09MTU9EOiBhbnkgPSAweDNhO1xuXG5jb25zdCBTVDc3MzVfRlJNQ1RSMTogYW55ID0gMHhiMTtcbmNvbnN0IFNUNzczNV9GUk1DVFIyOiBhbnkgPSAweGIyO1xuY29uc3QgU1Q3NzM1X0ZSTUNUUjM6IGFueSA9IDB4YjM7XG5jb25zdCBTVDc3MzVfSU5WQ1RSOiBhbnkgPSAweGI0O1xuLy8gY29uc3QgU1Q3NzM1X0RJU1NFVDUgPSAweGI2O1xuXG5jb25zdCBTVDc3MzVfUFdDVFIxOiBhbnkgPSAweGMwO1xuY29uc3QgU1Q3NzM1X1BXQ1RSMjogYW55ID0gMHhjMTtcbmNvbnN0IFNUNzczNV9QV0NUUjM6IGFueSA9IDB4YzI7XG5jb25zdCBTVDc3MzVfUFdDVFI0OiBhbnkgPSAweGMzO1xuY29uc3QgU1Q3NzM1X1BXQ1RSNTogYW55ID0gMHhjNDtcbmNvbnN0IFNUNzczNV9WTUNUUjE6IGFueSA9IDB4YzU7XG5cbi8vIGNvbnN0IFNUNzczNV9SRElEMSA9IDB4ZGE7XG4vLyBjb25zdCBTVDc3MzVfUkRJRDIgPSAweGRiO1xuLy8gY29uc3QgU1Q3NzM1X1JESUQzID0gMHhkYztcbi8vIGNvbnN0IFNUNzczNV9SRElENCA9IDB4ZGQ7XG5cbi8vIGNvbnN0IFNUNzczNV9QV0NUUjYgPSAweGZjO1xuXG5jb25zdCBTVDc3MzVfR01DVFJQMTogYW55ID0gMHhlMDtcbmNvbnN0IFNUNzczNV9HTUNUUk4xOiBhbnkgPSAweGUxO1xuXG5jb25zdCBTVDc3MzVfMThiaXQ6IGFueSA9IDB4MDY7IC8vIDE4Yml0L3BpeGVsXG5jb25zdCBTVDc3MzVfMTZiaXQ6IGFueSA9IDB4MDU7IC8vIDE2Yml0L3BpeGVsXG5cbi8vIHN0YW5kYXJkIGFzY2lpIDV4NyBmb250XG5jb25zdCBmb250OiBhbnkgPSBbXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4M2UsXG4gIDB4NWIsXG4gIDB4NGYsXG4gIDB4NWIsXG4gIDB4M2UsXG4gIDB4M2UsXG4gIDB4NmIsXG4gIDB4NGYsXG4gIDB4NmIsXG4gIDB4M2UsXG4gIDB4MWMsXG4gIDB4M2UsXG4gIDB4N2MsXG4gIDB4M2UsXG4gIDB4MWMsXG4gIDB4MTgsXG4gIDB4M2MsXG4gIDB4N2UsXG4gIDB4M2MsXG4gIDB4MTgsXG4gIDB4MWMsXG4gIDB4NTcsXG4gIDB4N2QsXG4gIDB4NTcsXG4gIDB4MWMsXG4gIDB4MWMsXG4gIDB4NWUsXG4gIDB4N2YsXG4gIDB4NWUsXG4gIDB4MWMsXG4gIDB4MDAsXG4gIDB4MTgsXG4gIDB4M2MsXG4gIDB4MTgsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4ZTcsXG4gIDB4YzMsXG4gIDB4ZTcsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4MTgsXG4gIDB4MjQsXG4gIDB4MTgsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4ZTcsXG4gIDB4ZGIsXG4gIDB4ZTcsXG4gIDB4ZmYsXG4gIDB4MzAsXG4gIDB4NDgsXG4gIDB4M2EsXG4gIDB4MDYsXG4gIDB4MGUsXG4gIDB4MjYsXG4gIDB4MjksXG4gIDB4NzksXG4gIDB4MjksXG4gIDB4MjYsXG4gIDB4NDAsXG4gIDB4N2YsXG4gIDB4MDUsXG4gIDB4MDUsXG4gIDB4MDcsXG4gIDB4NDAsXG4gIDB4N2YsXG4gIDB4MDUsXG4gIDB4MjUsXG4gIDB4M2YsXG4gIDB4NWEsXG4gIDB4M2MsXG4gIDB4ZTcsXG4gIDB4M2MsXG4gIDB4NWEsXG4gIDB4N2YsXG4gIDB4M2UsXG4gIDB4MWMsXG4gIDB4MWMsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MWMsXG4gIDB4MWMsXG4gIDB4M2UsXG4gIDB4N2YsXG4gIDB4MTQsXG4gIDB4MjIsXG4gIDB4N2YsXG4gIDB4MjIsXG4gIDB4MTQsXG4gIDB4NWYsXG4gIDB4NWYsXG4gIDB4MDAsXG4gIDB4NWYsXG4gIDB4NWYsXG4gIDB4MDYsXG4gIDB4MDksXG4gIDB4N2YsXG4gIDB4MDEsXG4gIDB4N2YsXG4gIDB4MDAsXG4gIDB4NjYsXG4gIDB4ODksXG4gIDB4OTUsXG4gIDB4NmEsXG4gIDB4NjAsXG4gIDB4NjAsXG4gIDB4NjAsXG4gIDB4NjAsXG4gIDB4NjAsXG4gIDB4OTQsXG4gIDB4YTIsXG4gIDB4ZmYsXG4gIDB4YTIsXG4gIDB4OTQsXG4gIDB4MDgsXG4gIDB4MDQsXG4gIDB4N2UsXG4gIDB4MDQsXG4gIDB4MDgsXG4gIDB4MTAsXG4gIDB4MjAsXG4gIDB4N2UsXG4gIDB4MjAsXG4gIDB4MTAsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MmEsXG4gIDB4MWMsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MWMsXG4gIDB4MmEsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MWUsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MGMsXG4gIDB4MWUsXG4gIDB4MGMsXG4gIDB4MWUsXG4gIDB4MGMsXG4gIDB4MzAsXG4gIDB4MzgsXG4gIDB4M2UsXG4gIDB4MzgsXG4gIDB4MzAsXG4gIDB4MDYsXG4gIDB4MGUsXG4gIDB4M2UsXG4gIDB4MGUsXG4gIDB4MDYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NWYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDcsXG4gIDB4MDAsXG4gIDB4MDcsXG4gIDB4MDAsXG4gIDB4MTQsXG4gIDB4N2YsXG4gIDB4MTQsXG4gIDB4N2YsXG4gIDB4MTQsXG4gIDB4MjQsXG4gIDB4MmEsXG4gIDB4N2YsXG4gIDB4MmEsXG4gIDB4MTIsXG4gIDB4MjMsXG4gIDB4MTMsXG4gIDB4MDgsXG4gIDB4NjQsXG4gIDB4NjIsXG4gIDB4MzYsXG4gIDB4NDksXG4gIDB4NTYsXG4gIDB4MjAsXG4gIDB4NTAsXG4gIDB4MDAsXG4gIDB4MDgsXG4gIDB4MDcsXG4gIDB4MDMsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MWMsXG4gIDB4MjIsXG4gIDB4NDEsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NDEsXG4gIDB4MjIsXG4gIDB4MWMsXG4gIDB4MDAsXG4gIDB4MmEsXG4gIDB4MWMsXG4gIDB4N2YsXG4gIDB4MWMsXG4gIDB4MmEsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4M2UsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDAsXG4gIDB4ODAsXG4gIDB4NzAsXG4gIDB4MzAsXG4gIDB4MDAsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NjAsXG4gIDB4NjAsXG4gIDB4MDAsXG4gIDB4MjAsXG4gIDB4MTAsXG4gIDB4MDgsXG4gIDB4MDQsXG4gIDB4MDIsXG4gIDB4M2UsXG4gIDB4NTEsXG4gIDB4NDksXG4gIDB4NDUsXG4gIDB4M2UsXG4gIDB4MDAsXG4gIDB4NDIsXG4gIDB4N2YsXG4gIDB4NDAsXG4gIDB4MDAsXG4gIDB4NzIsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDYsXG4gIDB4MjEsXG4gIDB4NDEsXG4gIDB4NDksXG4gIDB4NGQsXG4gIDB4MzMsXG4gIDB4MTgsXG4gIDB4MTQsXG4gIDB4MTIsXG4gIDB4N2YsXG4gIDB4MTAsXG4gIDB4MjcsXG4gIDB4NDUsXG4gIDB4NDUsXG4gIDB4NDUsXG4gIDB4MzksXG4gIDB4M2MsXG4gIDB4NGEsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4MzEsXG4gIDB4NDEsXG4gIDB4MjEsXG4gIDB4MTEsXG4gIDB4MDksXG4gIDB4MDcsXG4gIDB4MzYsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4MzYsXG4gIDB4NDYsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4MjksXG4gIDB4MWUsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MTQsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NDAsXG4gIDB4MzQsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDgsXG4gIDB4MTQsXG4gIDB4MjIsXG4gIDB4NDEsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MDAsXG4gIDB4NDEsXG4gIDB4MjIsXG4gIDB4MTQsXG4gIDB4MDgsXG4gIDB4MDIsXG4gIDB4MDEsXG4gIDB4NTksXG4gIDB4MDksXG4gIDB4MDYsXG4gIDB4M2UsXG4gIDB4NDEsXG4gIDB4NWQsXG4gIDB4NTksXG4gIDB4NGUsXG4gIDB4N2MsXG4gIDB4MTIsXG4gIDB4MTEsXG4gIDB4MTIsXG4gIDB4N2MsXG4gIDB4N2YsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4MzYsXG4gIDB4M2UsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4MjIsXG4gIDB4N2YsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4M2UsXG4gIDB4N2YsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDEsXG4gIDB4N2YsXG4gIDB4MDksXG4gIDB4MDksXG4gIDB4MDksXG4gIDB4MDEsXG4gIDB4M2UsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4NTEsXG4gIDB4NzMsXG4gIDB4N2YsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4N2YsXG4gIDB4MDAsXG4gIDB4NDEsXG4gIDB4N2YsXG4gIDB4NDEsXG4gIDB4MDAsXG4gIDB4MjAsXG4gIDB4NDAsXG4gIDB4NDEsXG4gIDB4M2YsXG4gIDB4MDEsXG4gIDB4N2YsXG4gIDB4MDgsXG4gIDB4MTQsXG4gIDB4MjIsXG4gIDB4NDEsXG4gIDB4N2YsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4N2YsXG4gIDB4MDIsXG4gIDB4MWMsXG4gIDB4MDIsXG4gIDB4N2YsXG4gIDB4N2YsXG4gIDB4MDQsXG4gIDB4MDgsXG4gIDB4MTAsXG4gIDB4N2YsXG4gIDB4M2UsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4M2UsXG4gIDB4N2YsXG4gIDB4MDksXG4gIDB4MDksXG4gIDB4MDksXG4gIDB4MDYsXG4gIDB4M2UsXG4gIDB4NDEsXG4gIDB4NTEsXG4gIDB4MjEsXG4gIDB4NWUsXG4gIDB4N2YsXG4gIDB4MDksXG4gIDB4MTksXG4gIDB4MjksXG4gIDB4NDYsXG4gIDB4MjYsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4MzIsXG4gIDB4MDMsXG4gIDB4MDEsXG4gIDB4N2YsXG4gIDB4MDEsXG4gIDB4MDMsXG4gIDB4M2YsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4M2YsXG4gIDB4MWYsXG4gIDB4MjAsXG4gIDB4NDAsXG4gIDB4MjAsXG4gIDB4MWYsXG4gIDB4M2YsXG4gIDB4NDAsXG4gIDB4MzgsXG4gIDB4NDAsXG4gIDB4M2YsXG4gIDB4NjMsXG4gIDB4MTQsXG4gIDB4MDgsXG4gIDB4MTQsXG4gIDB4NjMsXG4gIDB4MDMsXG4gIDB4MDQsXG4gIDB4NzgsXG4gIDB4MDQsXG4gIDB4MDMsXG4gIDB4NjEsXG4gIDB4NTksXG4gIDB4NDksXG4gIDB4NGQsXG4gIDB4NDMsXG4gIDB4MDAsXG4gIDB4N2YsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4MDIsXG4gIDB4MDQsXG4gIDB4MDgsXG4gIDB4MTAsXG4gIDB4MjAsXG4gIDB4MDAsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4N2YsXG4gIDB4MDQsXG4gIDB4MDIsXG4gIDB4MDEsXG4gIDB4MDIsXG4gIDB4MDQsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4MDAsXG4gIDB4MDMsXG4gIDB4MDcsXG4gIDB4MDgsXG4gIDB4MDAsXG4gIDB4MjAsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NzgsXG4gIDB4NDAsXG4gIDB4N2YsXG4gIDB4MjgsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4MzgsXG4gIDB4MzgsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4MjgsXG4gIDB4MzgsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4MjgsXG4gIDB4N2YsXG4gIDB4MzgsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4MTgsXG4gIDB4MDAsXG4gIDB4MDgsXG4gIDB4N2UsXG4gIDB4MDksXG4gIDB4MDIsXG4gIDB4MTgsXG4gIDB4YTQsXG4gIDB4YTQsXG4gIDB4OWMsXG4gIDB4NzgsXG4gIDB4N2YsXG4gIDB4MDgsXG4gIDB4MDQsXG4gIDB4MDQsXG4gIDB4NzgsXG4gIDB4MDAsXG4gIDB4NDQsXG4gIDB4N2QsXG4gIDB4NDAsXG4gIDB4MDAsXG4gIDB4MjAsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4M2QsXG4gIDB4MDAsXG4gIDB4N2YsXG4gIDB4MTAsXG4gIDB4MjgsXG4gIDB4NDQsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NDEsXG4gIDB4N2YsXG4gIDB4NDAsXG4gIDB4MDAsXG4gIDB4N2MsXG4gIDB4MDQsXG4gIDB4NzgsXG4gIDB4MDQsXG4gIDB4NzgsXG4gIDB4N2MsXG4gIDB4MDgsXG4gIDB4MDQsXG4gIDB4MDQsXG4gIDB4NzgsXG4gIDB4MzgsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4MzgsXG4gIDB4ZmMsXG4gIDB4MTgsXG4gIDB4MjQsXG4gIDB4MjQsXG4gIDB4MTgsXG4gIDB4MTgsXG4gIDB4MjQsXG4gIDB4MjQsXG4gIDB4MTgsXG4gIDB4ZmMsXG4gIDB4N2MsXG4gIDB4MDgsXG4gIDB4MDQsXG4gIDB4MDQsXG4gIDB4MDgsXG4gIDB4NDgsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4MjQsXG4gIDB4MDQsXG4gIDB4MDQsXG4gIDB4M2YsXG4gIDB4NDQsXG4gIDB4MjQsXG4gIDB4M2MsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4MjAsXG4gIDB4N2MsXG4gIDB4MWMsXG4gIDB4MjAsXG4gIDB4NDAsXG4gIDB4MjAsXG4gIDB4MWMsXG4gIDB4M2MsXG4gIDB4NDAsXG4gIDB4MzAsXG4gIDB4NDAsXG4gIDB4M2MsXG4gIDB4NDQsXG4gIDB4MjgsXG4gIDB4MTAsXG4gIDB4MjgsXG4gIDB4NDQsXG4gIDB4NGMsXG4gIDB4OTAsXG4gIDB4OTAsXG4gIDB4OTAsXG4gIDB4N2MsXG4gIDB4NDQsXG4gIDB4NjQsXG4gIDB4NTQsXG4gIDB4NGMsXG4gIDB4NDQsXG4gIDB4MDAsXG4gIDB4MDgsXG4gIDB4MzYsXG4gIDB4NDEsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NzcsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NDEsXG4gIDB4MzYsXG4gIDB4MDgsXG4gIDB4MDAsXG4gIDB4MDIsXG4gIDB4MDEsXG4gIDB4MDIsXG4gIDB4MDQsXG4gIDB4MDIsXG4gIDB4M2MsXG4gIDB4MjYsXG4gIDB4MjMsXG4gIDB4MjYsXG4gIDB4M2MsXG4gIDB4MWUsXG4gIDB4YTEsXG4gIDB4YTEsXG4gIDB4NjEsXG4gIDB4MTIsXG4gIDB4M2EsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4MjAsXG4gIDB4N2EsXG4gIDB4MzgsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NTUsXG4gIDB4NTksXG4gIDB4MjEsXG4gIDB4NTUsXG4gIDB4NTUsXG4gIDB4NzksXG4gIDB4NDEsXG4gIDB4MjEsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NzgsXG4gIDB4NDEsXG4gIDB4MjEsXG4gIDB4NTUsXG4gIDB4NTQsXG4gIDB4NzgsXG4gIDB4NDAsXG4gIDB4MjAsXG4gIDB4NTQsXG4gIDB4NTUsXG4gIDB4NzksXG4gIDB4NDAsXG4gIDB4MGMsXG4gIDB4MWUsXG4gIDB4NTIsXG4gIDB4NzIsXG4gIDB4MTIsXG4gIDB4MzksXG4gIDB4NTUsXG4gIDB4NTUsXG4gIDB4NTUsXG4gIDB4NTksXG4gIDB4MzksXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NTksXG4gIDB4MzksXG4gIDB4NTUsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NTgsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NDUsXG4gIDB4N2MsXG4gIDB4NDEsXG4gIDB4MDAsXG4gIDB4MDIsXG4gIDB4NDUsXG4gIDB4N2QsXG4gIDB4NDIsXG4gIDB4MDAsXG4gIDB4MDEsXG4gIDB4NDUsXG4gIDB4N2MsXG4gIDB4NDAsXG4gIDB4ZjAsXG4gIDB4MjksXG4gIDB4MjQsXG4gIDB4MjksXG4gIDB4ZjAsXG4gIDB4ZjAsXG4gIDB4MjgsXG4gIDB4MjUsXG4gIDB4MjgsXG4gIDB4ZjAsXG4gIDB4N2MsXG4gIDB4NTQsXG4gIDB4NTUsXG4gIDB4NDUsXG4gIDB4MDAsXG4gIDB4MjAsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4N2MsXG4gIDB4NTQsXG4gIDB4N2MsXG4gIDB4MGEsXG4gIDB4MDksXG4gIDB4N2YsXG4gIDB4NDksXG4gIDB4MzIsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4MzIsXG4gIDB4MzIsXG4gIDB4NDgsXG4gIDB4NDgsXG4gIDB4NDgsXG4gIDB4MzIsXG4gIDB4MzIsXG4gIDB4NGEsXG4gIDB4NDgsXG4gIDB4NDgsXG4gIDB4MzAsXG4gIDB4M2EsXG4gIDB4NDEsXG4gIDB4NDEsXG4gIDB4MjEsXG4gIDB4N2EsXG4gIDB4M2EsXG4gIDB4NDIsXG4gIDB4NDAsXG4gIDB4MjAsXG4gIDB4NzgsXG4gIDB4MDAsXG4gIDB4OWQsXG4gIDB4YTAsXG4gIDB4YTAsXG4gIDB4N2QsXG4gIDB4MzksXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4MzksXG4gIDB4M2QsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4M2QsXG4gIDB4M2MsXG4gIDB4MjQsXG4gIDB4ZmYsXG4gIDB4MjQsXG4gIDB4MjQsXG4gIDB4NDgsXG4gIDB4N2UsXG4gIDB4NDksXG4gIDB4NDMsXG4gIDB4NjYsXG4gIDB4MmIsXG4gIDB4MmYsXG4gIDB4ZmMsXG4gIDB4MmYsXG4gIDB4MmIsXG4gIDB4ZmYsXG4gIDB4MDksXG4gIDB4MjksXG4gIDB4ZjYsXG4gIDB4MjAsXG4gIDB4YzAsXG4gIDB4ODgsXG4gIDB4N2UsXG4gIDB4MDksXG4gIDB4MDMsXG4gIDB4MjAsXG4gIDB4NTQsXG4gIDB4NTQsXG4gIDB4NzksXG4gIDB4NDEsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4NDQsXG4gIDB4N2QsXG4gIDB4NDEsXG4gIDB4MzAsXG4gIDB4NDgsXG4gIDB4NDgsXG4gIDB4NGEsXG4gIDB4MzIsXG4gIDB4MzgsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4MjIsXG4gIDB4N2EsXG4gIDB4MDAsXG4gIDB4N2EsXG4gIDB4MGEsXG4gIDB4MGEsXG4gIDB4NzIsXG4gIDB4N2QsXG4gIDB4MGQsXG4gIDB4MTksXG4gIDB4MzEsXG4gIDB4N2QsXG4gIDB4MjYsXG4gIDB4MjksXG4gIDB4MjksXG4gIDB4MmYsXG4gIDB4MjgsXG4gIDB4MjYsXG4gIDB4MjksXG4gIDB4MjksXG4gIDB4MjksXG4gIDB4MjYsXG4gIDB4MzAsXG4gIDB4NDgsXG4gIDB4NGQsXG4gIDB4NDAsXG4gIDB4MjAsXG4gIDB4MzgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4MzgsXG4gIDB4MmYsXG4gIDB4MTAsXG4gIDB4YzgsXG4gIDB4YWMsXG4gIDB4YmEsXG4gIDB4MmYsXG4gIDB4MTAsXG4gIDB4MjgsXG4gIDB4MzQsXG4gIDB4ZmEsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4N2IsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDgsXG4gIDB4MTQsXG4gIDB4MmEsXG4gIDB4MTQsXG4gIDB4MjIsXG4gIDB4MjIsXG4gIDB4MTQsXG4gIDB4MmEsXG4gIDB4MTQsXG4gIDB4MDgsXG4gIDB4YWEsXG4gIDB4MDAsXG4gIDB4NTUsXG4gIDB4MDAsXG4gIDB4YWEsXG4gIDB4YWEsXG4gIDB4NTUsXG4gIDB4YWEsXG4gIDB4NTUsXG4gIDB4YWEsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4ZjAsXG4gIDB4MTAsXG4gIDB4ZjAsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4ZmMsXG4gIDB4MDAsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4ZjcsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4ZjQsXG4gIDB4MDQsXG4gIDB4ZmMsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTcsXG4gIDB4MTAsXG4gIDB4MWYsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MWYsXG4gIDB4MTAsXG4gIDB4MWYsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MWYsXG4gIDB4MDAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4ZjAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MWYsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MWYsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4ZjAsXG4gIDB4MTAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4ZmYsXG4gIDB4MTAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MTQsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MWYsXG4gIDB4MTAsXG4gIDB4MTcsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmMsXG4gIDB4MDQsXG4gIDB4ZjQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTcsXG4gIDB4MTAsXG4gIDB4MTcsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4ZjQsXG4gIDB4MDQsXG4gIDB4ZjQsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4ZjcsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4ZjcsXG4gIDB4MDAsXG4gIDB4ZjcsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTcsXG4gIDB4MTQsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MWYsXG4gIDB4MTAsXG4gIDB4MWYsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4ZjQsXG4gIDB4MTQsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4ZjAsXG4gIDB4MTAsXG4gIDB4ZjAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MWYsXG4gIDB4MTAsXG4gIDB4MWYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MWYsXG4gIDB4MTQsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmMsXG4gIDB4MTQsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZjAsXG4gIDB4MTAsXG4gIDB4ZjAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4ZmYsXG4gIDB4MTAsXG4gIDB4ZmYsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4MTQsXG4gIDB4ZmYsXG4gIDB4MTQsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MWYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZjAsXG4gIDB4MTAsXG4gIDB4ZmYsXG4gIDB4ZmYsXG4gIDB4ZmYsXG4gIDB4ZmYsXG4gIDB4ZmYsXG4gIDB4ZjAsXG4gIDB4ZjAsXG4gIDB4ZjAsXG4gIDB4ZjAsXG4gIDB4ZjAsXG4gIDB4ZmYsXG4gIDB4ZmYsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4ZmYsXG4gIDB4MGYsXG4gIDB4MGYsXG4gIDB4MGYsXG4gIDB4MGYsXG4gIDB4MGYsXG4gIDB4MzgsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4MzgsXG4gIDB4NDQsXG4gIDB4N2MsXG4gIDB4MmEsXG4gIDB4MmEsXG4gIDB4M2UsXG4gIDB4MTQsXG4gIDB4N2UsXG4gIDB4MDIsXG4gIDB4MDIsXG4gIDB4MDYsXG4gIDB4MDYsXG4gIDB4MDIsXG4gIDB4N2UsXG4gIDB4MDIsXG4gIDB4N2UsXG4gIDB4MDIsXG4gIDB4NjMsXG4gIDB4NTUsXG4gIDB4NDksXG4gIDB4NDEsXG4gIDB4NjMsXG4gIDB4MzgsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4M2MsXG4gIDB4MDQsXG4gIDB4NDAsXG4gIDB4N2UsXG4gIDB4MjAsXG4gIDB4MWUsXG4gIDB4MjAsXG4gIDB4MDYsXG4gIDB4MDIsXG4gIDB4N2UsXG4gIDB4MDIsXG4gIDB4MDIsXG4gIDB4OTksXG4gIDB4YTUsXG4gIDB4ZTcsXG4gIDB4YTUsXG4gIDB4OTksXG4gIDB4MWMsXG4gIDB4MmEsXG4gIDB4NDksXG4gIDB4MmEsXG4gIDB4MWMsXG4gIDB4NGMsXG4gIDB4NzIsXG4gIDB4MDEsXG4gIDB4NzIsXG4gIDB4NGMsXG4gIDB4MzAsXG4gIDB4NGEsXG4gIDB4NGQsXG4gIDB4NGQsXG4gIDB4MzAsXG4gIDB4MzAsXG4gIDB4NDgsXG4gIDB4NzgsXG4gIDB4NDgsXG4gIDB4MzAsXG4gIDB4YmMsXG4gIDB4NjIsXG4gIDB4NWEsXG4gIDB4NDYsXG4gIDB4M2QsXG4gIDB4M2UsXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4NDksXG4gIDB4MDAsXG4gIDB4N2UsXG4gIDB4MDEsXG4gIDB4MDEsXG4gIDB4MDEsXG4gIDB4N2UsXG4gIDB4MmEsXG4gIDB4MmEsXG4gIDB4MmEsXG4gIDB4MmEsXG4gIDB4MmEsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4NWYsXG4gIDB4NDQsXG4gIDB4NDQsXG4gIDB4NDAsXG4gIDB4NTEsXG4gIDB4NGEsXG4gIDB4NDQsXG4gIDB4NDAsXG4gIDB4NDAsXG4gIDB4NDQsXG4gIDB4NGEsXG4gIDB4NTEsXG4gIDB4NDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4ZmYsXG4gIDB4MDEsXG4gIDB4MDMsXG4gIDB4ZTAsXG4gIDB4ODAsXG4gIDB4ZmYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDgsXG4gIDB4MDgsXG4gIDB4NmIsXG4gIDB4NmIsXG4gIDB4MDgsXG4gIDB4MzYsXG4gIDB4MTIsXG4gIDB4MzYsXG4gIDB4MjQsXG4gIDB4MzYsXG4gIDB4MDYsXG4gIDB4MGYsXG4gIDB4MDksXG4gIDB4MGYsXG4gIDB4MDYsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MTgsXG4gIDB4MTgsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MTAsXG4gIDB4MTAsXG4gIDB4MDAsXG4gIDB4MzAsXG4gIDB4NDAsXG4gIDB4ZmYsXG4gIDB4MDEsXG4gIDB4MDEsXG4gIDB4MDAsXG4gIDB4MWYsXG4gIDB4MDEsXG4gIDB4MDEsXG4gIDB4MWUsXG4gIDB4MDAsXG4gIDB4MTksXG4gIDB4MWQsXG4gIDB4MTcsXG4gIDB4MTIsXG4gIDB4MDAsXG4gIDB4M2MsXG4gIDB4M2MsXG4gIDB4M2MsXG4gIDB4M2MsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG4gIDB4MDAsXG5dO1xuIl19
