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
class SainSmartTFT18LCD {
    constructor() {
        this.keys = ["vcc", "gnd", "scl", "sda", "dc", "res", "cs"];
        this.required = ["scl", "sda", "dc", "res", "cs"];
        this.displayIoNames = {
            vcc: "vcc",
            gnd: "gnd",
            scl: "scl",
            sda: "sda",
            dc: "dc",
            res: "res",
            cs: "cs",
        };
    }
    static info() {
        return {
            name: "SainSmartTFT18LCD",
        };
    }
    wired(obniz) {
        this.debugprint = false;
        this.obniz = obniz;
        this.io_dc = obniz.getIO(this.params.dc);
        this.io_res = obniz.getIO(this.params.res);
        this.io_cs = obniz.getIO(this.params.cs);
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.params.frequency = 16 * 1000 * 1000; // 16MHz
        this.params.mode = "master";
        this.params.clk = this.params.scl;
        this.params.mosi = this.params.sda;
        this.params.drive = "3v";
        this.spi = this.obniz.getSpiWithConfig(this.params);
        this.io_dc.output(true);
        this.io_cs.output(false);
        this.width = ST7735_TFTWIDTH;
        this.height = ST7735_TFTHEIGHT;
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
    _initG() {
        // initialize for Green Tab
        this.writeCommand(ST7735_SLPOUT); // Sleep out & booster on
        this.obniz.wait(120);
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
        this.write(ST7735_COLMOD, [ST7735_16bit]); // color format: 16bit/pixel
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
        const rotation = m % 4; // can't be higher than 3
        switch (rotation) {
            case 0:
                data = [MADCTL_MX | MADCTL_MY | MADCTL_RGB];
                this.width = ST7735_TFTWIDTH;
                this.height = ST7735_TFTHEIGHT;
                break;
            case 1:
                data = [MADCTL_MY | MADCTL_MV | MADCTL_RGB];
                this.width = ST7735_TFTHEIGHT;
                this.height = ST7735_TFTWIDTH;
                break;
            case 2:
                data = [MADCTL_RGB];
                this.width = ST7735_TFTWIDTH;
                this.height = ST7735_TFTHEIGHT;
                break;
            case 3:
                data = [MADCTL_MX | MADCTL_MV | MADCTL_RGB];
                this.width = ST7735_TFTHEIGHT;
                this.height = ST7735_TFTWIDTH;
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
        this.setAddrWindow(x, y, x + w - 1, y + h - 1);
        const hi = color >> 8;
        const lo = color & 0xff;
        const data = [];
        for (y = h; y > 0; y--) {
            for (x = w; x > 0; x--) {
                data.push(hi);
                data.push(lo);
            }
        }
        this._writeBuffer(data);
        this._writeBuffer(); // for flush
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
        if (x >= this.width || y >= this.height) {
            return;
        }
        if (y + h - 1 >= this.height) {
            h = this.height - y;
        }
        this.setAddrWindow(x, y, x, y + h - 1);
        const hi = color >> 8;
        const lo = color & 0xff;
        const data = [];
        while (h--) {
            data.push(hi);
            data.push(lo);
        }
        this.writeData(data);
    }
    drawHLine(x, y, w, color) {
        if (x >= this.width || y >= this.height) {
            return;
        }
        if (x + w - 1 >= this.width) {
            w = this.width - x;
        }
        this.setAddrWindow(x, y, x + w - 1, y);
        const hi = color >> 8;
        const lo = color & 0xff;
        const data = [];
        while (w--) {
            data.push(hi);
            data.push(lo);
        }
        this.writeData(data);
    }
    drawLine(x0, y0, x1, y1, color) {
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
        this.setAddrWindow(x, y, x + 1, y + 1);
        this.writeData([color >> 8, color & 0xff]);
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
    rawBound16(x, y, width, height, pixels) {
        const rgb = [];
        pixels.forEach((v) => {
            rgb.push((v & 0xff00) >> 8);
            rgb.push(v & 0xff);
        });
        this.setAddrWindow(x, y, x + width - 1, y + height - 1);
        this._writeBuffer(rgb);
        this._writeBuffer(); // for flush
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
                rgb.push(r);
                rgb.push(g);
                rgb.push(b);
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
    rawBound(x, y, width, height, pixels) {
        const rgb = [];
        pixels.forEach((v) => {
            rgb.push((v & 0xff0000) >> 16);
            rgb.push((v & 0xff00) >> 8);
            rgb.push(v & 0xff);
        });
        this.write(ST7735_COLMOD, [ST7735_18bit]); // 18bit/pixel
        this.setAddrWindow(x, y, x + width - 1, y + height - 1);
        this._writeBuffer(rgb);
        this._writeBuffer(); // for flush
        this.write(ST7735_COLMOD, [ST7735_16bit]); // 16bit/pixel
    }
    raw(pixels) {
        this.rawBound(0, 0, this.width, this.height, pixels);
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
exports.default = SainSmartTFT18LCD;
// ----------------------------------------------------------
// commands
// const INITR_GREENTAB = 0x0;
// const INITR_REDTAB = 0x1;
// const INITR_BLACKTAB = 0x2;
const ST7735_TFTWIDTH = 128;
const ST7735_TFTHEIGHT = 160;
// const ST7735_NOP = 0x00;
// const ST7735_SWRESET = 0x01;
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
// const ST7735_PTLAR = 0x30;
const ST7735_COLMOD = 0x3a;
const ST7735_MADCTL = 0x36;
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
// Color definitions
// const ST7735_BLACK = 0x0000;
// const ST7735_BLUE = 0x001f;
// const ST7735_RED = 0xf800;
// const ST7735_GREEN = 0x07e0;
// const ST7735_CYAN = 0x07ff;
// const ST7735_MAGENTA = 0xf81f;
// const ST7735_YELLOW = 0xffe0;
// const ST7735_WHITE = 0xffff;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXNwbGF5L1NhaW5TbWFydFRGVDE4TENEL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsOENBQThDO0FBQzlDLE1BQU0saUJBQWlCO0lBdUJyQjtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixFQUFFLEVBQUUsSUFBSTtZQUNSLEdBQUcsRUFBRSxLQUFLO1lBQ1YsRUFBRSxFQUFFLElBQUk7U0FDVCxDQUFDO0lBQ0osQ0FBQztJQWxDTSxNQUFNLENBQUMsSUFBSTtRQUNoQixPQUFPO1lBQ0wsSUFBSSxFQUFFLG1CQUFtQjtTQUMxQixDQUFDO0lBQ0osQ0FBQztJQWdDTSxLQUFLLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMs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QUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTztRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRO1FBRTVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxhQUFhLENBQUMsQ0FBTSxFQUFFLENBQU0sRUFBRSxDQUFNLEVBQUUsQ0FBTSxFQUFFLENBQU0sRUFBRSxLQUFVO1FBQ3JFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FB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Q0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7Q0FDTCxDQUFDIiwiZmlsZSI6InNyYy9wYXJ0cy9EaXNwbGF5L1NhaW5TbWFydFRGVDE4TENEL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU2FpblNtYXJ0IFNUNzczNSAxLjhcIiBURlQgTENEIDEyOHgxNjAgcGl4ZWxcbmNsYXNzIFNhaW5TbWFydFRGVDE4TENEIHtcblxuICBwdWJsaWMgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiU2FpblNtYXJ0VEZUMThMQ0RcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIGtleXM6IGFueTtcbiAgcHVibGljIHJlcXVpcmVkOiBhbnk7XG4gIHB1YmxpYyBkaXNwbGF5SW9OYW1lczogYW55O1xuICBwdWJsaWMgZGVidWdwcmludDogYW55O1xuICBwdWJsaWMgb2JuaXo6IGFueTtcbiAgcHVibGljIGlvX2RjOiBhbnk7XG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcbiAgcHVibGljIGlvX3JlczogYW55O1xuICBwdWJsaWMgaW9fY3M6IGFueTtcbiAgcHVibGljIHNwaTogYW55O1xuICBwdWJsaWMgd2lkdGg6IGFueTtcbiAgcHVibGljIGhlaWdodDogYW55O1xuICBwdWJsaWMgd3JpdGVCdWZmZXI6IGFueTtcbiAgcHVibGljIGNvbG9yOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0gW1widmNjXCIsIFwiZ25kXCIsIFwic2NsXCIsIFwic2RhXCIsIFwiZGNcIiwgXCJyZXNcIiwgXCJjc1wiXTtcbiAgICB0aGlzLnJlcXVpcmVkID0gW1wic2NsXCIsIFwic2RhXCIsIFwiZGNcIiwgXCJyZXNcIiwgXCJjc1wiXTtcblxuICAgIHRoaXMuZGlzcGxheUlvTmFtZXMgPSB7XG4gICAgICB2Y2M6IFwidmNjXCIsXG4gICAgICBnbmQ6IFwiZ25kXCIsXG4gICAgICBzY2w6IFwic2NsXCIsXG4gICAgICBzZGE6IFwic2RhXCIsXG4gICAgICBkYzogXCJkY1wiLFxuICAgICAgcmVzOiBcInJlc1wiLFxuICAgICAgY3M6IFwiY3NcIixcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHdpcmVkKG9ibml6OiBhbnkpIHtcbiAgICB0aGlzLmRlYnVncHJpbnQgPSBmYWxzZTtcbiAgICB0aGlzLm9ibml6ID0gb2JuaXo7XG4gICAgdGhpcy5pb19kYyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmRjKTtcbiAgICB0aGlzLmlvX3JlcyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLnJlcyk7XG4gICAgdGhpcy5pb19jcyA9IG9ibml6LmdldElPKHRoaXMucGFyYW1zLmNzKTtcblxuICAgIHRoaXMub2JuaXouc2V0VmNjR25kKHRoaXMucGFyYW1zLnZjYywgdGhpcy5wYXJhbXMuZ25kLCBcIjV2XCIpO1xuICAgIHRoaXMucGFyYW1zLmZyZXF1ZW5jeSA9IDE2ICogMTAwMCAqIDEwMDA7IC8vIDE2TUh6XG4gICAgdGhpcy5wYXJhbXMubW9kZSA9IFwibWFzdGVyXCI7XG4gICAgdGhpcy5wYXJhbXMuY2xrID0gdGhpcy5wYXJhbXMuc2NsO1xuICAgIHRoaXMucGFyYW1zLm1vc2kgPSB0aGlzLnBhcmFtcy5zZGE7XG4gICAgdGhpcy5wYXJhbXMuZHJpdmUgPSBcIjN2XCI7XG4gICAgdGhpcy5zcGkgPSB0aGlzLm9ibml6LmdldFNwaVdpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuXG4gICAgdGhpcy5pb19kYy5vdXRwdXQodHJ1ZSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuXG4gICAgdGhpcy53aWR0aCA9IFNUNzczNV9URlRXSURUSDtcbiAgICB0aGlzLmhlaWdodCA9IFNUNzczNV9URlRIRUlHSFQ7XG5cbiAgICB0aGlzLndyaXRlQnVmZmVyID0gW107IC8vIDEwMjRieXRlcyBidWZmZXJyaW5nXG5cbiAgICB0aGlzLl9zZXRQcmVzZXRDb2xvcigpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHVibGljIHByaW50X2RlYnVnKHY6IGFueSkge1xuICAgIGlmICh0aGlzLmRlYnVncHJpbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBcIlNhaW5TbWFydFRGVDE4TENEOiBcIiArIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbihcIlwiKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9kZWFkU2xlZXAod2FpdE1zZWM6IGFueSkge1xuICAgIGNvbnN0IHN0YXJ0TXNlYzogYW55ID0gbmV3IERhdGUoKTtcbiAgICB3aGlsZSAoKG5ldyBEYXRlKCkgYXMgYW55KSAtIHN0YXJ0TXNlYyA8IHdhaXRNc2VjKSB7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9yZXNldCgpIHtcbiAgICB0aGlzLmlvX3Jlcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuX2RlYWRTbGVlcCgxMCk7XG4gICAgdGhpcy5pb19yZXMub3V0cHV0KHRydWUpO1xuICAgIHRoaXMuX2RlYWRTbGVlcCgxMCk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGVDb21tYW5kKGNtZDogYW55KSB7XG4gICAgdGhpcy5pb19kYy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KGZhbHNlKTtcbiAgICB0aGlzLnNwaS53cml0ZShbY21kXSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQodHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGVEYXRhKGRhdGE6IGFueSkge1xuICAgIHRoaXMuaW9fZGMub3V0cHV0KHRydWUpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KGZhbHNlKTtcbiAgICB0aGlzLnNwaS53cml0ZShkYXRhKTtcbiAgICB0aGlzLmlvX2NzLm91dHB1dCh0cnVlKTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZShjbWQ6IGFueSwgZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMud3JpdGVDb21tYW5kKGNtZCk7XG4gICAgdGhpcy53cml0ZURhdGEoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgYXN5bmN3YWl0KCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnNwaS53cml0ZVdhaXQoWzB4MDBdKTtcbiAgfVxuXG4gIHB1YmxpYyBfd3JpdGVGbHVzaCgpIHtcbiAgICB3aGlsZSAodGhpcy53cml0ZUJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy53cml0ZUJ1ZmZlci5sZW5ndGggPiAxMDI0KSB7XG4gICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMud3JpdGVCdWZmZXIuc2xpY2UoMCwgMTAyNCk7XG4gICAgICAgIHRoaXMud3JpdGVEYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLndyaXRlQnVmZmVyLnNwbGljZSgwLCAxMDI0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLndyaXRlRGF0YSh0aGlzLndyaXRlQnVmZmVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndyaXRlQnVmZmVyID0gW107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF93cml0ZUJ1ZmZlcihkYXRhPzogYW55KSB7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLndyaXRlQnVmZmVyID0gdGhpcy53cml0ZUJ1ZmZlci5jb25jYXQoZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dyaXRlRmx1c2goKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY29sb3IxNihyOiBhbnksIGc6IGFueSwgYjogYW55KSB7XG4gICAgLy8gIDFzdCBieXRlICAociAmIDB4RjggfCBnID4+IDUpXG4gICAgLy8gIDJuZCBieXRlICAoZyAmIDB4RkMgPDwgMyB8IGIgPj4gMylcbiAgICByZXR1cm4gKChyICYgMHhmOCkgPDwgOCkgfCAoKGcgJiAweGZjKSA8PCAzKSB8IChiID4+IDMpO1xuICB9XG5cbiAgcHVibGljIF9pbml0RygpIHtcbiAgICAvLyBpbml0aWFsaXplIGZvciBHcmVlbiBUYWJcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfU0xQT1VUKTsgLy8gU2xlZXAgb3V0ICYgYm9vc3RlciBvblxuICAgIHRoaXMub2JuaXoud2FpdCgxMjApO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0ZSTUNUUjEsIFsweDAxLCAweDJjLCAweDJkXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfRlJNQ1RSMiwgWzB4MDEsIDB4MmMsIDB4MmRdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9GUk1DVFIzLCBbMHgwMSwgMHgyYywgMHgyZCwgMHgwMSwgMHgyYywgMHgyZF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0lOVkNUUiwgWzB4MDddKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9QV0NUUjEsIFsweGEyLCAweDAyLCAweDg0XSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUFdDVFIyLCBbMHhjNV0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1BXQ1RSMywgWzB4MGEsIDB4MDBdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9QV0NUUjQsIFsweDhhLCAweDJhXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUFdDVFI1LCBbMHg4YSwgMHhlZV0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1ZNQ1RSMSwgWzB4MGVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9HTUNUUlAxLCBbXG4gICAgICAweDAyLFxuICAgICAgMHgxYyxcbiAgICAgIDB4MDcsXG4gICAgICAweDEyLFxuICAgICAgMHgzNyxcbiAgICAgIDB4MzIsXG4gICAgICAweDI5LFxuICAgICAgMHgyZCxcbiAgICAgIDB4MjksXG4gICAgICAweDI1LFxuICAgICAgMHgyYixcbiAgICAgIDB4MzksXG4gICAgICAweDAwLFxuICAgICAgMHgwMSxcbiAgICAgIDB4MDMsXG4gICAgICAweDEwLFxuICAgIF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0dNQ1RSTjEsIFtcbiAgICAgIDB4MDMsXG4gICAgICAweDFkLFxuICAgICAgMHgwNyxcbiAgICAgIDB4MDYsXG4gICAgICAweDJlLFxuICAgICAgMHgyYyxcbiAgICAgIDB4MjksXG4gICAgICAweDJkLFxuICAgICAgMHgyZSxcbiAgICAgIDB4MmUsXG4gICAgICAweDM3LFxuICAgICAgMHgzZixcbiAgICAgIDB4MDAsXG4gICAgICAweDAwLFxuICAgICAgMHgwMixcbiAgICAgIDB4MTAsXG4gICAgXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfQ09MTU9ELCBbU1Q3NzM1XzE2Yml0XSk7IC8vIGNvbG9yIGZvcm1hdDogMTZiaXQvcGl4ZWxcbiAgfVxuXG4gIHB1YmxpYyBpbml0KCkge1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgdGhpcy5faW5pdEcoKTtcbiAgICB0aGlzLnNldERpc3BsYXlPbigpO1xuICAgIHRoaXMuc2V0Um90YXRpb24oMCk7XG4gIH1cblxuICBwdWJsaWMgc2V0RGlzcGxheU9uKCkge1xuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9ESVNQT04pO1xuICB9XG5cbiAgcHVibGljIHNldERpc3BsYXlPZmYoKSB7XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X0RJU1BPRkYpO1xuICB9XG5cbiAgcHVibGljIHNldERpc3BsYXkob246IGFueSkge1xuICAgIGlmIChvbiA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5zZXREaXNwbGF5T24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXREaXNwbGF5T2ZmKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldEludmVyc2lvbk9uKCkge1xuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9JTlZPTik7XG4gIH1cblxuICBwdWJsaWMgc2V0SW52ZXJzaW9uT2ZmKCkge1xuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9JTlZPRkYpO1xuICB9XG5cbiAgcHVibGljIHNldEludmVyc2lvbihpbnZlcnNpb246IGFueSkge1xuICAgIGlmIChpbnZlcnNpb24gPT09IHRydWUpIHtcbiAgICAgIHRoaXMuc2V0SW52ZXJzaW9uT24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRJbnZlcnNpb25PZmYoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0Um90YXRpb24obTogYW55KSB7XG4gICAgY29uc3QgTUFEQ1RMX01ZOiBhbnkgPSAweDgwO1xuICAgIGNvbnN0IE1BRENUTF9NWDogYW55ID0gMHg0MDtcbiAgICBjb25zdCBNQURDVExfTVY6IGFueSA9IDB4MjA7XG4gICAgLy8gY29uc3QgTUFEQ1RMX01MID0gMHgxMDtcbiAgICBjb25zdCBNQURDVExfUkdCOiBhbnkgPSAweDAwOyAvLyBhbHdheXMgUkdCLCBuZXZlciBCR1JcbiAgICAvLyBjb25zdCBNQURDVExfTUggPSAweDA0O1xuXG4gICAgbGV0IGRhdGE6IGFueTtcbiAgICBjb25zdCByb3RhdGlvbjogYW55ID0gbSAlIDQ7IC8vIGNhbid0IGJlIGhpZ2hlciB0aGFuIDNcbiAgICBzd2l0Y2ggKHJvdGF0aW9uKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRhdGEgPSBbTUFEQ1RMX01YIHwgTUFEQ1RMX01ZIHwgTUFEQ1RMX1JHQl07XG4gICAgICAgIHRoaXMud2lkdGggPSBTVDc3MzVfVEZUV0lEVEg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gU1Q3NzM1X1RGVEhFSUdIVDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGRhdGEgPSBbTUFEQ1RMX01ZIHwgTUFEQ1RMX01WIHwgTUFEQ1RMX1JHQl07XG4gICAgICAgIHRoaXMud2lkdGggPSBTVDc3MzVfVEZUSEVJR0hUO1xuICAgICAgICB0aGlzLmhlaWdodCA9IFNUNzczNV9URlRXSURUSDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGRhdGEgPSBbTUFEQ1RMX1JHQl07XG4gICAgICAgIHRoaXMud2lkdGggPSBTVDc3MzVfVEZUV0lEVEg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gU1Q3NzM1X1RGVEhFSUdIVDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGRhdGEgPSBbTUFEQ1RMX01YIHwgTUFEQ1RMX01WIHwgTUFEQ1RMX1JHQl07XG4gICAgICAgIHRoaXMud2lkdGggPSBTVDc3MzVfVEZUSEVJR0hUO1xuICAgICAgICB0aGlzLmhlaWdodCA9IFNUNzczNV9URlRXSURUSDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X01BRENUTCwgZGF0YSk7XG4gICAgdGhpcy5zZXRBZGRyV2luZG93KDAsIDAsIHRoaXMud2lkdGggLSAxLCB0aGlzLmhlaWdodCAtIDEpO1xuICB9XG5cbiAgcHVibGljIHNldEFkZHJXaW5kb3coeDA6IGFueSwgeTA6IGFueSwgeDE6IGFueSwgeTE6IGFueSkge1xuICAgIHRoaXMucHJpbnRfZGVidWcoXG4gICAgICBgc2V0QWRkcldpbmRvdzogKHgwOiAke3gwfSwgeTA6ICR7eTB9KSAtICh4MTogJHt4MX0sIHkxOiAke3kxfSlgLFxuICAgICk7XG5cbiAgICBpZiAoeDAgPCAwKSB7XG4gICAgICB4MCA9IDA7XG4gICAgfVxuICAgIGlmICh5MCA8IDApIHtcbiAgICAgIHkwID0gMDtcbiAgICB9XG4gICAgaWYgKHgxIDwgMCkge1xuICAgICAgeDEgPSAwO1xuICAgIH1cbiAgICBpZiAoeTEgPCAwKSB7XG4gICAgICB5MSA9IDA7XG4gICAgfVxuXG4gICAgLy8gY29sdW1uIGFkZHIgc2V0XG4gICAgdGhpcy53cml0ZShTVDc3MzVfQ0FTRVQsIFsweDAwLCB4MCwgMHgwMCwgeDFdKTsgLy8gWFNUQVJULVhFTkRcbiAgICAvLyByb3cgYWRkciBzZXRcbiAgICB0aGlzLndyaXRlKFNUNzczNV9SQVNFVCwgWzB4MDAsIHkwLCAweDAwLCB5MV0pOyAvLyBZU1RBUlQtWUVORFxuICAgIC8vIHdyaXRlIHRvIFJBTVxuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9SQU1XUik7XG4gICAgdGhpcy53cml0ZUJ1ZmZlciA9IFtdO1xuICB9XG5cbiAgLy8gX19zd2FwKGEsIGIpIHsgbGV0IHQgPSBhOyBhID0gYjsgYiA9IHQ7IH1cblxuICBwdWJsaWMgZmlsbFNjcmVlbihjb2xvcjogYW55KSB7XG4gICAgdGhpcy5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgY29sb3IpO1xuICB9XG5cbiAgcHVibGljIGZpbGxSZWN0KHg6IGFueSwgeTogYW55LCB3OiBhbnksIGg6IGFueSwgY29sb3I6IGFueSkge1xuICAgIGlmICh4ID49IHRoaXMud2lkdGggfHwgeSA+PSB0aGlzLmhlaWdodCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoeCArIHcgLSAxID49IHRoaXMud2lkdGgpIHtcbiAgICAgIHcgPSB0aGlzLndpZHRoIC0geDtcbiAgICB9XG4gICAgaWYgKHkgKyBoIC0gMSA+PSB0aGlzLmhlaWdodCkge1xuICAgICAgaCA9IHRoaXMuaGVpZ2h0IC0geTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEFkZHJXaW5kb3coeCwgeSwgeCArIHcgLSAxLCB5ICsgaCAtIDEpO1xuXG4gICAgY29uc3QgaGk6IGFueSA9IGNvbG9yID4+IDg7XG4gICAgY29uc3QgbG86IGFueSA9IGNvbG9yICYgMHhmZjtcbiAgICBjb25zdCBkYXRhOiBhbnkgPSBbXTtcblxuICAgIGZvciAoeSA9IGg7IHkgPiAwOyB5LS0pIHtcbiAgICAgIGZvciAoeCA9IHc7IHggPiAwOyB4LS0pIHtcbiAgICAgICAgZGF0YS5wdXNoKGhpKTtcbiAgICAgICAgZGF0YS5wdXNoKGxvKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIoZGF0YSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIoKTsgLy8gZm9yIGZsdXNoXG4gIH1cblxuICBwdWJsaWMgZHJhd1JlY3QoeDogYW55LCB5OiBhbnksIHc6IGFueSwgaDogYW55LCBjb2xvcjogYW55KSB7XG4gICAgdGhpcy5kcmF3SExpbmUoeCwgeSwgdywgY29sb3IpO1xuICAgIHRoaXMuZHJhd0hMaW5lKHgsIHkgKyBoIC0gMSwgdywgY29sb3IpO1xuICAgIHRoaXMuZHJhd1ZMaW5lKHgsIHksIGgsIGNvbG9yKTtcbiAgICB0aGlzLmRyYXdWTGluZSh4ICsgdyAtIDEsIHksIGgsIGNvbG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3Q2lyY2xlKHgwOiBhbnksIHkwOiBhbnksIHI6IGFueSwgY29sb3I6IGFueSkge1xuICAgIGxldCBmOiBhbnkgPSAxIC0gcjtcbiAgICBsZXQgZGRGX3g6IGFueSA9IDE7XG4gICAgbGV0IGRkRl95OiBhbnkgPSAtMiAqIHI7XG4gICAgbGV0IHg6IGFueSA9IDA7XG4gICAgbGV0IHk6IGFueSA9IHI7XG5cbiAgICB0aGlzLmRyYXdQaXhlbCh4MCwgeTAgKyByLCBjb2xvcik7XG4gICAgdGhpcy5kcmF3UGl4ZWwoeDAsIHkwIC0gciwgY29sb3IpO1xuICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgciwgeTAsIGNvbG9yKTtcbiAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHIsIHkwLCBjb2xvcik7XG5cbiAgICB3aGlsZSAoeCA8IHkpIHtcbiAgICAgIGlmIChmID49IDApIHtcbiAgICAgICAgeS0tO1xuICAgICAgICBkZEZfeSArPSAyO1xuICAgICAgICBmICs9IGRkRl95O1xuICAgICAgfVxuICAgICAgeCsrO1xuICAgICAgZGRGX3ggKz0gMjtcbiAgICAgIGYgKz0gZGRGX3g7XG5cbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeCwgeTAgKyB5LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHgsIHkwICsgeSwgY29sb3IpO1xuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB4LCB5MCAtIHksIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geCwgeTAgLSB5LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHksIHkwICsgeCwgY29sb3IpO1xuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgLSB5LCB5MCArIHgsIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeSwgeTAgLSB4LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHksIHkwIC0geCwgY29sb3IpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBfZHJhd0NpcmNsZUhlbHBlcih4MDogYW55LCB5MDogYW55LCByOiBhbnksIGNvcm5lcm5hbWU6IGFueSwgY29sb3I6IGFueSkge1xuICAgIGxldCBmOiBhbnkgPSAxIC0gcjtcbiAgICBsZXQgZGRGX3g6IGFueSA9IDE7XG4gICAgbGV0IGRkRl95OiBhbnkgPSAtMiAqIHI7XG4gICAgbGV0IHg6IGFueSA9IDA7XG4gICAgbGV0IHk6IGFueSA9IHI7XG5cbiAgICB3aGlsZSAoeCA8IHkpIHtcbiAgICAgIGlmIChmID49IDApIHtcbiAgICAgICAgeS0tO1xuICAgICAgICBkZEZfeSArPSAyO1xuICAgICAgICBmICs9IGRkRl95O1xuICAgICAgfVxuICAgICAgeCsrO1xuICAgICAgZGRGX3ggKz0gMjtcbiAgICAgIGYgKz0gZGRGX3g7XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4NCkge1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHgsIHkwICsgeSwgY29sb3IpO1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHksIHkwICsgeCwgY29sb3IpO1xuICAgICAgfVxuICAgICAgaWYgKGNvcm5lcm5hbWUgJiAweDIpIHtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB4LCB5MCAtIHksIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB5LCB5MCAtIHgsIGNvbG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb3JuZXJuYW1lICYgMHg4KSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geSwgeTAgKyB4LCBjb2xvcik7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geCwgeTAgKyB5LCBjb2xvcik7XG4gICAgICB9XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4MSkge1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHksIHkwIC0geCwgY29sb3IpO1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHgsIHkwIC0geSwgY29sb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmaWxsQ2lyY2xlKHgwOiBhbnksIHkwOiBhbnksIHI6IGFueSwgY29sb3I6IGFueSkge1xuICAgIHRoaXMuZHJhd1ZMaW5lKHgwLCB5MCAtIHIsIDIgKiByICsgMSwgY29sb3IpO1xuICAgIHRoaXMuX2ZpbGxDaXJjbGVIZWxwZXIoeDAsIHkwLCByLCAzLCAwLCBjb2xvcik7XG4gIH1cblxuICBwdWJsaWMgX2ZpbGxDaXJjbGVIZWxwZXIoeDA6IGFueSwgeTA6IGFueSwgcjogYW55LCBjb3JuZXJuYW1lOiBhbnksIGRlbHRhOiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICBsZXQgZjogYW55ID0gMSAtIHI7XG4gICAgbGV0IGRkRl94OiBhbnkgPSAxO1xuICAgIGxldCBkZEZfeTogYW55ID0gLTIgKiByO1xuICAgIGxldCB4OiBhbnkgPSAwO1xuICAgIGxldCB5OiBhbnkgPSByO1xuXG4gICAgd2hpbGUgKHggPCB5KSB7XG4gICAgICBpZiAoZiA+PSAwKSB7XG4gICAgICAgIHktLTtcbiAgICAgICAgZGRGX3kgKz0gMjtcbiAgICAgICAgZiArPSBkZEZfeTtcbiAgICAgIH1cbiAgICAgIHgrKztcbiAgICAgIGRkRl94ICs9IDI7XG4gICAgICBmICs9IGRkRl94O1xuXG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4MSkge1xuICAgICAgICB0aGlzLmRyYXdWTGluZSh4MCArIHgsIHkwIC0geSwgMiAqIHkgKyAxICsgZGVsdGEsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3VkxpbmUoeDAgKyB5LCB5MCAtIHgsIDIgKiB4ICsgMSArIGRlbHRhLCBjb2xvcik7XG4gICAgICB9XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4Mikge1xuICAgICAgICB0aGlzLmRyYXdWTGluZSh4MCAtIHgsIHkwIC0geSwgMiAqIHkgKyAxICsgZGVsdGEsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3VkxpbmUoeDAgLSB5LCB5MCAtIHgsIDIgKiB4ICsgMSArIGRlbHRhLCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRyYXdSb3VuZFJlY3QoeDogYW55LCB5OiBhbnksIHc6IGFueSwgaDogYW55LCByOiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICB0aGlzLmRyYXdITGluZSh4ICsgciwgeSwgdyAtIDIgKiByLCBjb2xvcik7IC8vIFRvcFxuICAgIHRoaXMuZHJhd0hMaW5lKHggKyByLCB5ICsgaCAtIDEsIHcgLSAyICogciwgY29sb3IpOyAvLyBCb3R0b21cbiAgICB0aGlzLmRyYXdWTGluZSh4LCB5ICsgciwgaCAtIDIgKiByLCBjb2xvcik7IC8vIExlZnRcbiAgICB0aGlzLmRyYXdWTGluZSh4ICsgdyAtIDEsIHkgKyByLCBoIC0gMiAqIHIsIGNvbG9yKTsgLy8gUmlnaHRcblxuICAgIHRoaXMuX2RyYXdDaXJjbGVIZWxwZXIoeCArIHIsIHkgKyByLCByLCAxLCBjb2xvcik7XG4gICAgdGhpcy5fZHJhd0NpcmNsZUhlbHBlcih4ICsgdyAtIHIgLSAxLCB5ICsgciwgciwgMiwgY29sb3IpO1xuICAgIHRoaXMuX2RyYXdDaXJjbGVIZWxwZXIoeCArIHcgLSByIC0gMSwgeSArIGggLSByIC0gMSwgciwgNCwgY29sb3IpO1xuICAgIHRoaXMuX2RyYXdDaXJjbGVIZWxwZXIoeCArIHIsIHkgKyBoIC0gciAtIDEsIHIsIDgsIGNvbG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBmaWxsUm91bmRSZWN0KHg6IGFueSwgeTogYW55LCB3OiBhbnksIGg6IGFueSwgcjogYW55LCBjb2xvcjogYW55KSB7XG4gICAgdGhpcy5maWxsUmVjdCh4ICsgciwgeSwgdyAtIDIgKiByLCBoLCBjb2xvcik7XG5cbiAgICB0aGlzLl9maWxsQ2lyY2xlSGVscGVyKHggKyB3IC0gciAtIDEsIHkgKyByLCByLCAxLCBoIC0gMiAqIHIgLSAxLCBjb2xvcik7XG4gICAgdGhpcy5fZmlsbENpcmNsZUhlbHBlcih4ICsgciwgeSArIHIsIHIsIDIsIGggLSAyICogciAtIDEsIGNvbG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3VHJpYW5nbGUoeDA6IGFueSwgeTA6IGFueSwgeDE6IGFueSwgeTE6IGFueSwgeDI6IGFueSwgeTI6IGFueSwgY29sb3I6IGFueSkge1xuICAgIHRoaXMuZHJhd0xpbmUoeDAsIHkwLCB4MSwgeTEsIGNvbG9yKTtcbiAgICB0aGlzLmRyYXdMaW5lKHgxLCB5MSwgeDIsIHkyLCBjb2xvcik7XG4gICAgdGhpcy5kcmF3TGluZSh4MiwgeTIsIHgwLCB5MCwgY29sb3IpO1xuICB9XG5cbiAgcHVibGljIGZpbGxUcmlhbmdsZSh4MDogYW55LCB5MDogYW55LCB4MTogYW55LCB5MTogYW55LCB4MjogYW55LCB5MjogYW55LCBjb2xvcjogYW55KSB7XG4gICAgbGV0IGE6IGFueTtcbiAgICBsZXQgYjogYW55O1xuICAgIGxldCB5OiBhbnk7XG4gICAgbGV0IGxhc3Q6IGFueTtcblxuICAgIC8vIFNvcnQgY29vcmRpbmF0ZXMgYnkgWSBvcmRlciAoeTIgPj0geTEgPj0geTApXG4gICAgaWYgKHkwID4geTEpIHtcbiAgICAgIHkxID0gW3kwLCAoeTAgPSB5MSldWzBdOyAvLyB0aGlzLl9zd2FwKHkwLCB5MSk7XG4gICAgICB4MSA9IFt4MCwgKHgwID0geDEpXVswXTsgLy8gdGhpcy5fc3dhcCh4MCwgeDEpO1xuICAgIH1cbiAgICBpZiAoeTEgPiB5Mikge1xuICAgICAgeTIgPSBbeTEsICh5MSA9IHkyKV1bMF07IC8vIHRoaXMuX3N3YXAoeTIsIHkxKTtcbiAgICAgIHgyID0gW3gxLCAoeDEgPSB4MildWzBdOyAvLyB0aGlzLl9zd2FwKHgyLCB4MSk7XG4gICAgfVxuICAgIGlmICh5MCA+IHkxKSB7XG4gICAgICB5MSA9IFt5MCwgKHkwID0geTEpXVswXTsgLy8gdGhpcy5fc3dhcCh5MCwgeTEpO1xuICAgICAgeDEgPSBbeDAsICh4MCA9IHgxKV1bMF07IC8vIHRoaXMuX3N3YXAoeDAsIHgxKTtcbiAgICB9XG5cbiAgICBpZiAoeTAgPT09IHkyKSB7XG4gICAgICAvLyBIYW5kbGUgYXdrd2FyZCBhbGwtb24tc2FtZS1saW5lIGNhc2UgYXMgaXRzIG93biB0aGluZ1xuICAgICAgYSA9IGIgPSB4MDtcbiAgICAgIGlmICh4MSA8IGEpIHtcbiAgICAgICAgYSA9IHgxO1xuICAgICAgfSBlbHNlIGlmICh4MSA+IGIpIHtcbiAgICAgICAgYiA9IHgxO1xuICAgICAgfVxuICAgICAgaWYgKHgyIDwgYSkge1xuICAgICAgICBhID0geDI7XG4gICAgICB9IGVsc2UgaWYgKHgyID4gYikge1xuICAgICAgICBiID0geDI7XG4gICAgICB9XG4gICAgICB0aGlzLmRyYXdITGluZShhLCB5MCwgYiAtIGEgKyAxLCBjb2xvcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZHgwMTogYW55ID0geDEgLSB4MDtcbiAgICBjb25zdCBkeTAxOiBhbnkgPSB5MSAtIHkwO1xuICAgIGNvbnN0IGR4MDI6IGFueSA9IHgyIC0geDA7XG4gICAgY29uc3QgZHkwMjogYW55ID0geTIgLSB5MDtcbiAgICBjb25zdCBkeDEyOiBhbnkgPSB4MiAtIHgxO1xuICAgIGNvbnN0IGR5MTI6IGFueSA9IHkyIC0geTE7XG4gICAgbGV0IHNhOiBhbnkgPSAwO1xuICAgIGxldCBzYjogYW55ID0gMDtcblxuICAgIGlmICh5MSA9PT0geTIpIHtcbiAgICAgIGxhc3QgPSB5MTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFzdCA9IHkxIC0gMTtcbiAgICB9IC8vIHNraXAgaXRcblxuICAgIGZvciAoeSA9IHkwOyB5IDw9IGxhc3Q7IHkrKykge1xuICAgICAgYSA9IHgwICsgTWF0aC5mbG9vcihzYSAvIGR5MDEpO1xuICAgICAgYiA9IHgwICsgTWF0aC5mbG9vcihzYiAvIGR5MDIpO1xuICAgICAgc2EgKz0gZHgwMTtcbiAgICAgIHNiICs9IGR4MDI7XG4gICAgICBpZiAoYSA+IGIpIHtcbiAgICAgICAgYiA9IFthLCAoYSA9IGIpXVswXTtcbiAgICAgIH0gLy8gdGhpcy5fc3dhcChhLGIpO1xuICAgICAgdGhpcy5kcmF3SExpbmUoYSwgeSwgYiAtIGEgKyAxLCBjb2xvcik7XG4gICAgfVxuXG4gICAgc2EgPSBkeDEyICogKHkgLSB5MSk7XG4gICAgc2IgPSBkeDAyICogKHkgLSB5MCk7XG4gICAgZm9yICg7IHkgPD0geTI7IHkrKykge1xuICAgICAgYSA9IHgxICsgTWF0aC5mbG9vcihzYSAvIGR5MTIpO1xuICAgICAgYiA9IHgwICsgTWF0aC5mbG9vcihzYiAvIGR5MDIpO1xuICAgICAgc2EgKz0gZHgxMjtcbiAgICAgIHNiICs9IGR4MDI7XG4gICAgICBpZiAoYSA+IGIpIHtcbiAgICAgICAgYiA9IFthLCAoYSA9IGIpXVswXTtcbiAgICAgIH0gLy8gdGhpcy5fc3dhcChhLGIpO1xuICAgICAgdGhpcy5kcmF3SExpbmUoYSwgeSwgYiAtIGEgKyAxLCBjb2xvcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRyYXdWTGluZSh4OiBhbnksIHk6IGFueSwgaDogYW55LCBjb2xvcjogYW55KSB7XG4gICAgaWYgKHggPj0gdGhpcy53aWR0aCB8fCB5ID49IHRoaXMuaGVpZ2h0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh5ICsgaCAtIDEgPj0gdGhpcy5oZWlnaHQpIHtcbiAgICAgIGggPSB0aGlzLmhlaWdodCAtIHk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgsIHksIHgsIHkgKyBoIC0gMSk7XG5cbiAgICBjb25zdCBoaTogYW55ID0gY29sb3IgPj4gODtcbiAgICBjb25zdCBsbzogYW55ID0gY29sb3IgJiAweGZmO1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IFtdO1xuICAgIHdoaWxlIChoLS0pIHtcbiAgICAgIGRhdGEucHVzaChoaSk7XG4gICAgICBkYXRhLnB1c2gobG8pO1xuICAgIH1cbiAgICB0aGlzLndyaXRlRGF0YShkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3SExpbmUoeDogYW55LCB5OiBhbnksIHc6IGFueSwgY29sb3I6IGFueSkge1xuICAgIGlmICh4ID49IHRoaXMud2lkdGggfHwgeSA+PSB0aGlzLmhlaWdodCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoeCArIHcgLSAxID49IHRoaXMud2lkdGgpIHtcbiAgICAgIHcgPSB0aGlzLndpZHRoIC0geDtcbiAgICB9XG5cbiAgICB0aGlzLnNldEFkZHJXaW5kb3coeCwgeSwgeCArIHcgLSAxLCB5KTtcblxuICAgIGNvbnN0IGhpOiBhbnkgPSBjb2xvciA+PiA4OyBjb25zdCBsbzogYW55ID0gY29sb3IgJiAweGZmO1xuICAgIGNvbnN0IGRhdGE6IGFueSA9IFtdO1xuICAgIHdoaWxlICh3LS0pIHtcbiAgICAgIGRhdGEucHVzaChoaSk7XG4gICAgICBkYXRhLnB1c2gobG8pO1xuICAgIH1cbiAgICB0aGlzLndyaXRlRGF0YShkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBkcmF3TGluZSh4MDogYW55LCB5MDogYW55LCB4MTogYW55LCB5MTogYW55LCBjb2xvcjogYW55KSB7XG4gICAgY29uc3Qgc3RlcDogYW55ID0gTWF0aC5hYnMoeTEgLSB5MCkgPiBNYXRoLmFicyh4MSAtIHgwKTtcbiAgICBpZiAoc3RlcCkge1xuICAgICAgeTAgPSBbeDAsICh4MCA9IHkwKV1bMF07IC8vIHRoaXMuX3N3YXAoeDAsIHkwKTtcbiAgICAgIHkxID0gW3gxLCAoeDEgPSB5MSldWzBdOyAvLyB0aGlzLl9zd2FwKHgxLCB5MSk7XG4gICAgfVxuICAgIGlmICh4MCA+IHgxKSB7XG4gICAgICB4MSA9IFt4MCwgKHgwID0geDEpXVswXTsgLy8gdGhpcy5fc3dhcCh4MCwgeDEpO1xuICAgICAgeTEgPSBbeTAsICh5MCA9IHkxKV1bMF07IC8vIHRoaXMuX3N3YXAoeTAsIHkxKTtcbiAgICB9XG5cbiAgICBjb25zdCBkeDogYW55ID0geDEgLSB4MDtcbiAgICBjb25zdCBkeTogYW55ID0gTWF0aC5hYnMoeTEgLSB5MCk7XG5cbiAgICBsZXQgZXJyOiBhbnkgPSBkeCAvIDI7XG4gICAgY29uc3QgeXN0ZXA6IGFueSA9IHkwIDwgeTEgPyAxIDogLTE7XG5cbiAgICBmb3IgKDsgeDAgPD0geDE7IHgwKyspIHtcbiAgICAgIGlmIChzdGVwKSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHkwLCB4MCwgY29sb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAsIHkwLCBjb2xvcik7XG4gICAgICB9XG4gICAgICBlcnIgLT0gZHk7XG4gICAgICBpZiAoZXJyIDwgMCkge1xuICAgICAgICB5MCArPSB5c3RlcDtcbiAgICAgICAgZXJyICs9IGR4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkcmF3UGl4ZWwoeDogYW55LCB5OiBhbnksIGNvbG9yOiBhbnkpIHtcbiAgICBpZiAoeCA8IDAgfHwgeCA+PSB0aGlzLndpZHRoIHx8IHkgPCAwIHx8IHkgPj0gdGhpcy5oZWlnaHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldEFkZHJXaW5kb3coeCwgeSwgeCArIDEsIHkgKyAxKTtcbiAgICB0aGlzLndyaXRlRGF0YShbY29sb3IgPj4gOCwgY29sb3IgJiAweGZmXSk7XG4gIH1cblxuICBwdWJsaWMgZHJhd0NoYXIoeDogYW55LCB5OiBhbnksIGNoOiBhbnksIGNvbG9yOiBhbnksIGJnOiBhbnksIHNpemU6IGFueSkge1xuICAgIC8vICBiZyA9IGJnIHx8IGNvbG9yO1xuICAgIHNpemUgPSBzaXplIHx8IDE7XG4gICAgaWYgKFxuICAgICAgeCA+PSB0aGlzLndpZHRoIHx8IC8vIENsaXAgcmlnaHRcbiAgICAgIHkgPj0gdGhpcy5oZWlnaHQgfHwgLy8gQ2xpcCBib3R0b21cbiAgICAgIHggKyA2ICogc2l6ZSAtIDEgPCAwIHx8IC8vIENsaXAgbGVmdFxuICAgICAgeSArIDggKiBzaXplIC0gMSA8IDBcbiAgICApIHtcbiAgICAgIC8vIENsaXAgdG9wXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbG9yICE9PSBiZykge1xuICAgICAgdGhpcy5kcmF3Q2hhcjIoeCwgeSwgY2gsIGNvbG9yLCBiZywgc2l6ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYzogYW55ID0gY2guY2hhckNvZGVBdCgwKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgICAgbGV0IGxpbmU6IGFueSA9IGkgPT09IDUgPyAwIDogZm9udFtjICogNSArIGldO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA4OyBqKyspIHtcbiAgICAgICAgaWYgKGxpbmUgJiAweDEpIHtcbiAgICAgICAgICBpZiAoc2l6ZSA9PT0gMSkge1xuICAgICAgICAgICAgLy8gZGVmYXVsdCBzaXplXG4gICAgICAgICAgICB0aGlzLmRyYXdQaXhlbCh4ICsgaSwgeSArIGosIGNvbG9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYmlnIHNpemVcbiAgICAgICAgICAgIHRoaXMuZmlsbFJlY3QoeCArIGkgKiBzaXplLCB5ICsgaiAqIHNpemUsIHNpemUsIHNpemUsIGNvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYmcgIT09IGNvbG9yKSB7XG4gICAgICAgICAgaWYgKHNpemUgPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgc2l6ZVxuICAgICAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeCArIGksIHkgKyBqLCBiZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJpZyBzaXplXG4gICAgICAgICAgICB0aGlzLmZpbGxSZWN0KHggKyBpICogc2l6ZSwgeSArIGogKiBzaXplLCBzaXplLCBzaXplLCBiZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxpbmUgPj49IDE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRyYXdDaGFyMih4OiBhbnksIHk6IGFueSwgY2g6IGFueSwgY29sb3I6IGFueSwgYmc6IGFueSwgc2l6ZTogYW55KSB7XG4gICAgLy8gIGJnID0gYmcgfHwgY29sb3I7XG4gICAgc2l6ZSA9IHNpemUgfHwgMTtcbiAgICBpZiAoXG4gICAgICB4ID49IHRoaXMud2lkdGggfHwgLy8gQ2xpcCByaWdodFxuICAgICAgeSA+PSB0aGlzLmhlaWdodCB8fCAvLyBDbGlwIGJvdHRvbVxuICAgICAgeCArIDYgKiBzaXplIC0gMSA8IDAgfHwgLy8gQ2xpcCBsZWZ0XG4gICAgICB5ICsgOCAqIHNpemUgLSAxIDwgMCAvLyBDbGlwIHRvcFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBpeGVsczogYW55ID0gbmV3IEFycmF5KDYgKiA4ICogc2l6ZSAqIHNpemUpO1xuICAgIGNvbnN0IGM6IGFueSA9IGNoLmNoYXJDb2RlQXQoMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgIGxldCBsaW5lOiBhbnkgPSBpID09PSA1ID8gMCA6IGZvbnRbYyAqIDUgKyBpXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgODsgaisrKSB7XG4gICAgICAgIGNvbnN0IGNsOiBhbnkgPSBsaW5lICYgMHgxID8gY29sb3IgOiBiZztcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBzaXplOyB3KyspIHtcbiAgICAgICAgICBmb3IgKGxldCBoID0gMDsgaCA8IHNpemU7IGgrKykge1xuICAgICAgICAgICAgcGl4ZWxzW1xuICAgICAgICAgICAgaSAqICgxICogc2l6ZSkgKyB3ICsgKGogKiAoNiAqIHNpemUgKiBzaXplKSArIGggKiAoNiAqIHNpemUpKVxuICAgICAgICAgICAgICBdID0gY2w7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxpbmUgPj49IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmF3Qm91bmQxNih4LCB5LCA2ICogc2l6ZSwgOCAqIHNpemUsIHBpeGVscyk7XG4gIH1cblxuICBwdWJsaWMgcmF3Qm91bmQxNih4OiBhbnksIHk6IGFueSwgd2lkdGg6IGFueSwgaGVpZ2h0OiBhbnksIHBpeGVsczogYW55KSB7XG4gICAgY29uc3QgcmdiOiBhbnkgPSBbXTtcbiAgICBwaXhlbHMuZm9yRWFjaCgodjogYW55KSA9PiB7XG4gICAgICByZ2IucHVzaCgodiAmIDB4ZmYwMCkgPj4gOCk7XG4gICAgICByZ2IucHVzaCh2ICYgMHhmZik7XG4gICAgfSk7XG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgsIHksIHggKyB3aWR0aCAtIDEsIHkgKyBoZWlnaHQgLSAxKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcihyZ2IpO1xuICAgIHRoaXMuX3dyaXRlQnVmZmVyKCk7IC8vIGZvciBmbHVzaFxuICB9XG5cbiAgcHVibGljIGRyYXdTdHJpbmcoeDogYW55LCB5OiBhbnksIHN0cjogYW55LCBjb2xvcjogYW55LCBiZzogYW55LCBzaXplOiBhbnksIHdyYXA6IGFueSkge1xuICAgIC8vICBiZyA9IGJnIHx8IGNvbG9yO1xuICAgIHNpemUgPSBzaXplIHx8IDE7XG4gICAgLy8gIHdyYXAgPSB3cmFwIHx8IHRydWU7XG4gICAgZm9yIChsZXQgbiA9IDA7IG4gPCBzdHIubGVuZ3RoOyBuKyspIHtcbiAgICAgIGNvbnN0IGM6IGFueSA9IHN0ci5jaGFyQXQobik7XG4gICAgICBpZiAoYyA9PT0gXCJcXG5cIikge1xuICAgICAgICB5ICs9IHNpemUgKiA4O1xuICAgICAgICB4ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PT0gXCJcXHJcIikge1xuICAgICAgICAvLyBza2lwIGVtXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdDaGFyKHgsIHksIGMsIGNvbG9yLCBiZywgc2l6ZSk7XG4gICAgICAgIHggKz0gc2l6ZSAqIDY7XG4gICAgICAgIGlmICh3cmFwICYmIHggPiB0aGlzLndpZHRoIC0gc2l6ZSAqIDYpIHtcbiAgICAgICAgICB5ICs9IHNpemUgKiA4O1xuICAgICAgICAgIHggPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cblxuICBwdWJsaWMgZHJhd0NvbnRleHRCb3VuZChjb250ZXh0OiBhbnksIHgwOiBhbnksIHkwOiBhbnksIHdpZHRoOiBhbnksIGhlaWdodDogYW55LCB4MTogYW55LCB5MTogYW55LCBncmF5OiBhbnkpIHtcbiAgICB4MCA9IHgwIHx8IDA7XG4gICAgeTAgPSB5MCB8fCAwO1xuICAgIHdpZHRoID0gd2lkdGggfHwgY29udGV4dC5jYW52YXMuY2xpZW50V2lkdGg7XG4gICAgaGVpZ2h0ID0gaGVpZ2h0IHx8IGNvbnRleHQuY2FudmFzLmNsaWVudEhlaWdodDtcbiAgICB4MSA9IHgxIHx8IDA7XG4gICAgeTEgPSB5MSB8fCAwO1xuICAgIGdyYXkgPSBncmF5IHx8IGZhbHNlO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xOGJpdF0pOyAvLyAxOGJpdC9waXhlbFxuICAgIGNvbnN0IGltYWdlRGF0YTogYW55ID0gY29udGV4dC5nZXRJbWFnZURhdGEoeDAsIHkwLCB3aWR0aCwgaGVpZ2h0KS5kYXRhO1xuICAgIGNvbnN0IHJnYjogYW55ID0gW107XG4gICAgZm9yIChsZXQgbiA9IDA7IG4gPCBpbWFnZURhdGEubGVuZ3RoOyBuICs9IDQpIHtcbiAgICAgIGNvbnN0IHI6IGFueSA9IGltYWdlRGF0YVtuICsgMF07XG4gICAgICBjb25zdCBnOiBhbnkgPSBpbWFnZURhdGFbbiArIDFdO1xuICAgICAgY29uc3QgYjogYW55ID0gaW1hZ2VEYXRhW24gKyAyXTtcbiAgICAgIGlmICghZ3JheSkge1xuICAgICAgICByZ2IucHVzaChyKTtcbiAgICAgICAgcmdiLnB1c2goZyk7XG4gICAgICAgIHJnYi5wdXNoKGIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZ3M6IGFueSA9IE1hdGgucm91bmQoMC4yOTkgKiByICsgMC41ODcgKiBnICsgMC4xMTQgKiBiKTtcbiAgICAgICAgcmdiLnB1c2goZ3MpO1xuICAgICAgICByZ2IucHVzaChncyk7XG4gICAgICAgIHJnYi5wdXNoKGdzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy53cml0ZShTVDc3MzVfQ09MTU9ELCBbU1Q3NzM1XzE4Yml0XSk7IC8vIDE4Yml0L3BpeGVsXG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgxLCB5MSwgeDEgKyB3aWR0aCAtIDEsIHkxICsgaGVpZ2h0IC0gMSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIocmdiKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcigpOyAvLyBmb3IgZmx1c2hcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DT0xNT0QsIFtTVDc3MzVfMTZiaXRdKTsgLy8gMTZiaXQvcGl4ZWxcbiAgfVxuXG4gIHB1YmxpYyBkcmF3Q29udGV4dChjb250ZXh0OiBhbnksIGdyYXk6IGFueSkge1xuICAgIGdyYXkgPSBncmF5IHx8IGZhbHNlO1xuICAgIHRoaXMuZHJhd0NvbnRleHRCb3VuZChjb250ZXh0LCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgMCwgMCwgZ3JheSk7XG4gIH1cblxuICBwdWJsaWMgcmF3Qm91bmQoeDogYW55LCB5OiBhbnksIHdpZHRoOiBhbnksIGhlaWdodDogYW55LCBwaXhlbHM6IGFueSkge1xuICAgIGNvbnN0IHJnYjogYW55ID0gW107XG4gICAgcGl4ZWxzLmZvckVhY2goKHY6IG51bWJlcikgPT4ge1xuICAgICAgcmdiLnB1c2goKHYgJiAweGZmMDAwMCkgPj4gMTYpO1xuICAgICAgcmdiLnB1c2goKHYgJiAweGZmMDApID4+IDgpO1xuICAgICAgcmdiLnB1c2godiAmIDB4ZmYpO1xuICAgIH0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xOGJpdF0pOyAvLyAxOGJpdC9waXhlbFxuICAgIHRoaXMuc2V0QWRkcldpbmRvdyh4LCB5LCB4ICsgd2lkdGggLSAxLCB5ICsgaGVpZ2h0IC0gMSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIocmdiKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcigpOyAvLyBmb3IgZmx1c2hcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DT0xNT0QsIFtTVDc3MzVfMTZiaXRdKTsgLy8gMTZiaXQvcGl4ZWxcbiAgfVxuXG4gIHB1YmxpYyByYXcocGl4ZWxzOiBhbnkpIHtcbiAgICB0aGlzLnJhd0JvdW5kKDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCBwaXhlbHMpO1xuICB9XG5cbiAgcHVibGljIF9zZXRQcmVzZXRDb2xvcigpIHtcbiAgICB0aGlzLmNvbG9yID0ge1xuICAgICAgQWxpY2VCbHVlOiAweGY3ZGYsXG4gICAgICBBbnRpcXVlV2hpdGU6IDB4ZmY1YSxcbiAgICAgIEFxdWE6IDB4MDdmZixcbiAgICAgIEFxdWFtYXJpbmU6IDB4N2ZmYSxcbiAgICAgIEF6dXJlOiAweGY3ZmYsXG4gICAgICBCZWlnZTogMHhmN2JiLFxuICAgICAgQmlzcXVlOiAweGZmMzgsXG4gICAgICBCbGFjazogMHgwMDAwLFxuICAgICAgQmxhbmNoZWRBbG1vbmQ6IDB4ZmY1OSxcbiAgICAgIEJsdWU6IDB4MDAxZixcbiAgICAgIEJsdWVWaW9sZXQ6IDB4ODk1YyxcbiAgICAgIEJyb3duOiAweGExNDUsXG4gICAgICBCdXJseVdvb2Q6IDB4ZGRkMCxcbiAgICAgIENhZGV0Qmx1ZTogMHg1Y2Y0LFxuICAgICAgQ2hhcnRyZXVzZTogMHg3ZmUwLFxuICAgICAgQ2hvY29sYXRlOiAweGQzNDMsXG4gICAgICBDb3JhbDogMHhmYmVhLFxuICAgICAgQ29ybmZsb3dlckJsdWU6IDB4NjRiZCxcbiAgICAgIENvcm5zaWxrOiAweGZmZGIsXG4gICAgICBDcmltc29uOiAweGQ4YTcsXG4gICAgICBDeWFuOiAweDA3ZmYsXG4gICAgICBEYXJrQmx1ZTogMHgwMDExLFxuICAgICAgRGFya0N5YW46IDB4MDQ1MSxcbiAgICAgIERhcmtHb2xkZW5Sb2Q6IDB4YmMyMSxcbiAgICAgIERhcmtHcmF5OiAweGFkNTUsXG4gICAgICBEYXJrR3JlZW46IDB4MDMyMCxcbiAgICAgIERhcmtLaGFraTogMHhiZGFkLFxuICAgICAgRGFya01hZ2VudGE6IDB4ODgxMSxcbiAgICAgIERhcmtPbGl2ZUdyZWVuOiAweDUzNDUsXG4gICAgICBEYXJrT3JhbmdlOiAweGZjNjAsXG4gICAgICBEYXJrT3JjaGlkOiAweDk5OTksXG4gICAgICBEYXJrUmVkOiAweDg4MDAsXG4gICAgICBEYXJrU2FsbW9uOiAweGVjYWYsXG4gICAgICBEYXJrU2VhR3JlZW46IDB4OGRmMSxcbiAgICAgIERhcmtTbGF0ZUJsdWU6IDB4NDlmMSxcbiAgICAgIERhcmtTbGF0ZUdyYXk6IDB4MmE2OSxcbiAgICAgIERhcmtUdXJxdW9pc2U6IDB4MDY3YSxcbiAgICAgIERhcmtWaW9sZXQ6IDB4OTAxYSxcbiAgICAgIERlZXBQaW5rOiAweGY4YjIsXG4gICAgICBEZWVwU2t5Qmx1ZTogMHgwNWZmLFxuICAgICAgRGltR3JheTogMHg2YjRkLFxuICAgICAgRG9kZ2VyQmx1ZTogMHgxYzlmLFxuICAgICAgRmlyZUJyaWNrOiAweGIxMDQsXG4gICAgICBGbG9yYWxXaGl0ZTogMHhmZmRlLFxuICAgICAgRm9yZXN0R3JlZW46IDB4MjQ0NCxcbiAgICAgIEZ1Y2hzaWE6IDB4ZjgxZixcbiAgICAgIEdhaW5zYm9ybzogMHhkZWZiLFxuICAgICAgR2hvc3RXaGl0ZTogMHhmZmRmLFxuICAgICAgR29sZDogMHhmZWEwLFxuICAgICAgR29sZGVuUm9kOiAweGRkMjQsXG4gICAgICBHcmF5OiAweDg0MTAsXG4gICAgICBHcmVlbjogMHgwNDAwLFxuICAgICAgR3JlZW5ZZWxsb3c6IDB4YWZlNSxcbiAgICAgIEhvbmV5RGV3OiAweGY3ZmUsXG4gICAgICBIb3RQaW5rOiAweGZiNTYsXG4gICAgICBJbmRpYW5SZWQ6IDB4Y2FlYixcbiAgICAgIEluZGlnbzogMHg0ODEwLFxuICAgICAgSXZvcnk6IDB4ZmZmZSxcbiAgICAgIEtoYWtpOiAweGY3MzEsXG4gICAgICBMYXZlbmRlcjogMHhlNzNmLFxuICAgICAgTGF2ZW5kZXJCbHVzaDogMHhmZjllLFxuICAgICAgTGF3bkdyZWVuOiAweDdmZTAsXG4gICAgICBMZW1vbkNoaWZmb246IDB4ZmZkOSxcbiAgICAgIExpZ2h0Qmx1ZTogMHhhZWRjLFxuICAgICAgTGlnaHRDb3JhbDogMHhmNDEwLFxuICAgICAgTGlnaHRDeWFuOiAweGU3ZmYsXG4gICAgICBMaWdodEdvbGRlblJvZFllbGxvdzogMHhmZmRhLFxuICAgICAgTGlnaHRHcmF5OiAweGQ2OWEsXG4gICAgICBMaWdodEdyZWVuOiAweDk3NzIsXG4gICAgICBMaWdodFBpbms6IDB4ZmRiOCxcbiAgICAgIExpZ2h0U2FsbW9uOiAweGZkMGYsXG4gICAgICBMaWdodFNlYUdyZWVuOiAweDI1OTUsXG4gICAgICBMaWdodFNreUJsdWU6IDB4ODY3ZixcbiAgICAgIExpZ2h0U2xhdGVHcmF5OiAweDc0NTMsXG4gICAgICBMaWdodFN0ZWVsQmx1ZTogMHhiNjNiLFxuICAgICAgTGlnaHRZZWxsb3c6IDB4ZmZmYyxcbiAgICAgIExpbWU6IDB4MDdlMCxcbiAgICAgIExpbWVHcmVlbjogMHgzNjY2LFxuICAgICAgTGluZW46IDB4ZmY5YyxcbiAgICAgIE1hZ2VudGE6IDB4ZjgxZixcbiAgICAgIE1hcm9vbjogMHg4MDAwLFxuICAgICAgTWVkaXVtQXF1YU1hcmluZTogMHg2Njc1LFxuICAgICAgTWVkaXVtQmx1ZTogMHgwMDE5LFxuICAgICAgTWVkaXVtT3JjaGlkOiAweGJhYmEsXG4gICAgICBNZWRpdW1QdXJwbGU6IDB4OTM5YixcbiAgICAgIE1lZGl1bVNlYUdyZWVuOiAweDNkOGUsXG4gICAgICBNZWRpdW1TbGF0ZUJsdWU6IDB4N2I1ZCxcbiAgICAgIE1lZGl1bVNwcmluZ0dyZWVuOiAweDA3ZDMsXG4gICAgICBNZWRpdW1UdXJxdW9pc2U6IDB4NGU5OSxcbiAgICAgIE1lZGl1bVZpb2xldFJlZDogMHhjMGIwLFxuICAgICAgTWlkbmlnaHRCbHVlOiAweDE4Y2UsXG4gICAgICBNaW50Q3JlYW06IDB4ZjdmZixcbiAgICAgIE1pc3R5Um9zZTogMHhmZjNjLFxuICAgICAgTW9jY2FzaW46IDB4ZmYzNixcbiAgICAgIE5hdmFqb1doaXRlOiAweGZlZjUsXG4gICAgICBOYXZ5OiAweDAwMTAsXG4gICAgICBPbGRMYWNlOiAweGZmYmMsXG4gICAgICBPbGl2ZTogMHg4NDAwLFxuICAgICAgT2xpdmVEcmFiOiAweDZjNjQsXG4gICAgICBPcmFuZ2U6IDB4ZmQyMCxcbiAgICAgIE9yYW5nZVJlZDogMHhmYTIwLFxuICAgICAgT3JjaGlkOiAweGRiOWEsXG4gICAgICBQYWxlR29sZGVuUm9kOiAweGVmNTUsXG4gICAgICBQYWxlR3JlZW46IDB4OWZkMyxcbiAgICAgIFBhbGVUdXJxdW9pc2U6IDB4YWY3ZCxcbiAgICAgIFBhbGVWaW9sZXRSZWQ6IDB4ZGI5MixcbiAgICAgIFBhcGF5YVdoaXA6IDB4ZmY3YSxcbiAgICAgIFBlYWNoUHVmZjogMHhmZWQ3LFxuICAgICAgUGVydTogMHhjYzI3LFxuICAgICAgUGluazogMHhmZTE5LFxuICAgICAgUGx1bTogMHhkZDFiLFxuICAgICAgUG93ZGVyQmx1ZTogMHhiNzFjLFxuICAgICAgUHVycGxlOiAweDgwMTAsXG4gICAgICBSZWJlY2NhUHVycGxlOiAweDYxOTMsXG4gICAgICBSZWQ6IDB4ZjgwMCxcbiAgICAgIFJvc3lCcm93bjogMHhiYzcxLFxuICAgICAgUm95YWxCbHVlOiAweDQzNWMsXG4gICAgICBTYWRkbGVCcm93bjogMHg4YTIyLFxuICAgICAgU2FsbW9uOiAweGZjMGUsXG4gICAgICBTYW5keUJyb3duOiAweGY1MmMsXG4gICAgICBTZWFHcmVlbjogMHgyYzRhLFxuICAgICAgU2VhU2hlbGw6IDB4ZmZiZCxcbiAgICAgIFNpZW5uYTogMHhhMjg1LFxuICAgICAgU2lsdmVyOiAweGM2MTgsXG4gICAgICBTa3lCbHVlOiAweDg2N2QsXG4gICAgICBTbGF0ZUJsdWU6IDB4NmFkOSxcbiAgICAgIFNsYXRlR3JheTogMHg3NDEyLFxuICAgICAgU25vdzogMHhmZmRmLFxuICAgICAgU3ByaW5nR3JlZW46IDB4MDdlZixcbiAgICAgIFN0ZWVsQmx1ZTogMHg0NDE2LFxuICAgICAgVGFuOiAweGQ1YjEsXG4gICAgICBUZWFsOiAweDA0MTAsXG4gICAgICBUaGlzdGxlOiAweGRkZmIsXG4gICAgICBUb21hdG86IDB4ZmIwOCxcbiAgICAgIFR1cnF1b2lzZTogMHg0NzFhLFxuICAgICAgVmlvbGV0OiAweGVjMWQsXG4gICAgICBXaGVhdDogMHhmNmY2LFxuICAgICAgV2hpdGU6IDB4ZmZmZixcbiAgICAgIFdoaXRlU21va2U6IDB4ZjdiZSxcbiAgICAgIFllbGxvdzogMHhmZmUwLFxuICAgICAgWWVsbG93R3JlZW46IDB4OWU2NixcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNhaW5TbWFydFRGVDE4TENEO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIGNvbW1hbmRzXG4vLyBjb25zdCBJTklUUl9HUkVFTlRBQiA9IDB4MDtcbi8vIGNvbnN0IElOSVRSX1JFRFRBQiA9IDB4MTtcbi8vIGNvbnN0IElOSVRSX0JMQUNLVEFCID0gMHgyO1xuXG5jb25zdCBTVDc3MzVfVEZUV0lEVEg6IGFueSA9IDEyODtcbmNvbnN0IFNUNzczNV9URlRIRUlHSFQ6IGFueSA9IDE2MDtcblxuLy8gY29uc3QgU1Q3NzM1X05PUCA9IDB4MDA7XG4vLyBjb25zdCBTVDc3MzVfU1dSRVNFVCA9IDB4MDE7XG4vLyBjb25zdCBTVDc3MzVfUkRESUQgPSAweDA0O1xuLy8gY29uc3QgU1Q3NzM1X1JERFNUID0gMHgwOTtcbi8vIGNvbnN0IFNUNzczNV9SRERQTSA9IDB4MGE7XG5cbi8vIGNvbnN0IFNUNzczNV9TTFBJTiA9IDB4MTA7XG5jb25zdCBTVDc3MzVfU0xQT1VUOiBhbnkgPSAweDExO1xuLy8gY29uc3QgU1Q3NzM1X1BUTE9OID0gMHgxMjtcbi8vIGNvbnN0IFNUNzczNV9OT1JPTiA9IDB4MTM7XG5cbmNvbnN0IFNUNzczNV9JTlZPRkY6IGFueSA9IDB4MjA7XG5jb25zdCBTVDc3MzVfSU5WT046IGFueSA9IDB4MjE7XG5jb25zdCBTVDc3MzVfRElTUE9GRjogYW55ID0gMHgyODtcbmNvbnN0IFNUNzczNV9ESVNQT046IGFueSA9IDB4Mjk7XG5jb25zdCBTVDc3MzVfQ0FTRVQ6IGFueSA9IDB4MmE7XG5jb25zdCBTVDc3MzVfUkFTRVQ6IGFueSA9IDB4MmI7XG5jb25zdCBTVDc3MzVfUkFNV1I6IGFueSA9IDB4MmM7XG4vLyBjb25zdCBTVDc3MzVfUkFNUkQgPSAweDJlO1xuXG4vLyBjb25zdCBTVDc3MzVfUFRMQVIgPSAweDMwO1xuY29uc3QgU1Q3NzM1X0NPTE1PRDogYW55ID0gMHgzYTtcbmNvbnN0IFNUNzczNV9NQURDVEw6IGFueSA9IDB4MzY7XG5cbmNvbnN0IFNUNzczNV9GUk1DVFIxOiBhbnkgPSAweGIxO1xuY29uc3QgU1Q3NzM1X0ZSTUNUUjI6IGFueSA9IDB4YjI7XG5jb25zdCBTVDc3MzVfRlJNQ1RSMzogYW55ID0gMHhiMztcbmNvbnN0IFNUNzczNV9JTlZDVFI6IGFueSA9IDB4YjQ7XG4vLyBjb25zdCBTVDc3MzVfRElTU0VUNSA9IDB4YjY7XG5cbmNvbnN0IFNUNzczNV9QV0NUUjE6IGFueSA9IDB4YzA7XG5jb25zdCBTVDc3MzVfUFdDVFIyOiBhbnkgPSAweGMxO1xuY29uc3QgU1Q3NzM1X1BXQ1RSMzogYW55ID0gMHhjMjtcbmNvbnN0IFNUNzczNV9QV0NUUjQ6IGFueSA9IDB4YzM7XG5jb25zdCBTVDc3MzVfUFdDVFI1OiBhbnkgPSAweGM0O1xuY29uc3QgU1Q3NzM1X1ZNQ1RSMTogYW55ID0gMHhjNTtcblxuLy8gY29uc3QgU1Q3NzM1X1JESUQxID0gMHhkYTtcbi8vIGNvbnN0IFNUNzczNV9SRElEMiA9IDB4ZGI7XG4vLyBjb25zdCBTVDc3MzVfUkRJRDMgPSAweGRjO1xuLy8gY29uc3QgU1Q3NzM1X1JESUQ0ID0gMHhkZDtcblxuLy8gY29uc3QgU1Q3NzM1X1BXQ1RSNiA9IDB4ZmM7XG5cbmNvbnN0IFNUNzczNV9HTUNUUlAxOiBhbnkgPSAweGUwO1xuY29uc3QgU1Q3NzM1X0dNQ1RSTjE6IGFueSA9IDB4ZTE7XG5cbi8vIENvbG9yIGRlZmluaXRpb25zXG4vLyBjb25zdCBTVDc3MzVfQkxBQ0sgPSAweDAwMDA7XG4vLyBjb25zdCBTVDc3MzVfQkxVRSA9IDB4MDAxZjtcbi8vIGNvbnN0IFNUNzczNV9SRUQgPSAweGY4MDA7XG4vLyBjb25zdCBTVDc3MzVfR1JFRU4gPSAweDA3ZTA7XG4vLyBjb25zdCBTVDc3MzVfQ1lBTiA9IDB4MDdmZjtcbi8vIGNvbnN0IFNUNzczNV9NQUdFTlRBID0gMHhmODFmO1xuLy8gY29uc3QgU1Q3NzM1X1lFTExPVyA9IDB4ZmZlMDtcbi8vIGNvbnN0IFNUNzczNV9XSElURSA9IDB4ZmZmZjtcblxuY29uc3QgU1Q3NzM1XzE4Yml0OiBhbnkgPSAweDA2OyAvLyAxOGJpdC9waXhlbFxuY29uc3QgU1Q3NzM1XzE2Yml0OiBhbnkgPSAweDA1OyAvLyAxNmJpdC9waXhlbFxuXG4vLyBzdGFuZGFyZCBhc2NpaSA1eDcgZm9udFxuY29uc3QgZm9udDogYW55ID0gW1xuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDNlLFxuICAweDViLFxuICAweDRmLFxuICAweDViLFxuICAweDNlLFxuICAweDNlLFxuICAweDZiLFxuICAweDRmLFxuICAweDZiLFxuICAweDNlLFxuICAweDFjLFxuICAweDNlLFxuICAweDdjLFxuICAweDNlLFxuICAweDFjLFxuICAweDE4LFxuICAweDNjLFxuICAweDdlLFxuICAweDNjLFxuICAweDE4LFxuICAweDFjLFxuICAweDU3LFxuICAweDdkLFxuICAweDU3LFxuICAweDFjLFxuICAweDFjLFxuICAweDVlLFxuICAweDdmLFxuICAweDVlLFxuICAweDFjLFxuICAweDAwLFxuICAweDE4LFxuICAweDNjLFxuICAweDE4LFxuICAweDAwLFxuICAweGZmLFxuICAweGU3LFxuICAweGMzLFxuICAweGU3LFxuICAweGZmLFxuICAweDAwLFxuICAweDE4LFxuICAweDI0LFxuICAweDE4LFxuICAweDAwLFxuICAweGZmLFxuICAweGU3LFxuICAweGRiLFxuICAweGU3LFxuICAweGZmLFxuICAweDMwLFxuICAweDQ4LFxuICAweDNhLFxuICAweDA2LFxuICAweDBlLFxuICAweDI2LFxuICAweDI5LFxuICAweDc5LFxuICAweDI5LFxuICAweDI2LFxuICAweDQwLFxuICAweDdmLFxuICAweDA1LFxuICAweDA1LFxuICAweDA3LFxuICAweDQwLFxuICAweDdmLFxuICAweDA1LFxuICAweDI1LFxuICAweDNmLFxuICAweDVhLFxuICAweDNjLFxuICAweGU3LFxuICAweDNjLFxuICAweDVhLFxuICAweDdmLFxuICAweDNlLFxuICAweDFjLFxuICAweDFjLFxuICAweDA4LFxuICAweDA4LFxuICAweDFjLFxuICAweDFjLFxuICAweDNlLFxuICAweDdmLFxuICAweDE0LFxuICAweDIyLFxuICAweDdmLFxuICAweDIyLFxuICAweDE0LFxuICAweDVmLFxuICAweDVmLFxuICAweDAwLFxuICAweDVmLFxuICAweDVmLFxuICAweDA2LFxuICAweDA5LFxuICAweDdmLFxuICAweDAxLFxuICAweDdmLFxuICAweDAwLFxuICAweDY2LFxuICAweDg5LFxuICAweDk1LFxuICAweDZhLFxuICAweDYwLFxuICAweDYwLFxuICAweDYwLFxuICAweDYwLFxuICAweDYwLFxuICAweDk0LFxuICAweGEyLFxuICAweGZmLFxuICAweGEyLFxuICAweDk0LFxuICAweDA4LFxuICAweDA0LFxuICAweDdlLFxuICAweDA0LFxuICAweDA4LFxuICAweDEwLFxuICAweDIwLFxuICAweDdlLFxuICAweDIwLFxuICAweDEwLFxuICAweDA4LFxuICAweDA4LFxuICAweDJhLFxuICAweDFjLFxuICAweDA4LFxuICAweDA4LFxuICAweDFjLFxuICAweDJhLFxuICAweDA4LFxuICAweDA4LFxuICAweDFlLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDBjLFxuICAweDFlLFxuICAweDBjLFxuICAweDFlLFxuICAweDBjLFxuICAweDMwLFxuICAweDM4LFxuICAweDNlLFxuICAweDM4LFxuICAweDMwLFxuICAweDA2LFxuICAweDBlLFxuICAweDNlLFxuICAweDBlLFxuICAweDA2LFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDVmLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDA3LFxuICAweDAwLFxuICAweDA3LFxuICAweDAwLFxuICAweDE0LFxuICAweDdmLFxuICAweDE0LFxuICAweDdmLFxuICAweDE0LFxuICAweDI0LFxuICAweDJhLFxuICAweDdmLFxuICAweDJhLFxuICAweDEyLFxuICAweDIzLFxuICAweDEzLFxuICAweDA4LFxuICAweDY0LFxuICAweDYyLFxuICAweDM2LFxuICAweDQ5LFxuICAweDU2LFxuICAweDIwLFxuICAweDUwLFxuICAweDAwLFxuICAweDA4LFxuICAweDA3LFxuICAweDAzLFxuICAweDAwLFxuICAweDAwLFxuICAweDFjLFxuICAweDIyLFxuICAweDQxLFxuICAweDAwLFxuICAweDAwLFxuICAweDQxLFxuICAweDIyLFxuICAweDFjLFxuICAweDAwLFxuICAweDJhLFxuICAweDFjLFxuICAweDdmLFxuICAweDFjLFxuICAweDJhLFxuICAweDA4LFxuICAweDA4LFxuICAweDNlLFxuICAweDA4LFxuICAweDA4LFxuICAweDAwLFxuICAweDgwLFxuICAweDcwLFxuICAweDMwLFxuICAweDAwLFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDAwLFxuICAweDAwLFxuICAweDYwLFxuICAweDYwLFxuICAweDAwLFxuICAweDIwLFxuICAweDEwLFxuICAweDA4LFxuICAweDA0LFxuICAweDAyLFxuICAweDNlLFxuICAweDUxLFxuICAweDQ5LFxuICAweDQ1LFxuICAweDNlLFxuICAweDAwLFxuICAweDQyLFxuICAweDdmLFxuICAweDQwLFxuICAweDAwLFxuICAweDcyLFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQ2LFxuICAweDIxLFxuICAweDQxLFxuICAweDQ5LFxuICAweDRkLFxuICAweDMzLFxuICAweDE4LFxuICAweDE0LFxuICAweDEyLFxuICAweDdmLFxuICAweDEwLFxuICAweDI3LFxuICAweDQ1LFxuICAweDQ1LFxuICAweDQ1LFxuICAweDM5LFxuICAweDNjLFxuICAweDRhLFxuICAweDQ5LFxuICAweDQ5LFxuICAweDMxLFxuICAweDQxLFxuICAweDIxLFxuICAweDExLFxuICAweDA5LFxuICAweDA3LFxuICAweDM2LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDM2LFxuICAweDQ2LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDI5LFxuICAweDFlLFxuICAweDAwLFxuICAweDAwLFxuICAweDE0LFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDQwLFxuICAweDM0LFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDA4LFxuICAweDE0LFxuICAweDIyLFxuICAweDQxLFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDAwLFxuICAweDQxLFxuICAweDIyLFxuICAweDE0LFxuICAweDA4LFxuICAweDAyLFxuICAweDAxLFxuICAweDU5LFxuICAweDA5LFxuICAweDA2LFxuICAweDNlLFxuICAweDQxLFxuICAweDVkLFxuICAweDU5LFxuICAweDRlLFxuICAweDdjLFxuICAweDEyLFxuICAweDExLFxuICAweDEyLFxuICAweDdjLFxuICAweDdmLFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDM2LFxuICAweDNlLFxuICAweDQxLFxuICAweDQxLFxuICAweDQxLFxuICAweDIyLFxuICAweDdmLFxuICAweDQxLFxuICAweDQxLFxuICAweDQxLFxuICAweDNlLFxuICAweDdmLFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQxLFxuICAweDdmLFxuICAweDA5LFxuICAweDA5LFxuICAweDA5LFxuICAweDAxLFxuICAweDNlLFxuICAweDQxLFxuICAweDQxLFxuICAweDUxLFxuICAweDczLFxuICAweDdmLFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDdmLFxuICAweDAwLFxuICAweDQxLFxuICAweDdmLFxuICAweDQxLFxuICAweDAwLFxuICAweDIwLFxuICAweDQwLFxuICAweDQxLFxuICAweDNmLFxuICAweDAxLFxuICAweDdmLFxuICAweDA4LFxuICAweDE0LFxuICAweDIyLFxuICAweDQxLFxuICAweDdmLFxuICAweDQwLFxuICAweDQwLFxuICAweDQwLFxuICAweDQwLFxuICAweDdmLFxuICAweDAyLFxuICAweDFjLFxuICAweDAyLFxuICAweDdmLFxuICAweDdmLFxuICAweDA0LFxuICAweDA4LFxuICAweDEwLFxuICAweDdmLFxuICAweDNlLFxuICAweDQxLFxuICAweDQxLFxuICAweDQxLFxuICAweDNlLFxuICAweDdmLFxuICAweDA5LFxuICAweDA5LFxuICAweDA5LFxuICAweDA2LFxuICAweDNlLFxuICAweDQxLFxuICAweDUxLFxuICAweDIxLFxuICAweDVlLFxuICAweDdmLFxuICAweDA5LFxuICAweDE5LFxuICAweDI5LFxuICAweDQ2LFxuICAweDI2LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDMyLFxuICAweDAzLFxuICAweDAxLFxuICAweDdmLFxuICAweDAxLFxuICAweDAzLFxuICAweDNmLFxuICAweDQwLFxuICAweDQwLFxuICAweDQwLFxuICAweDNmLFxuICAweDFmLFxuICAweDIwLFxuICAweDQwLFxuICAweDIwLFxuICAweDFmLFxuICAweDNmLFxuICAweDQwLFxuICAweDM4LFxuICAweDQwLFxuICAweDNmLFxuICAweDYzLFxuICAweDE0LFxuICAweDA4LFxuICAweDE0LFxuICAweDYzLFxuICAweDAzLFxuICAweDA0LFxuICAweDc4LFxuICAweDA0LFxuICAweDAzLFxuICAweDYxLFxuICAweDU5LFxuICAweDQ5LFxuICAweDRkLFxuICAweDQzLFxuICAweDAwLFxuICAweDdmLFxuICAweDQxLFxuICAweDQxLFxuICAweDQxLFxuICAweDAyLFxuICAweDA0LFxuICAweDA4LFxuICAweDEwLFxuICAweDIwLFxuICAweDAwLFxuICAweDQxLFxuICAweDQxLFxuICAweDQxLFxuICAweDdmLFxuICAweDA0LFxuICAweDAyLFxuICAweDAxLFxuICAweDAyLFxuICAweDA0LFxuICAweDQwLFxuICAweDQwLFxuICAweDQwLFxuICAweDQwLFxuICAweDQwLFxuICAweDAwLFxuICAweDAzLFxuICAweDA3LFxuICAweDA4LFxuICAweDAwLFxuICAweDIwLFxuICAweDU0LFxuICAweDU0LFxuICAweDc4LFxuICAweDQwLFxuICAweDdmLFxuICAweDI4LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDM4LFxuICAweDM4LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDI4LFxuICAweDM4LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDI4LFxuICAweDdmLFxuICAweDM4LFxuICAweDU0LFxuICAweDU0LFxuICAweDU0LFxuICAweDE4LFxuICAweDAwLFxuICAweDA4LFxuICAweDdlLFxuICAweDA5LFxuICAweDAyLFxuICAweDE4LFxuICAweGE0LFxuICAweGE0LFxuICAweDljLFxuICAweDc4LFxuICAweDdmLFxuICAweDA4LFxuICAweDA0LFxuICAweDA0LFxuICAweDc4LFxuICAweDAwLFxuICAweDQ0LFxuICAweDdkLFxuICAweDQwLFxuICAweDAwLFxuICAweDIwLFxuICAweDQwLFxuICAweDQwLFxuICAweDNkLFxuICAweDAwLFxuICAweDdmLFxuICAweDEwLFxuICAweDI4LFxuICAweDQ0LFxuICAweDAwLFxuICAweDAwLFxuICAweDQxLFxuICAweDdmLFxuICAweDQwLFxuICAweDAwLFxuICAweDdjLFxuICAweDA0LFxuICAweDc4LFxuICAweDA0LFxuICAweDc4LFxuICAweDdjLFxuICAweDA4LFxuICAweDA0LFxuICAweDA0LFxuICAweDc4LFxuICAweDM4LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDM4LFxuICAweGZjLFxuICAweDE4LFxuICAweDI0LFxuICAweDI0LFxuICAweDE4LFxuICAweDE4LFxuICAweDI0LFxuICAweDI0LFxuICAweDE4LFxuICAweGZjLFxuICAweDdjLFxuICAweDA4LFxuICAweDA0LFxuICAweDA0LFxuICAweDA4LFxuICAweDQ4LFxuICAweDU0LFxuICAweDU0LFxuICAweDU0LFxuICAweDI0LFxuICAweDA0LFxuICAweDA0LFxuICAweDNmLFxuICAweDQ0LFxuICAweDI0LFxuICAweDNjLFxuICAweDQwLFxuICAweDQwLFxuICAweDIwLFxuICAweDdjLFxuICAweDFjLFxuICAweDIwLFxuICAweDQwLFxuICAweDIwLFxuICAweDFjLFxuICAweDNjLFxuICAweDQwLFxuICAweDMwLFxuICAweDQwLFxuICAweDNjLFxuICAweDQ0LFxuICAweDI4LFxuICAweDEwLFxuICAweDI4LFxuICAweDQ0LFxuICAweDRjLFxuICAweDkwLFxuICAweDkwLFxuICAweDkwLFxuICAweDdjLFxuICAweDQ0LFxuICAweDY0LFxuICAweDU0LFxuICAweDRjLFxuICAweDQ0LFxuICAweDAwLFxuICAweDA4LFxuICAweDM2LFxuICAweDQxLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDc3LFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDQxLFxuICAweDM2LFxuICAweDA4LFxuICAweDAwLFxuICAweDAyLFxuICAweDAxLFxuICAweDAyLFxuICAweDA0LFxuICAweDAyLFxuICAweDNjLFxuICAweDI2LFxuICAweDIzLFxuICAweDI2LFxuICAweDNjLFxuICAweDFlLFxuICAweGExLFxuICAweGExLFxuICAweDYxLFxuICAweDEyLFxuICAweDNhLFxuICAweDQwLFxuICAweDQwLFxuICAweDIwLFxuICAweDdhLFxuICAweDM4LFxuICAweDU0LFxuICAweDU0LFxuICAweDU1LFxuICAweDU5LFxuICAweDIxLFxuICAweDU1LFxuICAweDU1LFxuICAweDc5LFxuICAweDQxLFxuICAweDIxLFxuICAweDU0LFxuICAweDU0LFxuICAweDc4LFxuICAweDQxLFxuICAweDIxLFxuICAweDU1LFxuICAweDU0LFxuICAweDc4LFxuICAweDQwLFxuICAweDIwLFxuICAweDU0LFxuICAweDU1LFxuICAweDc5LFxuICAweDQwLFxuICAweDBjLFxuICAweDFlLFxuICAweDUyLFxuICAweDcyLFxuICAweDEyLFxuICAweDM5LFxuICAweDU1LFxuICAweDU1LFxuICAweDU1LFxuICAweDU5LFxuICAweDM5LFxuICAweDU0LFxuICAweDU0LFxuICAweDU0LFxuICAweDU5LFxuICAweDM5LFxuICAweDU1LFxuICAweDU0LFxuICAweDU0LFxuICAweDU4LFxuICAweDAwLFxuICAweDAwLFxuICAweDQ1LFxuICAweDdjLFxuICAweDQxLFxuICAweDAwLFxuICAweDAyLFxuICAweDQ1LFxuICAweDdkLFxuICAweDQyLFxuICAweDAwLFxuICAweDAxLFxuICAweDQ1LFxuICAweDdjLFxuICAweDQwLFxuICAweGYwLFxuICAweDI5LFxuICAweDI0LFxuICAweDI5LFxuICAweGYwLFxuICAweGYwLFxuICAweDI4LFxuICAweDI1LFxuICAweDI4LFxuICAweGYwLFxuICAweDdjLFxuICAweDU0LFxuICAweDU1LFxuICAweDQ1LFxuICAweDAwLFxuICAweDIwLFxuICAweDU0LFxuICAweDU0LFxuICAweDdjLFxuICAweDU0LFxuICAweDdjLFxuICAweDBhLFxuICAweDA5LFxuICAweDdmLFxuICAweDQ5LFxuICAweDMyLFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDMyLFxuICAweDMyLFxuICAweDQ4LFxuICAweDQ4LFxuICAweDQ4LFxuICAweDMyLFxuICAweDMyLFxuICAweDRhLFxuICAweDQ4LFxuICAweDQ4LFxuICAweDMwLFxuICAweDNhLFxuICAweDQxLFxuICAweDQxLFxuICAweDIxLFxuICAweDdhLFxuICAweDNhLFxuICAweDQyLFxuICAweDQwLFxuICAweDIwLFxuICAweDc4LFxuICAweDAwLFxuICAweDlkLFxuICAweGEwLFxuICAweGEwLFxuICAweDdkLFxuICAweDM5LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDM5LFxuICAweDNkLFxuICAweDQwLFxuICAweDQwLFxuICAweDQwLFxuICAweDNkLFxuICAweDNjLFxuICAweDI0LFxuICAweGZmLFxuICAweDI0LFxuICAweDI0LFxuICAweDQ4LFxuICAweDdlLFxuICAweDQ5LFxuICAweDQzLFxuICAweDY2LFxuICAweDJiLFxuICAweDJmLFxuICAweGZjLFxuICAweDJmLFxuICAweDJiLFxuICAweGZmLFxuICAweDA5LFxuICAweDI5LFxuICAweGY2LFxuICAweDIwLFxuICAweGMwLFxuICAweDg4LFxuICAweDdlLFxuICAweDA5LFxuICAweDAzLFxuICAweDIwLFxuICAweDU0LFxuICAweDU0LFxuICAweDc5LFxuICAweDQxLFxuICAweDAwLFxuICAweDAwLFxuICAweDQ0LFxuICAweDdkLFxuICAweDQxLFxuICAweDMwLFxuICAweDQ4LFxuICAweDQ4LFxuICAweDRhLFxuICAweDMyLFxuICAweDM4LFxuICAweDQwLFxuICAweDQwLFxuICAweDIyLFxuICAweDdhLFxuICAweDAwLFxuICAweDdhLFxuICAweDBhLFxuICAweDBhLFxuICAweDcyLFxuICAweDdkLFxuICAweDBkLFxuICAweDE5LFxuICAweDMxLFxuICAweDdkLFxuICAweDI2LFxuICAweDI5LFxuICAweDI5LFxuICAweDJmLFxuICAweDI4LFxuICAweDI2LFxuICAweDI5LFxuICAweDI5LFxuICAweDI5LFxuICAweDI2LFxuICAweDMwLFxuICAweDQ4LFxuICAweDRkLFxuICAweDQwLFxuICAweDIwLFxuICAweDM4LFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDA4LFxuICAweDM4LFxuICAweDJmLFxuICAweDEwLFxuICAweGM4LFxuICAweGFjLFxuICAweGJhLFxuICAweDJmLFxuICAweDEwLFxuICAweDI4LFxuICAweDM0LFxuICAweGZhLFxuICAweDAwLFxuICAweDAwLFxuICAweDdiLFxuICAweDAwLFxuICAweDAwLFxuICAweDA4LFxuICAweDE0LFxuICAweDJhLFxuICAweDE0LFxuICAweDIyLFxuICAweDIyLFxuICAweDE0LFxuICAweDJhLFxuICAweDE0LFxuICAweDA4LFxuICAweGFhLFxuICAweDAwLFxuICAweDU1LFxuICAweDAwLFxuICAweGFhLFxuICAweGFhLFxuICAweDU1LFxuICAweGFhLFxuICAweDU1LFxuICAweGFhLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweGZmLFxuICAweDAwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweGZmLFxuICAweDAwLFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweGZmLFxuICAweDAwLFxuICAweDEwLFxuICAweDEwLFxuICAweGZmLFxuICAweDAwLFxuICAweGZmLFxuICAweDEwLFxuICAweDEwLFxuICAweGYwLFxuICAweDEwLFxuICAweGYwLFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweGZjLFxuICAweDAwLFxuICAweDE0LFxuICAweDE0LFxuICAweGY3LFxuICAweDAwLFxuICAweGZmLFxuICAweDAwLFxuICAweDAwLFxuICAweGZmLFxuICAweDAwLFxuICAweGZmLFxuICAweDE0LFxuICAweDE0LFxuICAweGY0LFxuICAweDA0LFxuICAweGZjLFxuICAweDE0LFxuICAweDE0LFxuICAweDE3LFxuICAweDEwLFxuICAweDFmLFxuICAweDEwLFxuICAweDEwLFxuICAweDFmLFxuICAweDEwLFxuICAweDFmLFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDFmLFxuICAweDAwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweGYwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDFmLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDFmLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweGYwLFxuICAweDEwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweGZmLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweGZmLFxuICAweDEwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweGZmLFxuICAweDE0LFxuICAweDAwLFxuICAweDAwLFxuICAweGZmLFxuICAweDAwLFxuICAweGZmLFxuICAweDAwLFxuICAweDAwLFxuICAweDFmLFxuICAweDEwLFxuICAweDE3LFxuICAweDAwLFxuICAweDAwLFxuICAweGZjLFxuICAweDA0LFxuICAweGY0LFxuICAweDE0LFxuICAweDE0LFxuICAweDE3LFxuICAweDEwLFxuICAweDE3LFxuICAweDE0LFxuICAweDE0LFxuICAweGY0LFxuICAweDA0LFxuICAweGY0LFxuICAweDAwLFxuICAweDAwLFxuICAweGZmLFxuICAweDAwLFxuICAweGY3LFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweGY3LFxuICAweDAwLFxuICAweGY3LFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweDE3LFxuICAweDE0LFxuICAweDEwLFxuICAweDEwLFxuICAweDFmLFxuICAweDEwLFxuICAweDFmLFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweGY0LFxuICAweDE0LFxuICAweDEwLFxuICAweDEwLFxuICAweGYwLFxuICAweDEwLFxuICAweGYwLFxuICAweDAwLFxuICAweDAwLFxuICAweDFmLFxuICAweDEwLFxuICAweDFmLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDFmLFxuICAweDE0LFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweGZjLFxuICAweDE0LFxuICAweDAwLFxuICAweDAwLFxuICAweGYwLFxuICAweDEwLFxuICAweGYwLFxuICAweDEwLFxuICAweDEwLFxuICAweGZmLFxuICAweDEwLFxuICAweGZmLFxuICAweDE0LFxuICAweDE0LFxuICAweDE0LFxuICAweGZmLFxuICAweDE0LFxuICAweDEwLFxuICAweDEwLFxuICAweDEwLFxuICAweDFmLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweGYwLFxuICAweDEwLFxuICAweGZmLFxuICAweGZmLFxuICAweGZmLFxuICAweGZmLFxuICAweGZmLFxuICAweGYwLFxuICAweGYwLFxuICAweGYwLFxuICAweGYwLFxuICAweGYwLFxuICAweGZmLFxuICAweGZmLFxuICAweGZmLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweGZmLFxuICAweGZmLFxuICAweDBmLFxuICAweDBmLFxuICAweDBmLFxuICAweDBmLFxuICAweDBmLFxuICAweDM4LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDM4LFxuICAweDQ0LFxuICAweDdjLFxuICAweDJhLFxuICAweDJhLFxuICAweDNlLFxuICAweDE0LFxuICAweDdlLFxuICAweDAyLFxuICAweDAyLFxuICAweDA2LFxuICAweDA2LFxuICAweDAyLFxuICAweDdlLFxuICAweDAyLFxuICAweDdlLFxuICAweDAyLFxuICAweDYzLFxuICAweDU1LFxuICAweDQ5LFxuICAweDQxLFxuICAweDYzLFxuICAweDM4LFxuICAweDQ0LFxuICAweDQ0LFxuICAweDNjLFxuICAweDA0LFxuICAweDQwLFxuICAweDdlLFxuICAweDIwLFxuICAweDFlLFxuICAweDIwLFxuICAweDA2LFxuICAweDAyLFxuICAweDdlLFxuICAweDAyLFxuICAweDAyLFxuICAweDk5LFxuICAweGE1LFxuICAweGU3LFxuICAweGE1LFxuICAweDk5LFxuICAweDFjLFxuICAweDJhLFxuICAweDQ5LFxuICAweDJhLFxuICAweDFjLFxuICAweDRjLFxuICAweDcyLFxuICAweDAxLFxuICAweDcyLFxuICAweDRjLFxuICAweDMwLFxuICAweDRhLFxuICAweDRkLFxuICAweDRkLFxuICAweDMwLFxuICAweDMwLFxuICAweDQ4LFxuICAweDc4LFxuICAweDQ4LFxuICAweDMwLFxuICAweGJjLFxuICAweDYyLFxuICAweDVhLFxuICAweDQ2LFxuICAweDNkLFxuICAweDNlLFxuICAweDQ5LFxuICAweDQ5LFxuICAweDQ5LFxuICAweDAwLFxuICAweDdlLFxuICAweDAxLFxuICAweDAxLFxuICAweDAxLFxuICAweDdlLFxuICAweDJhLFxuICAweDJhLFxuICAweDJhLFxuICAweDJhLFxuICAweDJhLFxuICAweDQ0LFxuICAweDQ0LFxuICAweDVmLFxuICAweDQ0LFxuICAweDQ0LFxuICAweDQwLFxuICAweDUxLFxuICAweDRhLFxuICAweDQ0LFxuICAweDQwLFxuICAweDQwLFxuICAweDQ0LFxuICAweDRhLFxuICAweDUxLFxuICAweDQwLFxuICAweDAwLFxuICAweDAwLFxuICAweGZmLFxuICAweDAxLFxuICAweDAzLFxuICAweGUwLFxuICAweDgwLFxuICAweGZmLFxuICAweDAwLFxuICAweDAwLFxuICAweDA4LFxuICAweDA4LFxuICAweDZiLFxuICAweDZiLFxuICAweDA4LFxuICAweDM2LFxuICAweDEyLFxuICAweDM2LFxuICAweDI0LFxuICAweDM2LFxuICAweDA2LFxuICAweDBmLFxuICAweDA5LFxuICAweDBmLFxuICAweDA2LFxuICAweDAwLFxuICAweDAwLFxuICAweDE4LFxuICAweDE4LFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDEwLFxuICAweDEwLFxuICAweDAwLFxuICAweDMwLFxuICAweDQwLFxuICAweGZmLFxuICAweDAxLFxuICAweDAxLFxuICAweDAwLFxuICAweDFmLFxuICAweDAxLFxuICAweDAxLFxuICAweDFlLFxuICAweDAwLFxuICAweDE5LFxuICAweDFkLFxuICAweDE3LFxuICAweDEyLFxuICAweDAwLFxuICAweDNjLFxuICAweDNjLFxuICAweDNjLFxuICAweDNjLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuICAweDAwLFxuXTtcbiJdfQ==
