"use strict";
/**
 * @packageDocumentation
 * @module Parts.M5StickC_Yun
 */
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../obniz/libs/utils/util");
class M5StickC_Yun {
    constructor() {
        this.LED_LEN = 14;
        this.requiredKeys = [];
        this.keys = ['sda', 'scl', 'i2c'];
        this.ioKeys = ['sda', 'scl'];
    }
    static info() {
        return {
            name: 'M5StickC_Yun',
        };
    }
    static _generateHsvColor(h, s, v) {
        const C = v * s;
        const Hp = h / 60;
        const X = C * (1 - Math.abs((Hp % 2) - 1));
        let R = 0;
        let G = 0;
        let B = 0;
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
        return { red: R, green: G, blue: B };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (!this.obniz.isValidIO(this.params.sda) &&
            !this.obniz.isValidIO(this.params.scl) &&
            !this.params.i2c) {
            if (this.obniz.hasExtraInterface('m5stickc_hat')) {
                const hatI2c = this.obniz.getExtraInterface('m5stickc_hat').i2c;
                this.params.sda = hatI2c.sda;
                this.params.scl = hatI2c.scl;
            }
            else {
                throw new Error("Cannot find m5stickc hat interface. Please set param 'sda'/'scl' or 'i2c'");
            }
        }
        this.params.clock = 100 * 1000; // for i2c
        this.params.mode = 'master'; // for i2c
        this.params.pull = '3v'; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.sht20 = obniz.wired('SHT20', { i2c: this.i2c });
        this.bmp280 = obniz.wired('BMP280', { i2c: this.i2c });
        this.bmp280.applyCalibration();
    }
    // public setColorCode(ledNum: number, colorCode: string) {
    //   const hexConvert = (hex: string) => {
    //     if (hex.slice(0, 1) === "#") {
    //       hex = hex.slice(1);
    //     }
    //     if (hex.length === 3) {
    //       hex = hex.slice(0, 1) + hex.slice(0, 1) + hex.slice(1, 2) + hex.slice(1, 2) + hex.slice(2, 3) + hex.slice(2, 3);
    //     }
    //
    //     return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) => {
    //       return parseInt(str, 16);
    //     });
    //   };
    //   const color: number[] = hexConvert(colorCode);
    //   this.rgb(color[0], color[1], color[2]);
    // }
    rgb(red, green, blue) {
        util_1.ObnizUtil.assertNumber(0, 255, 'red', red);
        util_1.ObnizUtil.assertNumber(0, 255, 'green', green);
        util_1.ObnizUtil.assertNumber(0, 255, 'blue', blue);
        const leds = [];
        for (let i = 0; i < this.LED_LEN; i++) {
            leds.push([red, green, blue]);
        }
        this.rgbs(leds);
    }
    hsv(hue, saturation, value) {
        util_1.ObnizUtil.assertNumber(0, 300, 'hue', hue);
        util_1.ObnizUtil.assertNumber(0, 1, 'saturation', saturation);
        util_1.ObnizUtil.assertNumber(0, 1, 'value', value);
        const color = M5StickC_Yun._generateHsvColor(hue, saturation, value);
        this.rgb(color.red, color.green, color.blue);
    }
    rgbs(array) {
        if (array.length <= this.LED_LEN) {
            array.forEach((value, index) => {
                this.i2c.write(0x38, [
                    0x01,
                    index,
                    Math.floor(value[0]),
                    Math.floor(value[1]),
                    Math.floor(value[2]),
                ]);
            });
        }
    }
    hsvs(array) {
        const leds = array.map((value, index) => {
            const color = M5StickC_Yun._generateHsvColor(value[0], value[1], value[2]);
            return [color.red, color.green, color.blue];
        });
        this.rgbs(leds);
    }
    async getLightWait() {
        this.i2c.write(0x38, [0x00]);
        const d = await this.i2c.readWait(0x38, 2);
        return (d[1] << 8) | d[0];
    }
    async getTempWait() {
        return await this.sht20.getTempWait();
    }
    async getHumidWait() {
        return await this.sht20.getHumidWait();
    }
    async getPressureWait() {
        return await this.bmp280.getPressureWait();
    }
}
exports.default = M5StickC_Yun;
