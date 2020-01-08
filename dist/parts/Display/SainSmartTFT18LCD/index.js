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
class SainSmartTFT18LCD {
    constructor() {
        this.keys = ['vcc', 'gnd', 'scl', 'sda', 'dc', 'res', 'cs'];
        this.required = ['scl', 'sda', 'dc', 'res', 'cs'];
        this.displayIoNames = {
            vcc: 'vcc',
            gnd: 'gnd',
            scl: 'scl',
            sda: 'sda',
            dc: 'dc',
            res: 'res',
            cs: 'cs',
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
    _initG() {
        // initialize for Green Tab
        this.writeCommand(ST7735_SLPOUT); //Sleep out & booster on
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
        let rotation = m % 4; // can't be higher than 3
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
        if (x0 < 0)
            x0 = 0;
        if (y0 < 0)
            y0 = 0;
        if (x1 < 0)
            x1 = 0;
        if (y1 < 0)
            y1 = 0;
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
    fillRect(x, y, w, h, color) {
        if (x >= this.width || y >= this.height)
            return;
        if (x + w - 1 >= this.width)
            w = this.width - x;
        if (y + h - 1 >= this.height)
            h = this.height - y;
        this.setAddrWindow(x, y, x + w - 1, y + h - 1);
        let hi = color >> 8, lo = color & 0xff;
        let data = [];
        for (y = h; y > 0; y--) {
            for (x = w; x > 0; x--) {
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
        if (x >= this.width || y >= this.height)
            return;
        if (y + h - 1 >= this.height)
            h = this.height - y;
        this.setAddrWindow(x, y, x, y + h - 1);
        let hi = color >> 8, lo = color & 0xff;
        let data = [];
        while (h--) {
            data.push(hi);
            data.push(lo);
        }
        this.writeData(data);
    }
    drawHLine(x, y, w, color) {
        if (x >= this.width || y >= this.height)
            return;
        if (x + w - 1 >= this.width)
            w = this.width - x;
        this.setAddrWindow(x, y, x + w - 1, y);
        let hi = color >> 8, lo = color & 0xff;
        let data = [];
        while (w--) {
            data.push(hi);
            data.push(lo);
        }
        this.writeData(data);
    }
    drawLine(x0, y0, x1, y1, color) {
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
        this.setAddrWindow(x, y, x + 1, y + 1);
        this.writeData([color >> 8, color & 0xff]);
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
    rawBound16(x, y, width, height, pixels) {
        let rgb = [];
        pixels.forEach(function (v) {
            rgb.push((v & 0xff00) >> 8);
            rgb.push(v & 0xff);
        });
        this.setAddrWindow(x, y, x + width - 1, y + height - 1);
        this._writeBuffer(rgb);
        this._writeBuffer(); //for flush
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
                rgb.push(r);
                rgb.push(g);
                rgb.push(b);
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
    rawBound(x, y, width, height, pixels) {
        let rgb = [];
        pixels.forEach(function (v) {
            rgb.push((v & 0xff0000) >> 16);
            rgb.push((v & 0xff00) >> 8);
            rgb.push(v & 0xff);
        });
        this.write(ST7735_COLMOD, [ST7735_18bit]); //18bit/pixel
        this.setAddrWindow(x, y, x + width - 1, y + height - 1);
        this._writeBuffer(rgb);
        this._writeBuffer(); //for flush
        this.write(ST7735_COLMOD, [ST7735_16bit]); //16bit/pixel
    }
    raw(pixels) {
        this.raw(0, 0, this.width, this.height, pixels);
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
    module.exports = SainSmartTFT18LCD;
}
//----------------------------------------------------------
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYXJ0cy9EaXNwbGF5L1NhaW5TbWFydFRGVDE4TENEL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSw2Q0FBNkM7QUFDN0MsTUFBTSxpQkFBaUI7SUFDckI7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsY0FBYyxHQUFHO1lBQ3BCLEdBQUcsRUFBRSxLQUFLO1lBQ1YsR0FBRyxFQUFFLEtBQUs7WUFDVixHQUFHLEVBQUUsS0FBSztZQUNWLEdBQUcsRUFBRSxLQUFLO1lBQ1YsRUFBRSxFQUFFLElBQUk7WUFDUixHQUFHLEVBQUUsS0FBSztZQUNWLEVBQUUsRUFBRSxJQUFJO1NBQ1QsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSTtRQUNULE9BQU87WUFDTCxJQUFJLEVBQUUsbUJBQW1CO1NBQzFCLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxD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QUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBQ0QsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUs7UUFDNUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ1YsQ0FBQyxFQUFFLENBQUM7Z0JBQ0osS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFDWCxDQUFDLElBQUksS0FBSyxDQUFDO2FBQ1o7WUFDRCxDQUFDLEVBQUUsQ0FBQztZQUNKLEtBQUssSUFB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QUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0QsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENB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QUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0NBQ0wsQ0FBQyIsImZpbGUiOiJwYXJ0cy9EaXNwbGF5L1NhaW5TbWFydFRGVDE4TENEL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9TYWluU21hcnQgU1Q3NzM1IDEuOFwiIFRGVCBMQ0QgMTI4eDE2MCBwaXhlbFxuY2xhc3MgU2FpblNtYXJ0VEZUMThMQ0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSBbJ3ZjYycsICdnbmQnLCAnc2NsJywgJ3NkYScsICdkYycsICdyZXMnLCAnY3MnXTtcbiAgICB0aGlzLnJlcXVpcmVkID0gWydzY2wnLCAnc2RhJywgJ2RjJywgJ3JlcycsICdjcyddO1xuXG4gICAgdGhpcy5kaXNwbGF5SW9OYW1lcyA9IHtcbiAgICAgIHZjYzogJ3ZjYycsXG4gICAgICBnbmQ6ICdnbmQnLFxuICAgICAgc2NsOiAnc2NsJyxcbiAgICAgIHNkYTogJ3NkYScsXG4gICAgICBkYzogJ2RjJyxcbiAgICAgIHJlczogJ3JlcycsXG4gICAgICBjczogJ2NzJyxcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGluZm8oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdTYWluU21hcnRURlQxOExDRCcsXG4gICAgfTtcbiAgfVxuXG4gIHdpcmVkKG9ibml6KSB7XG4gICAgdGhpcy5kZWJ1Z3ByaW50ID0gZmFsc2U7XG4gICAgdGhpcy5vYm5peiA9IG9ibml6O1xuICAgIHRoaXMuaW9fZGMgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5kYyk7XG4gICAgdGhpcy5pb19yZXMgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5yZXMpO1xuICAgIHRoaXMuaW9fY3MgPSBvYm5pei5nZXRJTyh0aGlzLnBhcmFtcy5jcyk7XG5cbiAgICB0aGlzLm9ibml6LnNldFZjY0duZCh0aGlzLnBhcmFtcy52Y2MsIHRoaXMucGFyYW1zLmduZCwgJzV2Jyk7XG4gICAgdGhpcy5wYXJhbXMuZnJlcXVlbmN5ID0gMTYgKiAxMDAwICogMTAwMDsgLy8xNk1IelxuICAgIHRoaXMucGFyYW1zLm1vZGUgPSAnbWFzdGVyJztcbiAgICB0aGlzLnBhcmFtcy5jbGsgPSB0aGlzLnBhcmFtcy5zY2w7XG4gICAgdGhpcy5wYXJhbXMubW9zaSA9IHRoaXMucGFyYW1zLnNkYTtcbiAgICB0aGlzLnBhcmFtcy5kcml2ZSA9ICczdic7XG4gICAgdGhpcy5zcGkgPSB0aGlzLm9ibml6LmdldFNwaVdpdGhDb25maWcodGhpcy5wYXJhbXMpO1xuXG4gICAgdGhpcy5pb19kYy5vdXRwdXQodHJ1ZSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuXG4gICAgdGhpcy53aWR0aCA9IFNUNzczNV9URlRXSURUSDtcbiAgICB0aGlzLmhlaWdodCA9IFNUNzczNV9URlRIRUlHSFQ7XG5cbiAgICB0aGlzLndyaXRlQnVmZmVyID0gW107IC8vMTAyNGJ5dGVzIGJ1ZmZlcnJpbmdcblxuICAgIHRoaXMuX3NldFByZXNldENvbG9yKCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwcmludF9kZWJ1Zyh2KSB7XG4gICAgaWYgKHRoaXMuZGVidWdwcmludCkge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICdTYWluU21hcnRURlQxOExDRDogJyArIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignJylcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIF9kZWFkU2xlZXAod2FpdE1zZWMpIHtcbiAgICBsZXQgc3RhcnRNc2VjID0gbmV3IERhdGUoKTtcbiAgICB3aGlsZSAobmV3IERhdGUoKSAtIHN0YXJ0TXNlYyA8IHdhaXRNc2VjKTtcbiAgfVxuICBfcmVzZXQoKSB7XG4gICAgdGhpcy5pb19yZXMub3V0cHV0KGZhbHNlKTtcbiAgICB0aGlzLl9kZWFkU2xlZXAoMTApO1xuICAgIHRoaXMuaW9fcmVzLm91dHB1dCh0cnVlKTtcbiAgICB0aGlzLl9kZWFkU2xlZXAoMTApO1xuICB9XG5cbiAgd3JpdGVDb21tYW5kKGNtZCkge1xuICAgIHRoaXMuaW9fZGMub3V0cHV0KGZhbHNlKTtcbiAgICB0aGlzLmlvX2NzLm91dHB1dChmYWxzZSk7XG4gICAgdGhpcy5zcGkud3JpdGUoW2NtZF0pO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KHRydWUpO1xuICB9XG4gIHdyaXRlRGF0YShkYXRhKSB7XG4gICAgdGhpcy5pb19kYy5vdXRwdXQodHJ1ZSk7XG4gICAgdGhpcy5pb19jcy5vdXRwdXQoZmFsc2UpO1xuICAgIHRoaXMuc3BpLndyaXRlKGRhdGEpO1xuICAgIHRoaXMuaW9fY3Mub3V0cHV0KHRydWUpO1xuICB9XG4gIHdyaXRlKGNtZCwgZGF0YSkge1xuICAgIGlmIChkYXRhLmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoY21kKTtcbiAgICB0aGlzLndyaXRlRGF0YShkYXRhKTtcbiAgfVxuICBhc3luYyBhc3luY3dhaXQoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuc3BpLndyaXRlV2FpdChbMHgwMF0pO1xuICB9XG4gIF93cml0ZUZsdXNoKCkge1xuICAgIHdoaWxlICh0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLndyaXRlQnVmZmVyLmxlbmd0aCA+IDEwMjQpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLndyaXRlQnVmZmVyLnNsaWNlKDAsIDEwMjQpO1xuICAgICAgICB0aGlzLndyaXRlRGF0YShkYXRhKTtcbiAgICAgICAgdGhpcy53cml0ZUJ1ZmZlci5zcGxpY2UoMCwgMTAyNCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy53cml0ZUJ1ZmZlci5sZW5ndGggPiAwKSB0aGlzLndyaXRlRGF0YSh0aGlzLndyaXRlQnVmZmVyKTtcbiAgICAgICAgdGhpcy53cml0ZUJ1ZmZlciA9IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBfd3JpdGVCdWZmZXIoZGF0YSkge1xuICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy53cml0ZUJ1ZmZlciA9IHRoaXMud3JpdGVCdWZmZXIuY29uY2F0KGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93cml0ZUZsdXNoKCk7XG4gICAgfVxuICB9XG5cbiAgY29sb3IxNihyLCBnLCBiKSB7XG4gICAgLy8gIDFzdCBieXRlICAociAmIDB4RjggfCBnID4+IDUpXG4gICAgLy8gIDJuZCBieXRlICAoZyAmIDB4RkMgPDwgMyB8IGIgPj4gMylcbiAgICByZXR1cm4gKChyICYgMHhmOCkgPDwgOCkgfCAoKGcgJiAweGZjKSA8PCAzKSB8IChiID4+IDMpO1xuICB9XG5cbiAgX2luaXRHKCkge1xuICAgIC8vIGluaXRpYWxpemUgZm9yIEdyZWVuIFRhYlxuICAgIHRoaXMud3JpdGVDb21tYW5kKFNUNzczNV9TTFBPVVQpOyAvL1NsZWVwIG91dCAmIGJvb3N0ZXIgb25cbiAgICB0aGlzLm9ibml6LndhaXQoMTIwKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9GUk1DVFIxLCBbMHgwMSwgMHgyYywgMHgyZF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0ZSTUNUUjIsIFsweDAxLCAweDJjLCAweDJkXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfRlJNQ1RSMywgWzB4MDEsIDB4MmMsIDB4MmQsIDB4MDEsIDB4MmMsIDB4MmRdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9JTlZDVFIsIFsweDA3XSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUFdDVFIxLCBbMHhhMiwgMHgwMiwgMHg4NF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1BXQ1RSMiwgWzB4YzVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9QV0NUUjMsIFsweDBhLCAweDAwXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfUFdDVFI0LCBbMHg4YSwgMHgyYV0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1BXQ1RSNSwgWzB4OGEsIDB4ZWVdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9WTUNUUjEsIFsweDBlXSk7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfR01DVFJQMSwgW1xuICAgICAgMHgwMixcbiAgICAgIDB4MWMsXG4gICAgICAweDA3LFxuICAgICAgMHgxMixcbiAgICAgIDB4MzcsXG4gICAgICAweDMyLFxuICAgICAgMHgyOSxcbiAgICAgIDB4MmQsXG4gICAgICAweDI5LFxuICAgICAgMHgyNSxcbiAgICAgIDB4MmIsXG4gICAgICAweDM5LFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDEsXG4gICAgICAweDAzLFxuICAgICAgMHgxMCxcbiAgICBdKTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9HTUNUUk4xLCBbXG4gICAgICAweDAzLFxuICAgICAgMHgxZCxcbiAgICAgIDB4MDcsXG4gICAgICAweDA2LFxuICAgICAgMHgyZSxcbiAgICAgIDB4MmMsXG4gICAgICAweDI5LFxuICAgICAgMHgyZCxcbiAgICAgIDB4MmUsXG4gICAgICAweDJlLFxuICAgICAgMHgzNyxcbiAgICAgIDB4M2YsXG4gICAgICAweDAwLFxuICAgICAgMHgwMCxcbiAgICAgIDB4MDIsXG4gICAgICAweDEwLFxuICAgIF0pO1xuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xNmJpdF0pOyAvLyBjb2xvciBmb3JtYXQ6IDE2Yml0L3BpeGVsXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgdGhpcy5faW5pdEcoKTtcbiAgICB0aGlzLnNldERpc3BsYXlPbigpO1xuICAgIHRoaXMuc2V0Um90YXRpb24oMCk7XG4gIH1cblxuICBzZXREaXNwbGF5T24oKSB7XG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X0RJU1BPTik7XG4gIH1cbiAgc2V0RGlzcGxheU9mZigpIHtcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfRElTUE9GRik7XG4gIH1cbiAgc2V0RGlzcGxheShvbikge1xuICAgIGlmIChvbiA9PSB0cnVlKSB0aGlzLnNldERpc3BsYXlPbigpO1xuICAgIGVsc2UgdGhpcy5zZXREaXNwbGF5T2ZmKCk7XG4gIH1cblxuICBzZXRJbnZlcnNpb25PbigpIHtcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfSU5WT04pO1xuICB9XG4gIHNldEludmVyc2lvbk9mZigpIHtcbiAgICB0aGlzLndyaXRlQ29tbWFuZChTVDc3MzVfSU5WT0ZGKTtcbiAgfVxuICBzZXRJbnZlcnNpb24oaW52ZXJzaW9uKSB7XG4gICAgaWYgKGludmVyc2lvbiA9PSB0cnVlKSB0aGlzLnNldEludmVyc2lvbk9uKCk7XG4gICAgZWxzZSB0aGlzLnNldEludmVyc2lvbk9mZigpO1xuICB9XG5cbiAgc2V0Um90YXRpb24obSkge1xuICAgIGNvbnN0IE1BRENUTF9NWSA9IDB4ODA7XG4gICAgY29uc3QgTUFEQ1RMX01YID0gMHg0MDtcbiAgICBjb25zdCBNQURDVExfTVYgPSAweDIwO1xuICAgIC8vIGNvbnN0IE1BRENUTF9NTCA9IDB4MTA7XG4gICAgY29uc3QgTUFEQ1RMX1JHQiA9IDB4MDA7IC8vYWx3YXlzIFJHQiwgbmV2ZXIgQkdSXG4gICAgLy8gY29uc3QgTUFEQ1RMX01IID0gMHgwNDtcblxuICAgIGxldCBkYXRhO1xuICAgIGxldCByb3RhdGlvbiA9IG0gJSA0OyAvLyBjYW4ndCBiZSBoaWdoZXIgdGhhbiAzXG4gICAgc3dpdGNoIChyb3RhdGlvbikge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkYXRhID0gW01BRENUTF9NWCB8IE1BRENUTF9NWSB8IE1BRENUTF9SR0JdO1xuICAgICAgICB0aGlzLndpZHRoID0gU1Q3NzM1X1RGVFdJRFRIO1xuICAgICAgICB0aGlzLmhlaWdodCA9IFNUNzczNV9URlRIRUlHSFQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICBkYXRhID0gW01BRENUTF9NWSB8IE1BRENUTF9NViB8IE1BRENUTF9SR0JdO1xuICAgICAgICB0aGlzLndpZHRoID0gU1Q3NzM1X1RGVEhFSUdIVDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBTVDc3MzVfVEZUV0lEVEg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBkYXRhID0gW01BRENUTF9SR0JdO1xuICAgICAgICB0aGlzLndpZHRoID0gU1Q3NzM1X1RGVFdJRFRIO1xuICAgICAgICB0aGlzLmhlaWdodCA9IFNUNzczNV9URlRIRUlHSFQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBkYXRhID0gW01BRENUTF9NWCB8IE1BRENUTF9NViB8IE1BRENUTF9SR0JdO1xuICAgICAgICB0aGlzLndpZHRoID0gU1Q3NzM1X1RGVEhFSUdIVDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBTVDc3MzVfVEZUV0lEVEg7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLndyaXRlKFNUNzczNV9NQURDVEwsIGRhdGEpO1xuICAgIHRoaXMuc2V0QWRkcldpbmRvdygwLCAwLCB0aGlzLndpZHRoIC0gMSwgdGhpcy5oZWlnaHQgLSAxKTtcbiAgfVxuXG4gIHNldEFkZHJXaW5kb3coeDAsIHkwLCB4MSwgeTEpIHtcbiAgICB0aGlzLnByaW50X2RlYnVnKFxuICAgICAgYHNldEFkZHJXaW5kb3c6ICh4MDogJHt4MH0sIHkwOiAke3kwfSkgLSAoeDE6ICR7eDF9LCB5MTogJHt5MX0pYFxuICAgICk7XG5cbiAgICBpZiAoeDAgPCAwKSB4MCA9IDA7XG4gICAgaWYgKHkwIDwgMCkgeTAgPSAwO1xuICAgIGlmICh4MSA8IDApIHgxID0gMDtcbiAgICBpZiAoeTEgPCAwKSB5MSA9IDA7XG5cbiAgICAvLyBjb2x1bW4gYWRkciBzZXRcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DQVNFVCwgWzB4MDAsIHgwLCAweDAwLCB4MV0pOyAvLyBYU1RBUlQtWEVORFxuICAgIC8vIHJvdyBhZGRyIHNldFxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X1JBU0VULCBbMHgwMCwgeTAsIDB4MDAsIHkxXSk7IC8vIFlTVEFSVC1ZRU5EXG4gICAgLy8gd3JpdGUgdG8gUkFNXG4gICAgdGhpcy53cml0ZUNvbW1hbmQoU1Q3NzM1X1JBTVdSKTtcbiAgICB0aGlzLndyaXRlQnVmZmVyID0gW107XG4gIH1cblxuICAvL19fc3dhcChhLCBiKSB7IGxldCB0ID0gYTsgYSA9IGI7IGIgPSB0OyB9XG5cbiAgZmlsbFNjcmVlbihjb2xvcikge1xuICAgIHRoaXMuZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIGNvbG9yKTtcbiAgfVxuICBmaWxsUmVjdCh4LCB5LCB3LCBoLCBjb2xvcikge1xuICAgIGlmICh4ID49IHRoaXMud2lkdGggfHwgeSA+PSB0aGlzLmhlaWdodCkgcmV0dXJuO1xuICAgIGlmICh4ICsgdyAtIDEgPj0gdGhpcy53aWR0aCkgdyA9IHRoaXMud2lkdGggLSB4O1xuICAgIGlmICh5ICsgaCAtIDEgPj0gdGhpcy5oZWlnaHQpIGggPSB0aGlzLmhlaWdodCAtIHk7XG5cbiAgICB0aGlzLnNldEFkZHJXaW5kb3coeCwgeSwgeCArIHcgLSAxLCB5ICsgaCAtIDEpO1xuXG4gICAgbGV0IGhpID0gY29sb3IgPj4gOCxcbiAgICAgIGxvID0gY29sb3IgJiAweGZmO1xuICAgIGxldCBkYXRhID0gW107XG5cbiAgICBmb3IgKHkgPSBoOyB5ID4gMDsgeS0tKSB7XG4gICAgICBmb3IgKHggPSB3OyB4ID4gMDsgeC0tKSB7XG4gICAgICAgIGRhdGEucHVzaChoaSk7XG4gICAgICAgIGRhdGEucHVzaChsbyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3dyaXRlQnVmZmVyKGRhdGEpO1xuICAgIHRoaXMuX3dyaXRlQnVmZmVyKCk7IC8vZm9yIGZsdXNoXG4gIH1cbiAgZHJhd1JlY3QoeCwgeSwgdywgaCwgY29sb3IpIHtcbiAgICB0aGlzLmRyYXdITGluZSh4LCB5LCB3LCBjb2xvcik7XG4gICAgdGhpcy5kcmF3SExpbmUoeCwgeSArIGggLSAxLCB3LCBjb2xvcik7XG4gICAgdGhpcy5kcmF3VkxpbmUoeCwgeSwgaCwgY29sb3IpO1xuICAgIHRoaXMuZHJhd1ZMaW5lKHggKyB3IC0gMSwgeSwgaCwgY29sb3IpO1xuICB9XG4gIGRyYXdDaXJjbGUoeDAsIHkwLCByLCBjb2xvcikge1xuICAgIGxldCBmID0gMSAtIHI7XG4gICAgbGV0IGRkRl94ID0gMTtcbiAgICBsZXQgZGRGX3kgPSAtMiAqIHI7XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gcjtcblxuICAgIHRoaXMuZHJhd1BpeGVsKHgwLCB5MCArIHIsIGNvbG9yKTtcbiAgICB0aGlzLmRyYXdQaXhlbCh4MCwgeTAgLSByLCBjb2xvcik7XG4gICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyByLCB5MCwgY29sb3IpO1xuICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0gciwgeTAsIGNvbG9yKTtcblxuICAgIHdoaWxlICh4IDwgeSkge1xuICAgICAgaWYgKGYgPj0gMCkge1xuICAgICAgICB5LS07XG4gICAgICAgIGRkRl95ICs9IDI7XG4gICAgICAgIGYgKz0gZGRGX3k7XG4gICAgICB9XG4gICAgICB4Kys7XG4gICAgICBkZEZfeCArPSAyO1xuICAgICAgZiArPSBkZEZfeDtcblxuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB4LCB5MCArIHksIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geCwgeTAgKyB5LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHgsIHkwIC0geSwgY29sb3IpO1xuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgLSB4LCB5MCAtIHksIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwICsgeSwgeTAgKyB4LCBjb2xvcik7XG4gICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHksIHkwICsgeCwgY29sb3IpO1xuICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB5LCB5MCAtIHgsIGNvbG9yKTtcbiAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geSwgeTAgLSB4LCBjb2xvcik7XG4gICAgfVxuICB9XG4gIF9kcmF3Q2lyY2xlSGVscGVyKHgwLCB5MCwgciwgY29ybmVybmFtZSwgY29sb3IpIHtcbiAgICBsZXQgZiA9IDEgLSByO1xuICAgIGxldCBkZEZfeCA9IDE7XG4gICAgbGV0IGRkRl95ID0gLTIgKiByO1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgeSA9IHI7XG5cbiAgICB3aGlsZSAoeCA8IHkpIHtcbiAgICAgIGlmIChmID49IDApIHtcbiAgICAgICAgeS0tO1xuICAgICAgICBkZEZfeSArPSAyO1xuICAgICAgICBmICs9IGRkRl95O1xuICAgICAgfVxuICAgICAgeCsrO1xuICAgICAgZGRGX3ggKz0gMjtcbiAgICAgIGYgKz0gZGRGX3g7XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4NCkge1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHgsIHkwICsgeSwgY29sb3IpO1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCArIHksIHkwICsgeCwgY29sb3IpO1xuICAgICAgfVxuICAgICAgaWYgKGNvcm5lcm5hbWUgJiAweDIpIHtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB4LCB5MCAtIHksIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeDAgKyB5LCB5MCAtIHgsIGNvbG9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb3JuZXJuYW1lICYgMHg4KSB7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geSwgeTAgKyB4LCBjb2xvcik7XG4gICAgICAgIHRoaXMuZHJhd1BpeGVsKHgwIC0geCwgeTAgKyB5LCBjb2xvcik7XG4gICAgICB9XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4MSkge1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHksIHkwIC0geCwgY29sb3IpO1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCAtIHgsIHkwIC0geSwgY29sb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmaWxsQ2lyY2xlKHgwLCB5MCwgciwgY29sb3IpIHtcbiAgICB0aGlzLmRyYXdWTGluZSh4MCwgeTAgLSByLCAyICogciArIDEsIGNvbG9yKTtcbiAgICB0aGlzLl9maWxsQ2lyY2xlSGVscGVyKHgwLCB5MCwgciwgMywgMCwgY29sb3IpO1xuICB9XG4gIF9maWxsQ2lyY2xlSGVscGVyKHgwLCB5MCwgciwgY29ybmVybmFtZSwgZGVsdGEsIGNvbG9yKSB7XG4gICAgbGV0IGYgPSAxIC0gcjtcbiAgICBsZXQgZGRGX3ggPSAxO1xuICAgIGxldCBkZEZfeSA9IC0yICogcjtcbiAgICBsZXQgeCA9IDA7XG4gICAgbGV0IHkgPSByO1xuXG4gICAgd2hpbGUgKHggPCB5KSB7XG4gICAgICBpZiAoZiA+PSAwKSB7XG4gICAgICAgIHktLTtcbiAgICAgICAgZGRGX3kgKz0gMjtcbiAgICAgICAgZiArPSBkZEZfeTtcbiAgICAgIH1cbiAgICAgIHgrKztcbiAgICAgIGRkRl94ICs9IDI7XG4gICAgICBmICs9IGRkRl94O1xuXG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4MSkge1xuICAgICAgICB0aGlzLmRyYXdWTGluZSh4MCArIHgsIHkwIC0geSwgMiAqIHkgKyAxICsgZGVsdGEsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3VkxpbmUoeDAgKyB5LCB5MCAtIHgsIDIgKiB4ICsgMSArIGRlbHRhLCBjb2xvcik7XG4gICAgICB9XG4gICAgICBpZiAoY29ybmVybmFtZSAmIDB4Mikge1xuICAgICAgICB0aGlzLmRyYXdWTGluZSh4MCAtIHgsIHkwIC0geSwgMiAqIHkgKyAxICsgZGVsdGEsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5kcmF3VkxpbmUoeDAgLSB5LCB5MCAtIHgsIDIgKiB4ICsgMSArIGRlbHRhLCBjb2xvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGRyYXdSb3VuZFJlY3QoeCwgeSwgdywgaCwgciwgY29sb3IpIHtcbiAgICB0aGlzLmRyYXdITGluZSh4ICsgciwgeSwgdyAtIDIgKiByLCBjb2xvcik7IC8vIFRvcFxuICAgIHRoaXMuZHJhd0hMaW5lKHggKyByLCB5ICsgaCAtIDEsIHcgLSAyICogciwgY29sb3IpOyAvLyBCb3R0b21cbiAgICB0aGlzLmRyYXdWTGluZSh4LCB5ICsgciwgaCAtIDIgKiByLCBjb2xvcik7IC8vIExlZnRcbiAgICB0aGlzLmRyYXdWTGluZSh4ICsgdyAtIDEsIHkgKyByLCBoIC0gMiAqIHIsIGNvbG9yKTsgLy8gUmlnaHRcblxuICAgIHRoaXMuX2RyYXdDaXJjbGVIZWxwZXIoeCArIHIsIHkgKyByLCByLCAxLCBjb2xvcik7XG4gICAgdGhpcy5fZHJhd0NpcmNsZUhlbHBlcih4ICsgdyAtIHIgLSAxLCB5ICsgciwgciwgMiwgY29sb3IpO1xuICAgIHRoaXMuX2RyYXdDaXJjbGVIZWxwZXIoeCArIHcgLSByIC0gMSwgeSArIGggLSByIC0gMSwgciwgNCwgY29sb3IpO1xuICAgIHRoaXMuX2RyYXdDaXJjbGVIZWxwZXIoeCArIHIsIHkgKyBoIC0gciAtIDEsIHIsIDgsIGNvbG9yKTtcbiAgfVxuICBmaWxsUm91bmRSZWN0KHgsIHksIHcsIGgsIHIsIGNvbG9yKSB7XG4gICAgdGhpcy5maWxsUmVjdCh4ICsgciwgeSwgdyAtIDIgKiByLCBoLCBjb2xvcik7XG5cbiAgICB0aGlzLl9maWxsQ2lyY2xlSGVscGVyKHggKyB3IC0gciAtIDEsIHkgKyByLCByLCAxLCBoIC0gMiAqIHIgLSAxLCBjb2xvcik7XG4gICAgdGhpcy5fZmlsbENpcmNsZUhlbHBlcih4ICsgciwgeSArIHIsIHIsIDIsIGggLSAyICogciAtIDEsIGNvbG9yKTtcbiAgfVxuICBkcmF3VHJpYW5nbGUoeDAsIHkwLCB4MSwgeTEsIHgyLCB5MiwgY29sb3IpIHtcbiAgICB0aGlzLmRyYXdMaW5lKHgwLCB5MCwgeDEsIHkxLCBjb2xvcik7XG4gICAgdGhpcy5kcmF3TGluZSh4MSwgeTEsIHgyLCB5MiwgY29sb3IpO1xuICAgIHRoaXMuZHJhd0xpbmUoeDIsIHkyLCB4MCwgeTAsIGNvbG9yKTtcbiAgfVxuICBmaWxsVHJpYW5nbGUoeDAsIHkwLCB4MSwgeTEsIHgyLCB5MiwgY29sb3IpIHtcbiAgICBsZXQgYSwgYiwgeSwgbGFzdDtcblxuICAgIC8vIFNvcnQgY29vcmRpbmF0ZXMgYnkgWSBvcmRlciAoeTIgPj0geTEgPj0geTApXG4gICAgaWYgKHkwID4geTEpIHtcbiAgICAgIHkxID0gW3kwLCAoeTAgPSB5MSldWzBdOyAvL3RoaXMuX3N3YXAoeTAsIHkxKTtcbiAgICAgIHgxID0gW3gwLCAoeDAgPSB4MSldWzBdOyAvL3RoaXMuX3N3YXAoeDAsIHgxKTtcbiAgICB9XG4gICAgaWYgKHkxID4geTIpIHtcbiAgICAgIHkyID0gW3kxLCAoeTEgPSB5MildWzBdOyAvL3RoaXMuX3N3YXAoeTIsIHkxKTtcbiAgICAgIHgyID0gW3gxLCAoeDEgPSB4MildWzBdOyAvL3RoaXMuX3N3YXAoeDIsIHgxKTtcbiAgICB9XG4gICAgaWYgKHkwID4geTEpIHtcbiAgICAgIHkxID0gW3kwLCAoeTAgPSB5MSldWzBdOyAvL3RoaXMuX3N3YXAoeTAsIHkxKTtcbiAgICAgIHgxID0gW3gwLCAoeDAgPSB4MSldWzBdOyAvL3RoaXMuX3N3YXAoeDAsIHgxKTtcbiAgICB9XG5cbiAgICBpZiAoeTAgPT0geTIpIHtcbiAgICAgIC8vIEhhbmRsZSBhd2t3YXJkIGFsbC1vbi1zYW1lLWxpbmUgY2FzZSBhcyBpdHMgb3duIHRoaW5nXG4gICAgICBhID0gYiA9IHgwO1xuICAgICAgaWYgKHgxIDwgYSkgYSA9IHgxO1xuICAgICAgZWxzZSBpZiAoeDEgPiBiKSBiID0geDE7XG4gICAgICBpZiAoeDIgPCBhKSBhID0geDI7XG4gICAgICBlbHNlIGlmICh4MiA+IGIpIGIgPSB4MjtcbiAgICAgIHRoaXMuZHJhd0hMaW5lKGEsIHkwLCBiIC0gYSArIDEsIGNvbG9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZHgwMSA9IHgxIC0geDAsXG4gICAgICBkeTAxID0geTEgLSB5MCxcbiAgICAgIGR4MDIgPSB4MiAtIHgwLFxuICAgICAgZHkwMiA9IHkyIC0geTAsXG4gICAgICBkeDEyID0geDIgLSB4MSxcbiAgICAgIGR5MTIgPSB5MiAtIHkxLFxuICAgICAgc2EgPSAwLFxuICAgICAgc2IgPSAwO1xuXG4gICAgaWYgKHkxID09IHkyKSBsYXN0ID0geTE7XG4gICAgLy8gaW5jbHVkZSB5MSBzY2FubGluZVxuICAgIGVsc2UgbGFzdCA9IHkxIC0gMTsgLy8gc2tpcCBpdFxuXG4gICAgZm9yICh5ID0geTA7IHkgPD0gbGFzdDsgeSsrKSB7XG4gICAgICBhID0geDAgKyBNYXRoLmZsb29yKHNhIC8gZHkwMSk7XG4gICAgICBiID0geDAgKyBNYXRoLmZsb29yKHNiIC8gZHkwMik7XG4gICAgICBzYSArPSBkeDAxO1xuICAgICAgc2IgKz0gZHgwMjtcbiAgICAgIGlmIChhID4gYikgYiA9IFthLCAoYSA9IGIpXVswXTsgLy90aGlzLl9zd2FwKGEsYik7XG4gICAgICB0aGlzLmRyYXdITGluZShhLCB5LCBiIC0gYSArIDEsIGNvbG9yKTtcbiAgICB9XG5cbiAgICBzYSA9IGR4MTIgKiAoeSAtIHkxKTtcbiAgICBzYiA9IGR4MDIgKiAoeSAtIHkwKTtcbiAgICBmb3IgKDsgeSA8PSB5MjsgeSsrKSB7XG4gICAgICBhID0geDEgKyBNYXRoLmZsb29yKHNhIC8gZHkxMik7XG4gICAgICBiID0geDAgKyBNYXRoLmZsb29yKHNiIC8gZHkwMik7XG4gICAgICBzYSArPSBkeDEyO1xuICAgICAgc2IgKz0gZHgwMjtcbiAgICAgIGlmIChhID4gYikgYiA9IFthLCAoYSA9IGIpXVswXTsgLy90aGlzLl9zd2FwKGEsYik7XG4gICAgICB0aGlzLmRyYXdITGluZShhLCB5LCBiIC0gYSArIDEsIGNvbG9yKTtcbiAgICB9XG4gIH1cbiAgZHJhd1ZMaW5lKHgsIHksIGgsIGNvbG9yKSB7XG4gICAgaWYgKHggPj0gdGhpcy53aWR0aCB8fCB5ID49IHRoaXMuaGVpZ2h0KSByZXR1cm47XG4gICAgaWYgKHkgKyBoIC0gMSA+PSB0aGlzLmhlaWdodCkgaCA9IHRoaXMuaGVpZ2h0IC0geTtcblxuICAgIHRoaXMuc2V0QWRkcldpbmRvdyh4LCB5LCB4LCB5ICsgaCAtIDEpO1xuXG4gICAgbGV0IGhpID0gY29sb3IgPj4gOCxcbiAgICAgIGxvID0gY29sb3IgJiAweGZmO1xuICAgIGxldCBkYXRhID0gW107XG4gICAgd2hpbGUgKGgtLSkge1xuICAgICAgZGF0YS5wdXNoKGhpKTtcbiAgICAgIGRhdGEucHVzaChsbyk7XG4gICAgfVxuICAgIHRoaXMud3JpdGVEYXRhKGRhdGEpO1xuICB9XG4gIGRyYXdITGluZSh4LCB5LCB3LCBjb2xvcikge1xuICAgIGlmICh4ID49IHRoaXMud2lkdGggfHwgeSA+PSB0aGlzLmhlaWdodCkgcmV0dXJuO1xuICAgIGlmICh4ICsgdyAtIDEgPj0gdGhpcy53aWR0aCkgdyA9IHRoaXMud2lkdGggLSB4O1xuXG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgsIHksIHggKyB3IC0gMSwgeSk7XG5cbiAgICBsZXQgaGkgPSBjb2xvciA+PiA4LFxuICAgICAgbG8gPSBjb2xvciAmIDB4ZmY7XG4gICAgbGV0IGRhdGEgPSBbXTtcbiAgICB3aGlsZSAody0tKSB7XG4gICAgICBkYXRhLnB1c2goaGkpO1xuICAgICAgZGF0YS5wdXNoKGxvKTtcbiAgICB9XG4gICAgdGhpcy53cml0ZURhdGEoZGF0YSk7XG4gIH1cbiAgZHJhd0xpbmUoeDAsIHkwLCB4MSwgeTEsIGNvbG9yKSB7XG4gICAgbGV0IHN0ZXAgPSBNYXRoLmFicyh5MSAtIHkwKSA+IE1hdGguYWJzKHgxIC0geDApO1xuICAgIGlmIChzdGVwKSB7XG4gICAgICB5MCA9IFt4MCwgKHgwID0geTApXVswXTsgLy90aGlzLl9zd2FwKHgwLCB5MCk7XG4gICAgICB5MSA9IFt4MSwgKHgxID0geTEpXVswXTsgLy90aGlzLl9zd2FwKHgxLCB5MSk7XG4gICAgfVxuICAgIGlmICh4MCA+IHgxKSB7XG4gICAgICB4MSA9IFt4MCwgKHgwID0geDEpXVswXTsgLy90aGlzLl9zd2FwKHgwLCB4MSk7XG4gICAgICB5MSA9IFt5MCwgKHkwID0geTEpXVswXTsgLy90aGlzLl9zd2FwKHkwLCB5MSk7XG4gICAgfVxuXG4gICAgbGV0IGR4ID0geDEgLSB4MDtcbiAgICBsZXQgZHkgPSBNYXRoLmFicyh5MSAtIHkwKTtcblxuICAgIGxldCBlcnIgPSBkeCAvIDI7XG4gICAgbGV0IHlzdGVwID0geTAgPCB5MSA/IDEgOiAtMTtcblxuICAgIGZvciAoOyB4MCA8PSB4MTsgeDArKykge1xuICAgICAgaWYgKHN0ZXApIHtcbiAgICAgICAgdGhpcy5kcmF3UGl4ZWwoeTAsIHgwLCBjb2xvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdQaXhlbCh4MCwgeTAsIGNvbG9yKTtcbiAgICAgIH1cbiAgICAgIGVyciAtPSBkeTtcbiAgICAgIGlmIChlcnIgPCAwKSB7XG4gICAgICAgIHkwICs9IHlzdGVwO1xuICAgICAgICBlcnIgKz0gZHg7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGRyYXdQaXhlbCh4LCB5LCBjb2xvcikge1xuICAgIGlmICh4IDwgMCB8fCB4ID49IHRoaXMud2lkdGggfHwgeSA8IDAgfHwgeSA+PSB0aGlzLmhlaWdodCkgcmV0dXJuO1xuXG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgsIHksIHggKyAxLCB5ICsgMSk7XG4gICAgdGhpcy53cml0ZURhdGEoW2NvbG9yID4+IDgsIGNvbG9yICYgMHhmZl0pO1xuICB9XG4gIGRyYXdDaGFyKHgsIHksIGNoLCBjb2xvciwgYmcsIHNpemUpIHtcbiAgICAvLyAgYmcgPSBiZyB8fCBjb2xvcjtcbiAgICBzaXplID0gc2l6ZSB8fCAxO1xuICAgIGlmIChcbiAgICAgIHggPj0gdGhpcy53aWR0aCB8fCAvLyBDbGlwIHJpZ2h0XG4gICAgICB5ID49IHRoaXMuaGVpZ2h0IHx8IC8vIENsaXAgYm90dG9tXG4gICAgICB4ICsgNiAqIHNpemUgLSAxIDwgMCB8fCAvLyBDbGlwIGxlZnRcbiAgICAgIHkgKyA4ICogc2l6ZSAtIDEgPCAwXG4gICAgKVxuICAgICAgLy8gQ2xpcCB0b3BcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChjb2xvciAhPSBiZykge1xuICAgICAgdGhpcy5kcmF3Q2hhcjIoeCwgeSwgY2gsIGNvbG9yLCBiZywgc2l6ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGMgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICBsZXQgbGluZSA9IGkgPT0gNSA/IDAgOiBmb250W2MgKiA1ICsgaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDg7IGorKykge1xuICAgICAgICBpZiAobGluZSAmIDB4MSkge1xuICAgICAgICAgIGlmIChzaXplID09IDEpXG4gICAgICAgICAgICAvLyBkZWZhdWx0IHNpemVcbiAgICAgICAgICAgIHRoaXMuZHJhd1BpeGVsKHggKyBpLCB5ICsgaiwgY29sb3IpO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gYmlnIHNpemVcbiAgICAgICAgICAgIHRoaXMuZmlsbFJlY3QoeCArIGkgKiBzaXplLCB5ICsgaiAqIHNpemUsIHNpemUsIHNpemUsIGNvbG9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYmcgIT0gY29sb3IpIHtcbiAgICAgICAgICBpZiAoc2l6ZSA9PSAxKVxuICAgICAgICAgICAgLy8gZGVmYXVsdCBzaXplXG4gICAgICAgICAgICB0aGlzLmRyYXdQaXhlbCh4ICsgaSwgeSArIGosIGJnKTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJpZyBzaXplXG4gICAgICAgICAgICB0aGlzLmZpbGxSZWN0KHggKyBpICogc2l6ZSwgeSArIGogKiBzaXplLCBzaXplLCBzaXplLCBiZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxpbmUgPj49IDE7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGRyYXdDaGFyMih4LCB5LCBjaCwgY29sb3IsIGJnLCBzaXplKSB7XG4gICAgLy8gIGJnID0gYmcgfHwgY29sb3I7XG4gICAgc2l6ZSA9IHNpemUgfHwgMTtcbiAgICBpZiAoXG4gICAgICB4ID49IHRoaXMud2lkdGggfHwgLy8gQ2xpcCByaWdodFxuICAgICAgeSA+PSB0aGlzLmhlaWdodCB8fCAvLyBDbGlwIGJvdHRvbVxuICAgICAgeCArIDYgKiBzaXplIC0gMSA8IDAgfHwgLy8gQ2xpcCBsZWZ0XG4gICAgICB5ICsgOCAqIHNpemUgLSAxIDwgMCAvLyBDbGlwIHRvcFxuICAgIClcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBwaXhlbHMgPSBuZXcgQXJyYXkoNiAqIDggKiBzaXplICogc2l6ZSk7XG4gICAgbGV0IGMgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICBsZXQgbGluZSA9IGkgPT0gNSA/IDAgOiBmb250W2MgKiA1ICsgaV07XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDg7IGorKykge1xuICAgICAgICBsZXQgY2wgPSBsaW5lICYgMHgxID8gY29sb3IgOiBiZztcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCBzaXplOyB3KyspIHtcbiAgICAgICAgICBmb3IgKGxldCBoID0gMDsgaCA8IHNpemU7IGgrKykge1xuICAgICAgICAgICAgcGl4ZWxzW1xuICAgICAgICAgICAgICBpICogKDEgKiBzaXplKSArIHcgKyAoaiAqICg2ICogc2l6ZSAqIHNpemUpICsgaCAqICg2ICogc2l6ZSkpXG4gICAgICAgICAgICBdID0gY2w7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxpbmUgPj49IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmF3Qm91bmQxNih4LCB5LCA2ICogc2l6ZSwgOCAqIHNpemUsIHBpeGVscyk7XG4gIH1cbiAgcmF3Qm91bmQxNih4LCB5LCB3aWR0aCwgaGVpZ2h0LCBwaXhlbHMpIHtcbiAgICBsZXQgcmdiID0gW107XG4gICAgcGl4ZWxzLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgICAgcmdiLnB1c2goKHYgJiAweGZmMDApID4+IDgpO1xuICAgICAgcmdiLnB1c2godiAmIDB4ZmYpO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0QWRkcldpbmRvdyh4LCB5LCB4ICsgd2lkdGggLSAxLCB5ICsgaGVpZ2h0IC0gMSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIocmdiKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcigpOyAvL2ZvciBmbHVzaFxuICB9XG4gIGRyYXdTdHJpbmcoeCwgeSwgc3RyLCBjb2xvciwgYmcsIHNpemUsIHdyYXApIHtcbiAgICAvLyAgYmcgPSBiZyB8fCBjb2xvcjtcbiAgICBzaXplID0gc2l6ZSB8fCAxO1xuICAgIC8vICB3cmFwID0gd3JhcCB8fCB0cnVlO1xuICAgIGZvciAobGV0IG4gPSAwOyBuIDwgc3RyLmxlbmd0aDsgbisrKSB7XG4gICAgICBsZXQgYyA9IHN0ci5jaGFyQXQobik7XG4gICAgICBpZiAoYyA9PSAnXFxuJykge1xuICAgICAgICB5ICs9IHNpemUgKiA4O1xuICAgICAgICB4ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PSAnXFxyJykge1xuICAgICAgICAvLyBza2lwIGVtXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdDaGFyKHgsIHksIGMsIGNvbG9yLCBiZywgc2l6ZSk7XG4gICAgICAgIHggKz0gc2l6ZSAqIDY7XG4gICAgICAgIGlmICh3cmFwICYmIHggPiB0aGlzLndpZHRoIC0gc2l6ZSAqIDYpIHtcbiAgICAgICAgICB5ICs9IHNpemUgKiA4O1xuICAgICAgICAgIHggPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbeCwgeV07XG4gIH1cbiAgZHJhd0NvbnRleHRCb3VuZChjb250ZXh0LCB4MCwgeTAsIHdpZHRoLCBoZWlnaHQsIHgxLCB5MSwgZ3JheSkge1xuICAgIHgwID0geDAgfHwgMDtcbiAgICB5MCA9IHkwIHx8IDA7XG4gICAgd2lkdGggPSB3aWR0aCB8fCBjb250ZXh0LmNhbnZhcy5jbGllbnRXaWR0aDtcbiAgICBoZWlnaHQgPSBoZWlnaHQgfHwgY29udGV4dC5jYW52YXMuY2xpZW50SGVpZ2h0O1xuICAgIHgxID0geDEgfHwgMDtcbiAgICB5MSA9IHkxIHx8IDA7XG4gICAgZ3JheSA9IGdyYXkgfHwgZmFsc2U7XG4gICAgdGhpcy53cml0ZShTVDc3MzVfQ09MTU9ELCBbU1Q3NzM1XzE4Yml0XSk7IC8vMThiaXQvcGl4ZWxcbiAgICBsZXQgaW1hZ2VEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoeDAsIHkwLCB3aWR0aCwgaGVpZ2h0KS5kYXRhO1xuICAgIGxldCByZ2IgPSBbXTtcbiAgICBmb3IgKGxldCBuID0gMDsgbiA8IGltYWdlRGF0YS5sZW5ndGg7IG4gKz0gNCkge1xuICAgICAgbGV0IHIgPSBpbWFnZURhdGFbbiArIDBdO1xuICAgICAgbGV0IGcgPSBpbWFnZURhdGFbbiArIDFdO1xuICAgICAgbGV0IGIgPSBpbWFnZURhdGFbbiArIDJdO1xuICAgICAgaWYgKCFncmF5KSB7XG4gICAgICAgIHJnYi5wdXNoKHIpO1xuICAgICAgICByZ2IucHVzaChnKTtcbiAgICAgICAgcmdiLnB1c2goYik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZ3MgPSBNYXRoLnJvdW5kKDAuMjk5ICogciArIDAuNTg3ICogZyArIDAuMTE0ICogYik7XG4gICAgICAgIHJnYi5wdXNoKGdzKTtcbiAgICAgICAgcmdiLnB1c2goZ3MpO1xuICAgICAgICByZ2IucHVzaChncyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xOGJpdF0pOyAvLzE4Yml0L3BpeGVsXG4gICAgdGhpcy5zZXRBZGRyV2luZG93KHgxLCB5MSwgeDEgKyB3aWR0aCAtIDEsIHkxICsgaGVpZ2h0IC0gMSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIocmdiKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcigpOyAvL2ZvciBmbHVzaFxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xNmJpdF0pOyAvLzE2Yml0L3BpeGVsXG4gIH1cbiAgZHJhd0NvbnRleHQoY29udGV4dCwgZ3JheSkge1xuICAgIGdyYXkgPSBncmF5IHx8IGZhbHNlO1xuICAgIHRoaXMuZHJhd0NvbnRleHRCb3VuZChjb250ZXh0LCAwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgMCwgMCwgZ3JheSk7XG4gIH1cbiAgcmF3Qm91bmQoeCwgeSwgd2lkdGgsIGhlaWdodCwgcGl4ZWxzKSB7XG4gICAgbGV0IHJnYiA9IFtdO1xuICAgIHBpeGVscy5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICAgIHJnYi5wdXNoKCh2ICYgMHhmZjAwMDApID4+IDE2KTtcbiAgICAgIHJnYi5wdXNoKCh2ICYgMHhmZjAwKSA+PiA4KTtcbiAgICAgIHJnYi5wdXNoKHYgJiAweGZmKTtcbiAgICB9KTtcbiAgICB0aGlzLndyaXRlKFNUNzczNV9DT0xNT0QsIFtTVDc3MzVfMThiaXRdKTsgLy8xOGJpdC9waXhlbFxuICAgIHRoaXMuc2V0QWRkcldpbmRvdyh4LCB5LCB4ICsgd2lkdGggLSAxLCB5ICsgaGVpZ2h0IC0gMSk7XG4gICAgdGhpcy5fd3JpdGVCdWZmZXIocmdiKTtcbiAgICB0aGlzLl93cml0ZUJ1ZmZlcigpOyAvL2ZvciBmbHVzaFxuICAgIHRoaXMud3JpdGUoU1Q3NzM1X0NPTE1PRCwgW1NUNzczNV8xNmJpdF0pOyAvLzE2Yml0L3BpeGVsXG4gIH1cbiAgcmF3KHBpeGVscykge1xuICAgIHRoaXMucmF3KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCBwaXhlbHMpO1xuICB9XG5cbiAgX3NldFByZXNldENvbG9yKCkge1xuICAgIHRoaXMuY29sb3IgPSB7XG4gICAgICBBbGljZUJsdWU6IDB4ZjdkZixcbiAgICAgIEFudGlxdWVXaGl0ZTogMHhmZjVhLFxuICAgICAgQXF1YTogMHgwN2ZmLFxuICAgICAgQXF1YW1hcmluZTogMHg3ZmZhLFxuICAgICAgQXp1cmU6IDB4ZjdmZixcbiAgICAgIEJlaWdlOiAweGY3YmIsXG4gICAgICBCaXNxdWU6IDB4ZmYzOCxcbiAgICAgIEJsYWNrOiAweDAwMDAsXG4gICAgICBCbGFuY2hlZEFsbW9uZDogMHhmZjU5LFxuICAgICAgQmx1ZTogMHgwMDFmLFxuICAgICAgQmx1ZVZpb2xldDogMHg4OTVjLFxuICAgICAgQnJvd246IDB4YTE0NSxcbiAgICAgIEJ1cmx5V29vZDogMHhkZGQwLFxuICAgICAgQ2FkZXRCbHVlOiAweDVjZjQsXG4gICAgICBDaGFydHJldXNlOiAweDdmZTAsXG4gICAgICBDaG9jb2xhdGU6IDB4ZDM0MyxcbiAgICAgIENvcmFsOiAweGZiZWEsXG4gICAgICBDb3JuZmxvd2VyQmx1ZTogMHg2NGJkLFxuICAgICAgQ29ybnNpbGs6IDB4ZmZkYixcbiAgICAgIENyaW1zb246IDB4ZDhhNyxcbiAgICAgIEN5YW46IDB4MDdmZixcbiAgICAgIERhcmtCbHVlOiAweDAwMTEsXG4gICAgICBEYXJrQ3lhbjogMHgwNDUxLFxuICAgICAgRGFya0dvbGRlblJvZDogMHhiYzIxLFxuICAgICAgRGFya0dyYXk6IDB4YWQ1NSxcbiAgICAgIERhcmtHcmVlbjogMHgwMzIwLFxuICAgICAgRGFya0toYWtpOiAweGJkYWQsXG4gICAgICBEYXJrTWFnZW50YTogMHg4ODExLFxuICAgICAgRGFya09saXZlR3JlZW46IDB4NTM0NSxcbiAgICAgIERhcmtPcmFuZ2U6IDB4ZmM2MCxcbiAgICAgIERhcmtPcmNoaWQ6IDB4OTk5OSxcbiAgICAgIERhcmtSZWQ6IDB4ODgwMCxcbiAgICAgIERhcmtTYWxtb246IDB4ZWNhZixcbiAgICAgIERhcmtTZWFHcmVlbjogMHg4ZGYxLFxuICAgICAgRGFya1NsYXRlQmx1ZTogMHg0OWYxLFxuICAgICAgRGFya1NsYXRlR3JheTogMHgyYTY5LFxuICAgICAgRGFya1R1cnF1b2lzZTogMHgwNjdhLFxuICAgICAgRGFya1Zpb2xldDogMHg5MDFhLFxuICAgICAgRGVlcFBpbms6IDB4ZjhiMixcbiAgICAgIERlZXBTa3lCbHVlOiAweDA1ZmYsXG4gICAgICBEaW1HcmF5OiAweDZiNGQsXG4gICAgICBEb2RnZXJCbHVlOiAweDFjOWYsXG4gICAgICBGaXJlQnJpY2s6IDB4YjEwNCxcbiAgICAgIEZsb3JhbFdoaXRlOiAweGZmZGUsXG4gICAgICBGb3Jlc3RHcmVlbjogMHgyNDQ0LFxuICAgICAgRnVjaHNpYTogMHhmODFmLFxuICAgICAgR2FpbnNib3JvOiAweGRlZmIsXG4gICAgICBHaG9zdFdoaXRlOiAweGZmZGYsXG4gICAgICBHb2xkOiAweGZlYTAsXG4gICAgICBHb2xkZW5Sb2Q6IDB4ZGQyNCxcbiAgICAgIEdyYXk6IDB4ODQxMCxcbiAgICAgIEdyZWVuOiAweDA0MDAsXG4gICAgICBHcmVlblllbGxvdzogMHhhZmU1LFxuICAgICAgSG9uZXlEZXc6IDB4ZjdmZSxcbiAgICAgIEhvdFBpbms6IDB4ZmI1NixcbiAgICAgIEluZGlhblJlZDogMHhjYWViLFxuICAgICAgSW5kaWdvOiAweDQ4MTAsXG4gICAgICBJdm9yeTogMHhmZmZlLFxuICAgICAgS2hha2k6IDB4ZjczMSxcbiAgICAgIExhdmVuZGVyOiAweGU3M2YsXG4gICAgICBMYXZlbmRlckJsdXNoOiAweGZmOWUsXG4gICAgICBMYXduR3JlZW46IDB4N2ZlMCxcbiAgICAgIExlbW9uQ2hpZmZvbjogMHhmZmQ5LFxuICAgICAgTGlnaHRCbHVlOiAweGFlZGMsXG4gICAgICBMaWdodENvcmFsOiAweGY0MTAsXG4gICAgICBMaWdodEN5YW46IDB4ZTdmZixcbiAgICAgIExpZ2h0R29sZGVuUm9kWWVsbG93OiAweGZmZGEsXG4gICAgICBMaWdodEdyYXk6IDB4ZDY5YSxcbiAgICAgIExpZ2h0R3JlZW46IDB4OTc3MixcbiAgICAgIExpZ2h0UGluazogMHhmZGI4LFxuICAgICAgTGlnaHRTYWxtb246IDB4ZmQwZixcbiAgICAgIExpZ2h0U2VhR3JlZW46IDB4MjU5NSxcbiAgICAgIExpZ2h0U2t5Qmx1ZTogMHg4NjdmLFxuICAgICAgTGlnaHRTbGF0ZUdyYXk6IDB4NzQ1MyxcbiAgICAgIExpZ2h0U3RlZWxCbHVlOiAweGI2M2IsXG4gICAgICBMaWdodFllbGxvdzogMHhmZmZjLFxuICAgICAgTGltZTogMHgwN2UwLFxuICAgICAgTGltZUdyZWVuOiAweDM2NjYsXG4gICAgICBMaW5lbjogMHhmZjljLFxuICAgICAgTWFnZW50YTogMHhmODFmLFxuICAgICAgTWFyb29uOiAweDgwMDAsXG4gICAgICBNZWRpdW1BcXVhTWFyaW5lOiAweDY2NzUsXG4gICAgICBNZWRpdW1CbHVlOiAweDAwMTksXG4gICAgICBNZWRpdW1PcmNoaWQ6IDB4YmFiYSxcbiAgICAgIE1lZGl1bVB1cnBsZTogMHg5MzliLFxuICAgICAgTWVkaXVtU2VhR3JlZW46IDB4M2Q4ZSxcbiAgICAgIE1lZGl1bVNsYXRlQmx1ZTogMHg3YjVkLFxuICAgICAgTWVkaXVtU3ByaW5nR3JlZW46IDB4MDdkMyxcbiAgICAgIE1lZGl1bVR1cnF1b2lzZTogMHg0ZTk5LFxuICAgICAgTWVkaXVtVmlvbGV0UmVkOiAweGMwYjAsXG4gICAgICBNaWRuaWdodEJsdWU6IDB4MThjZSxcbiAgICAgIE1pbnRDcmVhbTogMHhmN2ZmLFxuICAgICAgTWlzdHlSb3NlOiAweGZmM2MsXG4gICAgICBNb2NjYXNpbjogMHhmZjM2LFxuICAgICAgTmF2YWpvV2hpdGU6IDB4ZmVmNSxcbiAgICAgIE5hdnk6IDB4MDAxMCxcbiAgICAgIE9sZExhY2U6IDB4ZmZiYyxcbiAgICAgIE9saXZlOiAweDg0MDAsXG4gICAgICBPbGl2ZURyYWI6IDB4NmM2NCxcbiAgICAgIE9yYW5nZTogMHhmZDIwLFxuICAgICAgT3JhbmdlUmVkOiAweGZhMjAsXG4gICAgICBPcmNoaWQ6IDB4ZGI5YSxcbiAgICAgIFBhbGVHb2xkZW5Sb2Q6IDB4ZWY1NSxcbiAgICAgIFBhbGVHcmVlbjogMHg5ZmQzLFxuICAgICAgUGFsZVR1cnF1b2lzZTogMHhhZjdkLFxuICAgICAgUGFsZVZpb2xldFJlZDogMHhkYjkyLFxuICAgICAgUGFwYXlhV2hpcDogMHhmZjdhLFxuICAgICAgUGVhY2hQdWZmOiAweGZlZDcsXG4gICAgICBQZXJ1OiAweGNjMjcsXG4gICAgICBQaW5rOiAweGZlMTksXG4gICAgICBQbHVtOiAweGRkMWIsXG4gICAgICBQb3dkZXJCbHVlOiAweGI3MWMsXG4gICAgICBQdXJwbGU6IDB4ODAxMCxcbiAgICAgIFJlYmVjY2FQdXJwbGU6IDB4NjE5MyxcbiAgICAgIFJlZDogMHhmODAwLFxuICAgICAgUm9zeUJyb3duOiAweGJjNzEsXG4gICAgICBSb3lhbEJsdWU6IDB4NDM1YyxcbiAgICAgIFNhZGRsZUJyb3duOiAweDhhMjIsXG4gICAgICBTYWxtb246IDB4ZmMwZSxcbiAgICAgIFNhbmR5QnJvd246IDB4ZjUyYyxcbiAgICAgIFNlYUdyZWVuOiAweDJjNGEsXG4gICAgICBTZWFTaGVsbDogMHhmZmJkLFxuICAgICAgU2llbm5hOiAweGEyODUsXG4gICAgICBTaWx2ZXI6IDB4YzYxOCxcbiAgICAgIFNreUJsdWU6IDB4ODY3ZCxcbiAgICAgIFNsYXRlQmx1ZTogMHg2YWQ5LFxuICAgICAgU2xhdGVHcmF5OiAweDc0MTIsXG4gICAgICBTbm93OiAweGZmZGYsXG4gICAgICBTcHJpbmdHcmVlbjogMHgwN2VmLFxuICAgICAgU3RlZWxCbHVlOiAweDQ0MTYsXG4gICAgICBUYW46IDB4ZDViMSxcbiAgICAgIFRlYWw6IDB4MDQxMCxcbiAgICAgIFRoaXN0bGU6IDB4ZGRmYixcbiAgICAgIFRvbWF0bzogMHhmYjA4LFxuICAgICAgVHVycXVvaXNlOiAweDQ3MWEsXG4gICAgICBWaW9sZXQ6IDB4ZWMxZCxcbiAgICAgIFdoZWF0OiAweGY2ZjYsXG4gICAgICBXaGl0ZTogMHhmZmZmLFxuICAgICAgV2hpdGVTbW9rZTogMHhmN2JlLFxuICAgICAgWWVsbG93OiAweGZmZTAsXG4gICAgICBZZWxsb3dHcmVlbjogMHg5ZTY2LFxuICAgIH07XG4gIH1cbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gU2FpblNtYXJ0VEZUMThMQ0Q7XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBjb21tYW5kc1xuLy8gY29uc3QgSU5JVFJfR1JFRU5UQUIgPSAweDA7XG4vLyBjb25zdCBJTklUUl9SRURUQUIgPSAweDE7XG4vLyBjb25zdCBJTklUUl9CTEFDS1RBQiA9IDB4MjtcblxuY29uc3QgU1Q3NzM1X1RGVFdJRFRIID0gMTI4O1xuY29uc3QgU1Q3NzM1X1RGVEhFSUdIVCA9IDE2MDtcblxuLy8gY29uc3QgU1Q3NzM1X05PUCA9IDB4MDA7XG4vLyBjb25zdCBTVDc3MzVfU1dSRVNFVCA9IDB4MDE7XG4vLyBjb25zdCBTVDc3MzVfUkRESUQgPSAweDA0O1xuLy8gY29uc3QgU1Q3NzM1X1JERFNUID0gMHgwOTtcbi8vIGNvbnN0IFNUNzczNV9SRERQTSA9IDB4MGE7XG5cbi8vIGNvbnN0IFNUNzczNV9TTFBJTiA9IDB4MTA7XG5jb25zdCBTVDc3MzVfU0xQT1VUID0gMHgxMTtcbi8vIGNvbnN0IFNUNzczNV9QVExPTiA9IDB4MTI7XG4vLyBjb25zdCBTVDc3MzVfTk9ST04gPSAweDEzO1xuXG5jb25zdCBTVDc3MzVfSU5WT0ZGID0gMHgyMDtcbmNvbnN0IFNUNzczNV9JTlZPTiA9IDB4MjE7XG5jb25zdCBTVDc3MzVfRElTUE9GRiA9IDB4Mjg7XG5jb25zdCBTVDc3MzVfRElTUE9OID0gMHgyOTtcbmNvbnN0IFNUNzczNV9DQVNFVCA9IDB4MmE7XG5jb25zdCBTVDc3MzVfUkFTRVQgPSAweDJiO1xuY29uc3QgU1Q3NzM1X1JBTVdSID0gMHgyYztcbi8vIGNvbnN0IFNUNzczNV9SQU1SRCA9IDB4MmU7XG5cbi8vIGNvbnN0IFNUNzczNV9QVExBUiA9IDB4MzA7XG5jb25zdCBTVDc3MzVfQ09MTU9EID0gMHgzYTtcbmNvbnN0IFNUNzczNV9NQURDVEwgPSAweDM2O1xuXG5jb25zdCBTVDc3MzVfRlJNQ1RSMSA9IDB4YjE7XG5jb25zdCBTVDc3MzVfRlJNQ1RSMiA9IDB4YjI7XG5jb25zdCBTVDc3MzVfRlJNQ1RSMyA9IDB4YjM7XG5jb25zdCBTVDc3MzVfSU5WQ1RSID0gMHhiNDtcbi8vIGNvbnN0IFNUNzczNV9ESVNTRVQ1ID0gMHhiNjtcblxuY29uc3QgU1Q3NzM1X1BXQ1RSMSA9IDB4YzA7XG5jb25zdCBTVDc3MzVfUFdDVFIyID0gMHhjMTtcbmNvbnN0IFNUNzczNV9QV0NUUjMgPSAweGMyO1xuY29uc3QgU1Q3NzM1X1BXQ1RSNCA9IDB4YzM7XG5jb25zdCBTVDc3MzVfUFdDVFI1ID0gMHhjNDtcbmNvbnN0IFNUNzczNV9WTUNUUjEgPSAweGM1O1xuXG4vLyBjb25zdCBTVDc3MzVfUkRJRDEgPSAweGRhO1xuLy8gY29uc3QgU1Q3NzM1X1JESUQyID0gMHhkYjtcbi8vIGNvbnN0IFNUNzczNV9SRElEMyA9IDB4ZGM7XG4vLyBjb25zdCBTVDc3MzVfUkRJRDQgPSAweGRkO1xuXG4vLyBjb25zdCBTVDc3MzVfUFdDVFI2ID0gMHhmYztcblxuY29uc3QgU1Q3NzM1X0dNQ1RSUDEgPSAweGUwO1xuY29uc3QgU1Q3NzM1X0dNQ1RSTjEgPSAweGUxO1xuXG4vLyBDb2xvciBkZWZpbml0aW9uc1xuLy8gY29uc3QgU1Q3NzM1X0JMQUNLID0gMHgwMDAwO1xuLy8gY29uc3QgU1Q3NzM1X0JMVUUgPSAweDAwMWY7XG4vLyBjb25zdCBTVDc3MzVfUkVEID0gMHhmODAwO1xuLy8gY29uc3QgU1Q3NzM1X0dSRUVOID0gMHgwN2UwO1xuLy8gY29uc3QgU1Q3NzM1X0NZQU4gPSAweDA3ZmY7XG4vLyBjb25zdCBTVDc3MzVfTUFHRU5UQSA9IDB4ZjgxZjtcbi8vIGNvbnN0IFNUNzczNV9ZRUxMT1cgPSAweGZmZTA7XG4vLyBjb25zdCBTVDc3MzVfV0hJVEUgPSAweGZmZmY7XG5cbmNvbnN0IFNUNzczNV8xOGJpdCA9IDB4MDY7IC8vIDE4Yml0L3BpeGVsXG5jb25zdCBTVDc3MzVfMTZiaXQgPSAweDA1OyAvLyAxNmJpdC9waXhlbFxuXG4vLyBzdGFuZGFyZCBhc2NpaSA1eDcgZm9udFxuY29uc3QgZm9udCA9IFtcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgzZSxcbiAgMHg1YixcbiAgMHg0ZixcbiAgMHg1YixcbiAgMHgzZSxcbiAgMHgzZSxcbiAgMHg2YixcbiAgMHg0ZixcbiAgMHg2YixcbiAgMHgzZSxcbiAgMHgxYyxcbiAgMHgzZSxcbiAgMHg3YyxcbiAgMHgzZSxcbiAgMHgxYyxcbiAgMHgxOCxcbiAgMHgzYyxcbiAgMHg3ZSxcbiAgMHgzYyxcbiAgMHgxOCxcbiAgMHgxYyxcbiAgMHg1NyxcbiAgMHg3ZCxcbiAgMHg1NyxcbiAgMHgxYyxcbiAgMHgxYyxcbiAgMHg1ZSxcbiAgMHg3ZixcbiAgMHg1ZSxcbiAgMHgxYyxcbiAgMHgwMCxcbiAgMHgxOCxcbiAgMHgzYyxcbiAgMHgxOCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHhlNyxcbiAgMHhjMyxcbiAgMHhlNyxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgxOCxcbiAgMHgyNCxcbiAgMHgxOCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHhlNyxcbiAgMHhkYixcbiAgMHhlNyxcbiAgMHhmZixcbiAgMHgzMCxcbiAgMHg0OCxcbiAgMHgzYSxcbiAgMHgwNixcbiAgMHgwZSxcbiAgMHgyNixcbiAgMHgyOSxcbiAgMHg3OSxcbiAgMHgyOSxcbiAgMHgyNixcbiAgMHg0MCxcbiAgMHg3ZixcbiAgMHgwNSxcbiAgMHgwNSxcbiAgMHgwNyxcbiAgMHg0MCxcbiAgMHg3ZixcbiAgMHgwNSxcbiAgMHgyNSxcbiAgMHgzZixcbiAgMHg1YSxcbiAgMHgzYyxcbiAgMHhlNyxcbiAgMHgzYyxcbiAgMHg1YSxcbiAgMHg3ZixcbiAgMHgzZSxcbiAgMHgxYyxcbiAgMHgxYyxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgxYyxcbiAgMHgxYyxcbiAgMHgzZSxcbiAgMHg3ZixcbiAgMHgxNCxcbiAgMHgyMixcbiAgMHg3ZixcbiAgMHgyMixcbiAgMHgxNCxcbiAgMHg1ZixcbiAgMHg1ZixcbiAgMHgwMCxcbiAgMHg1ZixcbiAgMHg1ZixcbiAgMHgwNixcbiAgMHgwOSxcbiAgMHg3ZixcbiAgMHgwMSxcbiAgMHg3ZixcbiAgMHgwMCxcbiAgMHg2NixcbiAgMHg4OSxcbiAgMHg5NSxcbiAgMHg2YSxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHg5NCxcbiAgMHhhMixcbiAgMHhmZixcbiAgMHhhMixcbiAgMHg5NCxcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHg3ZSxcbiAgMHgwNCxcbiAgMHgwOCxcbiAgMHgxMCxcbiAgMHgyMCxcbiAgMHg3ZSxcbiAgMHgyMCxcbiAgMHgxMCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgyYSxcbiAgMHgxYyxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgxYyxcbiAgMHgyYSxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgxZSxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgwYyxcbiAgMHgxZSxcbiAgMHgwYyxcbiAgMHgxZSxcbiAgMHgwYyxcbiAgMHgzMCxcbiAgMHgzOCxcbiAgMHgzZSxcbiAgMHgzOCxcbiAgMHgzMCxcbiAgMHgwNixcbiAgMHgwZSxcbiAgMHgzZSxcbiAgMHgwZSxcbiAgMHgwNixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg1ZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwNyxcbiAgMHgwMCxcbiAgMHgwNyxcbiAgMHgwMCxcbiAgMHgxNCxcbiAgMHg3ZixcbiAgMHgxNCxcbiAgMHg3ZixcbiAgMHgxNCxcbiAgMHgyNCxcbiAgMHgyYSxcbiAgMHg3ZixcbiAgMHgyYSxcbiAgMHgxMixcbiAgMHgyMyxcbiAgMHgxMyxcbiAgMHgwOCxcbiAgMHg2NCxcbiAgMHg2MixcbiAgMHgzNixcbiAgMHg0OSxcbiAgMHg1NixcbiAgMHgyMCxcbiAgMHg1MCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgwNyxcbiAgMHgwMyxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxYyxcbiAgMHgyMixcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHgyMixcbiAgMHgxYyxcbiAgMHgwMCxcbiAgMHgyYSxcbiAgMHgxYyxcbiAgMHg3ZixcbiAgMHgxYyxcbiAgMHgyYSxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgzZSxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwMCxcbiAgMHg4MCxcbiAgMHg3MCxcbiAgMHgzMCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg2MCxcbiAgMHg2MCxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHgxMCxcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHgwMixcbiAgMHgzZSxcbiAgMHg1MSxcbiAgMHg0OSxcbiAgMHg0NSxcbiAgMHgzZSxcbiAgMHgwMCxcbiAgMHg0MixcbiAgMHg3ZixcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHg3MixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0NixcbiAgMHgyMSxcbiAgMHg0MSxcbiAgMHg0OSxcbiAgMHg0ZCxcbiAgMHgzMyxcbiAgMHgxOCxcbiAgMHgxNCxcbiAgMHgxMixcbiAgMHg3ZixcbiAgMHgxMCxcbiAgMHgyNyxcbiAgMHg0NSxcbiAgMHg0NSxcbiAgMHg0NSxcbiAgMHgzOSxcbiAgMHgzYyxcbiAgMHg0YSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzMSxcbiAgMHg0MSxcbiAgMHgyMSxcbiAgMHgxMSxcbiAgMHgwOSxcbiAgMHgwNyxcbiAgMHgzNixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzNixcbiAgMHg0NixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgyOSxcbiAgMHgxZSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0MCxcbiAgMHgzNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgxNCxcbiAgMHgyMixcbiAgMHg0MSxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHgyMixcbiAgMHgxNCxcbiAgMHgwOCxcbiAgMHgwMixcbiAgMHgwMSxcbiAgMHg1OSxcbiAgMHgwOSxcbiAgMHgwNixcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg1ZCxcbiAgMHg1OSxcbiAgMHg0ZSxcbiAgMHg3YyxcbiAgMHgxMixcbiAgMHgxMSxcbiAgMHgxMixcbiAgMHg3YyxcbiAgMHg3ZixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzNixcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgyMixcbiAgMHg3ZixcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgzZSxcbiAgMHg3ZixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHgwOSxcbiAgMHgwOSxcbiAgMHgwOSxcbiAgMHgwMSxcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg1MSxcbiAgMHg3MyxcbiAgMHg3ZixcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHg3ZixcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHg0MCxcbiAgMHg0MSxcbiAgMHgzZixcbiAgMHgwMSxcbiAgMHg3ZixcbiAgMHgwOCxcbiAgMHgxNCxcbiAgMHgyMixcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg3ZixcbiAgMHgwMixcbiAgMHgxYyxcbiAgMHgwMixcbiAgMHg3ZixcbiAgMHg3ZixcbiAgMHgwNCxcbiAgMHgwOCxcbiAgMHgxMCxcbiAgMHg3ZixcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgzZSxcbiAgMHg3ZixcbiAgMHgwOSxcbiAgMHgwOSxcbiAgMHgwOSxcbiAgMHgwNixcbiAgMHgzZSxcbiAgMHg0MSxcbiAgMHg1MSxcbiAgMHgyMSxcbiAgMHg1ZSxcbiAgMHg3ZixcbiAgMHgwOSxcbiAgMHgxOSxcbiAgMHgyOSxcbiAgMHg0NixcbiAgMHgyNixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzMixcbiAgMHgwMyxcbiAgMHgwMSxcbiAgMHg3ZixcbiAgMHgwMSxcbiAgMHgwMyxcbiAgMHgzZixcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgzZixcbiAgMHgxZixcbiAgMHgyMCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHgxZixcbiAgMHgzZixcbiAgMHg0MCxcbiAgMHgzOCxcbiAgMHg0MCxcbiAgMHgzZixcbiAgMHg2MyxcbiAgMHgxNCxcbiAgMHgwOCxcbiAgMHgxNCxcbiAgMHg2MyxcbiAgMHgwMyxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHgwNCxcbiAgMHgwMyxcbiAgMHg2MSxcbiAgMHg1OSxcbiAgMHg0OSxcbiAgMHg0ZCxcbiAgMHg0MyxcbiAgMHgwMCxcbiAgMHg3ZixcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgwMixcbiAgMHgwNCxcbiAgMHgwOCxcbiAgMHgxMCxcbiAgMHgyMCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHgwNCxcbiAgMHgwMixcbiAgMHgwMSxcbiAgMHgwMixcbiAgMHgwNCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHgwMyxcbiAgMHgwNyxcbiAgMHgwOCxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg3OCxcbiAgMHg0MCxcbiAgMHg3ZixcbiAgMHgyOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzOCxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgyOCxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgyOCxcbiAgMHg3ZixcbiAgMHgzOCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHgxOCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHg3ZSxcbiAgMHgwOSxcbiAgMHgwMixcbiAgMHgxOCxcbiAgMHhhNCxcbiAgMHhhNCxcbiAgMHg5YyxcbiAgMHg3OCxcbiAgMHg3ZixcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHgwMCxcbiAgMHg0NCxcbiAgMHg3ZCxcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgzZCxcbiAgMHgwMCxcbiAgMHg3ZixcbiAgMHgxMCxcbiAgMHgyOCxcbiAgMHg0NCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHg3ZixcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHg3YyxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHg3YyxcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHgwNCxcbiAgMHg3OCxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzOCxcbiAgMHhmYyxcbiAgMHgxOCxcbiAgMHgyNCxcbiAgMHgyNCxcbiAgMHgxOCxcbiAgMHgxOCxcbiAgMHgyNCxcbiAgMHgyNCxcbiAgMHgxOCxcbiAgMHhmYyxcbiAgMHg3YyxcbiAgMHgwOCxcbiAgMHgwNCxcbiAgMHgwNCxcbiAgMHgwOCxcbiAgMHg0OCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHgyNCxcbiAgMHgwNCxcbiAgMHgwNCxcbiAgMHgzZixcbiAgMHg0NCxcbiAgMHgyNCxcbiAgMHgzYyxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHg3YyxcbiAgMHgxYyxcbiAgMHgyMCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHgxYyxcbiAgMHgzYyxcbiAgMHg0MCxcbiAgMHgzMCxcbiAgMHg0MCxcbiAgMHgzYyxcbiAgMHg0NCxcbiAgMHgyOCxcbiAgMHgxMCxcbiAgMHgyOCxcbiAgMHg0NCxcbiAgMHg0YyxcbiAgMHg5MCxcbiAgMHg5MCxcbiAgMHg5MCxcbiAgMHg3YyxcbiAgMHg0NCxcbiAgMHg2NCxcbiAgMHg1NCxcbiAgMHg0YyxcbiAgMHg0NCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgzNixcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg3NyxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0MSxcbiAgMHgzNixcbiAgMHgwOCxcbiAgMHgwMCxcbiAgMHgwMixcbiAgMHgwMSxcbiAgMHgwMixcbiAgMHgwNCxcbiAgMHgwMixcbiAgMHgzYyxcbiAgMHgyNixcbiAgMHgyMyxcbiAgMHgyNixcbiAgMHgzYyxcbiAgMHgxZSxcbiAgMHhhMSxcbiAgMHhhMSxcbiAgMHg2MSxcbiAgMHgxMixcbiAgMHgzYSxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHg3YSxcbiAgMHgzOCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1NSxcbiAgMHg1OSxcbiAgMHgyMSxcbiAgMHg1NSxcbiAgMHg1NSxcbiAgMHg3OSxcbiAgMHg0MSxcbiAgMHgyMSxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg3OCxcbiAgMHg0MSxcbiAgMHgyMSxcbiAgMHg1NSxcbiAgMHg1NCxcbiAgMHg3OCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHg1NCxcbiAgMHg1NSxcbiAgMHg3OSxcbiAgMHg0MCxcbiAgMHgwYyxcbiAgMHgxZSxcbiAgMHg1MixcbiAgMHg3MixcbiAgMHgxMixcbiAgMHgzOSxcbiAgMHg1NSxcbiAgMHg1NSxcbiAgMHg1NSxcbiAgMHg1OSxcbiAgMHgzOSxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1OSxcbiAgMHgzOSxcbiAgMHg1NSxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg1OCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0NSxcbiAgMHg3YyxcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgwMixcbiAgMHg0NSxcbiAgMHg3ZCxcbiAgMHg0MixcbiAgMHgwMCxcbiAgMHgwMSxcbiAgMHg0NSxcbiAgMHg3YyxcbiAgMHg0MCxcbiAgMHhmMCxcbiAgMHgyOSxcbiAgMHgyNCxcbiAgMHgyOSxcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHgyOCxcbiAgMHgyNSxcbiAgMHgyOCxcbiAgMHhmMCxcbiAgMHg3YyxcbiAgMHg1NCxcbiAgMHg1NSxcbiAgMHg0NSxcbiAgMHgwMCxcbiAgMHgyMCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg3YyxcbiAgMHg1NCxcbiAgMHg3YyxcbiAgMHgwYSxcbiAgMHgwOSxcbiAgMHg3ZixcbiAgMHg0OSxcbiAgMHgzMixcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgzMixcbiAgMHgzMixcbiAgMHg0OCxcbiAgMHg0OCxcbiAgMHg0OCxcbiAgMHgzMixcbiAgMHgzMixcbiAgMHg0YSxcbiAgMHg0OCxcbiAgMHg0OCxcbiAgMHgzMCxcbiAgMHgzYSxcbiAgMHg0MSxcbiAgMHg0MSxcbiAgMHgyMSxcbiAgMHg3YSxcbiAgMHgzYSxcbiAgMHg0MixcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHg3OCxcbiAgMHgwMCxcbiAgMHg5ZCxcbiAgMHhhMCxcbiAgMHhhMCxcbiAgMHg3ZCxcbiAgMHgzOSxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzOSxcbiAgMHgzZCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgzZCxcbiAgMHgzYyxcbiAgMHgyNCxcbiAgMHhmZixcbiAgMHgyNCxcbiAgMHgyNCxcbiAgMHg0OCxcbiAgMHg3ZSxcbiAgMHg0OSxcbiAgMHg0MyxcbiAgMHg2NixcbiAgMHgyYixcbiAgMHgyZixcbiAgMHhmYyxcbiAgMHgyZixcbiAgMHgyYixcbiAgMHhmZixcbiAgMHgwOSxcbiAgMHgyOSxcbiAgMHhmNixcbiAgMHgyMCxcbiAgMHhjMCxcbiAgMHg4OCxcbiAgMHg3ZSxcbiAgMHgwOSxcbiAgMHgwMyxcbiAgMHgyMCxcbiAgMHg1NCxcbiAgMHg1NCxcbiAgMHg3OSxcbiAgMHg0MSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg0NCxcbiAgMHg3ZCxcbiAgMHg0MSxcbiAgMHgzMCxcbiAgMHg0OCxcbiAgMHg0OCxcbiAgMHg0YSxcbiAgMHgzMixcbiAgMHgzOCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHgyMixcbiAgMHg3YSxcbiAgMHgwMCxcbiAgMHg3YSxcbiAgMHgwYSxcbiAgMHgwYSxcbiAgMHg3MixcbiAgMHg3ZCxcbiAgMHgwZCxcbiAgMHgxOSxcbiAgMHgzMSxcbiAgMHg3ZCxcbiAgMHgyNixcbiAgMHgyOSxcbiAgMHgyOSxcbiAgMHgyZixcbiAgMHgyOCxcbiAgMHgyNixcbiAgMHgyOSxcbiAgMHgyOSxcbiAgMHgyOSxcbiAgMHgyNixcbiAgMHgzMCxcbiAgMHg0OCxcbiAgMHg0ZCxcbiAgMHg0MCxcbiAgMHgyMCxcbiAgMHgzOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHgzOCxcbiAgMHgyZixcbiAgMHgxMCxcbiAgMHhjOCxcbiAgMHhhYyxcbiAgMHhiYSxcbiAgMHgyZixcbiAgMHgxMCxcbiAgMHgyOCxcbiAgMHgzNCxcbiAgMHhmYSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHg3YixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgxNCxcbiAgMHgyYSxcbiAgMHgxNCxcbiAgMHgyMixcbiAgMHgyMixcbiAgMHgxNCxcbiAgMHgyYSxcbiAgMHgxNCxcbiAgMHgwOCxcbiAgMHhhYSxcbiAgMHgwMCxcbiAgMHg1NSxcbiAgMHgwMCxcbiAgMHhhYSxcbiAgMHhhYSxcbiAgMHg1NSxcbiAgMHhhYSxcbiAgMHg1NSxcbiAgMHhhYSxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmYyxcbiAgMHgwMCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNyxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNCxcbiAgMHgwNCxcbiAgMHhmYyxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNyxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxZixcbiAgMHgwMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgxMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxNyxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmYyxcbiAgMHgwNCxcbiAgMHhmNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNyxcbiAgMHgxMCxcbiAgMHgxNyxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNCxcbiAgMHgwNCxcbiAgMHhmNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHhmNyxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNyxcbiAgMHgwMCxcbiAgMHhmNyxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNyxcbiAgMHgxNCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmNCxcbiAgMHgxNCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmYyxcbiAgMHgxNCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHgxNCxcbiAgMHhmZixcbiAgMHgxNCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgxZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmMCxcbiAgMHgxMCxcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHhmMCxcbiAgMHhmZixcbiAgMHhmZixcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHhmZixcbiAgMHgwZixcbiAgMHgwZixcbiAgMHgwZixcbiAgMHgwZixcbiAgMHgwZixcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg3YyxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHgzZSxcbiAgMHgxNCxcbiAgMHg3ZSxcbiAgMHgwMixcbiAgMHgwMixcbiAgMHgwNixcbiAgMHgwNixcbiAgMHgwMixcbiAgMHg3ZSxcbiAgMHgwMixcbiAgMHg3ZSxcbiAgMHgwMixcbiAgMHg2MyxcbiAgMHg1NSxcbiAgMHg0OSxcbiAgMHg0MSxcbiAgMHg2MyxcbiAgMHgzOCxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHgzYyxcbiAgMHgwNCxcbiAgMHg0MCxcbiAgMHg3ZSxcbiAgMHgyMCxcbiAgMHgxZSxcbiAgMHgyMCxcbiAgMHgwNixcbiAgMHgwMixcbiAgMHg3ZSxcbiAgMHgwMixcbiAgMHgwMixcbiAgMHg5OSxcbiAgMHhhNSxcbiAgMHhlNyxcbiAgMHhhNSxcbiAgMHg5OSxcbiAgMHgxYyxcbiAgMHgyYSxcbiAgMHg0OSxcbiAgMHgyYSxcbiAgMHgxYyxcbiAgMHg0YyxcbiAgMHg3MixcbiAgMHgwMSxcbiAgMHg3MixcbiAgMHg0YyxcbiAgMHgzMCxcbiAgMHg0YSxcbiAgMHg0ZCxcbiAgMHg0ZCxcbiAgMHgzMCxcbiAgMHgzMCxcbiAgMHg0OCxcbiAgMHg3OCxcbiAgMHg0OCxcbiAgMHgzMCxcbiAgMHhiYyxcbiAgMHg2MixcbiAgMHg1YSxcbiAgMHg0NixcbiAgMHgzZCxcbiAgMHgzZSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHg0OSxcbiAgMHgwMCxcbiAgMHg3ZSxcbiAgMHgwMSxcbiAgMHgwMSxcbiAgMHgwMSxcbiAgMHg3ZSxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHgyYSxcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg1ZixcbiAgMHg0NCxcbiAgMHg0NCxcbiAgMHg0MCxcbiAgMHg1MSxcbiAgMHg0YSxcbiAgMHg0NCxcbiAgMHg0MCxcbiAgMHg0MCxcbiAgMHg0NCxcbiAgMHg0YSxcbiAgMHg1MSxcbiAgMHg0MCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHhmZixcbiAgMHgwMSxcbiAgMHgwMyxcbiAgMHhlMCxcbiAgMHg4MCxcbiAgMHhmZixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwOCxcbiAgMHgwOCxcbiAgMHg2YixcbiAgMHg2YixcbiAgMHgwOCxcbiAgMHgzNixcbiAgMHgxMixcbiAgMHgzNixcbiAgMHgyNCxcbiAgMHgzNixcbiAgMHgwNixcbiAgMHgwZixcbiAgMHgwOSxcbiAgMHgwZixcbiAgMHgwNixcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxOCxcbiAgMHgxOCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgxMCxcbiAgMHgxMCxcbiAgMHgwMCxcbiAgMHgzMCxcbiAgMHg0MCxcbiAgMHhmZixcbiAgMHgwMSxcbiAgMHgwMSxcbiAgMHgwMCxcbiAgMHgxZixcbiAgMHgwMSxcbiAgMHgwMSxcbiAgMHgxZSxcbiAgMHgwMCxcbiAgMHgxOSxcbiAgMHgxZCxcbiAgMHgxNyxcbiAgMHgxMixcbiAgMHgwMCxcbiAgMHgzYyxcbiAgMHgzYyxcbiAgMHgzYyxcbiAgMHgzYyxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbiAgMHgwMCxcbl07XG4iXX0=
