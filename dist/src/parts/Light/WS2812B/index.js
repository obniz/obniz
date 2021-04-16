"use strict";
/**
 * @packageDocumentation
 * @module Parts.WS2812B
 */
Object.defineProperty(exports, "__esModule", { value: true });
class WS2812B {
    constructor() {
        this.keys = ['din', 'vcc', 'gnd'];
        this.requiredKeys = ['din'];
    }
    static info() {
        return {
            name: 'WS2812B',
        };
    }
    static _generateFromByte(val) {
        // T0H 0.35us+-0.15us
        // T1H 0.9us+-0.15us
        // T0L 0.9us+-0.15us
        // T1L 0.35us+-0.15us
        // 0.3-0.9 and 0.9-0.3 at 3.33Mhz
        val = parseInt(val);
        const zero = 0x8;
        const one = 0xe;
        const ret = [];
        for (let i = 0; i < 8; i += 2) {
            let byte = 0;
            if (val & (0x80 >> i)) {
                byte = one << 4;
            }
            else {
                byte = zero << 4;
            }
            if (val & (0x80 >> (i + 1))) {
                byte |= one;
            }
            else {
                byte |= zero;
            }
            ret.push(byte);
        }
        return ret;
    }
    static _generateColor(r, g, b) {
        let array = WS2812B._generateFromByte(g);
        array = array.concat(WS2812B._generateFromByte(r));
        array = array.concat(WS2812B._generateFromByte(b));
        return array;
    }
    static _generateHsvColor(h, s, v) {
        const C = v * s;
        const Hp = h / 60;
        const X = C * (1 - Math.abs((Hp % 2) - 1));
        let R;
        let G;
        let B;
        if (0 <= Hp && Hp < 1) {
            [R, G, B] = [C, X, 0];
        }
        if (1 <= Hp && Hp < 2) {
            [R, G, B] = [X, C, 0];
        }
        if (2 <= Hp && Hp < 3) {
            [R, G, B] = [0, C, X];
        }
        if (3 <= Hp && Hp < 4) {
            [R, G, B] = [0, X, C];
        }
        if (4 <= Hp && Hp < 5) {
            [R, G, B] = [X, 0, C];
        }
        if (5 <= Hp && Hp < 6) {
            [R, G, B] = [C, 0, X];
        }
        const m = v - C;
        [R, G, B] = [R + m, G + m, B + m];
        R = Math.floor(R * 255);
        G = Math.floor(G * 255);
        B = Math.floor(B * 255);
        return WS2812B._generateColor(R, G, B);
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.params.mode = 'master';
        this.params.frequency = Math.floor(3.33 * 1000 * 1000);
        this.params.mosi = this.params.din;
        this.params.drive = '5v'; // It over spec for frequency. But VIN-HI require 0.7VCC<=.
        this.spi = this.obniz.getSpiWithConfig(this.params);
    }
    rgb(red, green, blue) {
        this.spi.write(WS2812B._generateColor(red, green, blue));
    }
    hsv(hue, saturation, value) {
        this.spi.write(WS2812B._generateHsvColor(hue, saturation, value));
    }
    rgbs(array) {
        let bytes = [];
        for (let i = 0; i < array.length; i++) {
            const oneArray = array[i];
            bytes = bytes.concat(WS2812B._generateColor(oneArray[0], oneArray[1], oneArray[2]));
        }
        this.spi.write(bytes);
    }
    hsvs(array) {
        let bytes = [];
        for (let i = 0; i < array.length; i++) {
            const oneArray = array[i];
            bytes = bytes.concat(WS2812B._generateHsvColor(oneArray[0], oneArray[1], oneArray[2]));
        }
        this.spi.write(bytes);
    }
}
exports.default = WS2812B;
