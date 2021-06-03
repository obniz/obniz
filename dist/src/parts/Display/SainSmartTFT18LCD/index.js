"use strict";
/**
 * @packageDocumentation
 * @module Parts.SainSmartTFT18LCD
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SainSmartTFT18LCD {
    constructor() {
        this.debugprint = false;
        this.width = 0;
        this.height = 0;
        this.writeBuffer = [];
        this.keys = ['vcc', 'gnd', 'scl', 'sda', 'dc', 'res', 'cs'];
        this.requiredKeys = ['scl', 'sda', 'dc', 'res', 'cs'];
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
        this.params.frequency = 16 * 1000 * 1000; // 16MHz
        this.params.mode = 'master';
        this.params.clk = this.params.scl;
        this.params.mosi = this.params.sda;
        this.params.drive = '3v';
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
            console.log(
            // eslint-disable-next-line prefer-rest-params
            'SainSmartTFT18LCD: ' + Array.prototype.slice.call(arguments).join(''));
        }
    }
    _deadSleep(waitMsec) {
        const startMsec = new Date();
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
        if (data.length === 0) {
            return;
        }
        this.writeCommand(cmd);
        this.writeData(data);
    }
    async asyncwait() {
        return await this.spi.writeWait([0x00]);
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
    fillRect(x, y, width, height, color) {
        if (x >= this.width || y >= this.height) {
            return;
        }
        if (x + width - 1 >= this.width) {
            width = this.width - x;
        }
        if (y + height - 1 >= this.height) {
            height = this.height - y;
        }
        this.setAddrWindow(x, y, x + width - 1, y + height - 1);
        const hi = color >> 8;
        const lo = color & 0xff;
        const data = [];
        for (y = height; y > 0; y--) {
            for (x = width; x > 0; x--) {
                data.push(hi);
                data.push(lo);
            }
        }
        this._writeBuffer(data);
        this._writeBuffer(); // for flush
    }
    drawRect(x, y, width, height, color) {
        this.drawHLine(x, y, width, color);
        this.drawHLine(x, y + height - 1, width, color);
        this.drawVLine(x, y, height, color);
        this.drawVLine(x + width - 1, y, height, color);
    }
    drawCircle(center_x, center_y, radius, color) {
        let f = 1 - radius;
        let ddF_x = 1;
        let ddF_y = -2 * radius;
        let x = 0;
        let y = radius;
        this.drawPixel(center_x, center_y + radius, color);
        this.drawPixel(center_x, center_y - radius, color);
        this.drawPixel(center_x + radius, center_y, color);
        this.drawPixel(center_x - radius, center_y, color);
        while (x < y) {
            if (f >= 0) {
                y--;
                ddF_y += 2;
                f += ddF_y;
            }
            x++;
            ddF_x += 2;
            f += ddF_x;
            this.drawPixel(center_x + x, center_y + y, color);
            this.drawPixel(center_x - x, center_y + y, color);
            this.drawPixel(center_x + x, center_y - y, color);
            this.drawPixel(center_x - x, center_y - y, color);
            this.drawPixel(center_x + y, center_y + x, color);
            this.drawPixel(center_x - y, center_y + x, color);
            this.drawPixel(center_x + y, center_y - x, color);
            this.drawPixel(center_x - y, center_y - x, color);
        }
    }
    fillCircle(center_x, center_y, radius, color) {
        this.drawVLine(center_x, center_y - radius, 2 * radius + 1, color);
        this._fillCircleHelper(center_x, center_y, radius, 3, 0, color);
    }
    drawRoundRect(x, y, width, height, round, color) {
        this.drawHLine(x + round, y, width - 2 * round, color); // Top
        this.drawHLine(x + round, y + height - 1, width - 2 * round, color); // Bottom
        this.drawVLine(x, y + round, height - 2 * round, color); // Left
        this.drawVLine(x + width - 1, y + round, height - 2 * round, color); // Right
        this._drawCircleHelper(x + round, y + round, round, 1, color);
        this._drawCircleHelper(x + width - round - 1, y + round, round, 2, color);
        this._drawCircleHelper(x + width - round - 1, y + height - round - 1, round, 4, color);
        this._drawCircleHelper(x + round, y + height - round - 1, round, 8, color);
    }
    fillRoundRect(x, y, width, height, round, color) {
        this.fillRect(x + round, y, width - 2 * round, height, color);
        this._fillCircleHelper(x + width - round - 1, y + round, round, 1, height - 2 * round - 1, color);
        this._fillCircleHelper(x + round, y + round, round, 2, height - 2 * round - 1, color);
    }
    drawTriangle(x0, y0, x1, y1, x2, y2, color) {
        this.drawLine(x0, y0, x1, y1, color);
        this.drawLine(x1, y1, x2, y2, color);
        this.drawLine(x2, y2, x0, y0, color);
    }
    fillTriangle(x0, y0, x1, y1, x2, y2, color) {
        let a = 0;
        let b = 0;
        let y = 0;
        let last = 0;
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
    drawVLine(x, y, height, color) {
        if (x >= this.width || y >= this.height) {
            return;
        }
        if (y + height - 1 >= this.height) {
            height = this.height - y;
        }
        this.setAddrWindow(x, y, x, y + height - 1);
        const hi = color >> 8;
        const lo = color & 0xff;
        const data = [];
        while (height--) {
            data.push(hi);
            data.push(lo);
        }
        this.writeData(data);
    }
    drawHLine(x, y, width, color) {
        if (x >= this.width || y >= this.height) {
            return;
        }
        if (x + width - 1 >= this.width) {
            width = this.width - x;
        }
        this.setAddrWindow(x, y, x + width - 1, y);
        const hi = color >> 8;
        const lo = color & 0xff;
        const data = [];
        while (width--) {
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
    drawChar(x, y, char, color, backgroundColor, size) {
        //  bg = bg || color;
        size = size || 1;
        if (x >= this.width || // Clip right
            y >= this.height || // Clip bottom
            x + 6 * size - 1 < 0 || // Clip left
            y + 8 * size - 1 < 0) {
            // Clip top
            return;
        }
        if (color !== backgroundColor) {
            this.drawChar2(x, y, char, color, backgroundColor, size);
            return;
        }
        const c = char.charCodeAt(0);
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
                else if (backgroundColor !== color) {
                    if (size === 1) {
                        // default size
                        this.drawPixel(x + i, y + j, backgroundColor);
                    }
                    else {
                        // big size
                        this.fillRect(x + i * size, y + j * size, size, size, backgroundColor);
                    }
                }
                line >>= 1;
            }
        }
    }
    drawString(x, y, string, color, backgroundColor, size, wrap) {
        //  bg = bg || color;
        size = size || 1;
        //  wrap = wrap || true;
        for (let n = 0; n < string.length; n++) {
            const c = string.charAt(n);
            if (c === '\n') {
                y += size * 8;
                x = 0;
            }
            else if (c === '\r') {
                // skip em
            }
            else {
                this.drawChar(x, y, c, color, backgroundColor, size);
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
