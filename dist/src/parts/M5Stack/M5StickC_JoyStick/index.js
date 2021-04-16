"use strict";
/**
 * @packageDocumentation
 * @module Parts.M5StickC_JoyStick
 */
Object.defineProperty(exports, "__esModule", { value: true });
class M5StickC_JoyStick {
    constructor() {
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'M5StickC_JoyStick',
        };
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
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.obniz.wait(100); // wait for booting of STM32F030F4
        this.params.mode = 'master';
        this.params.clock = 100000;
        this.params.pull = '5v';
        this.i2c = this.obniz.getI2CWithConfig(this.params);
    }
    async getXWait() {
        const ret = await this.getXYWait();
        let val = ret[0];
        if (val > 0x7f) {
            val = val - 0x100;
        }
        return val;
    }
    async getYWait() {
        const ret = await this.getXYWait();
        let val = ret[1];
        if (val > 0x7f) {
            val = val - 0x100;
        }
        return val;
    }
    async isPressedWait() {
        this.i2c.write(0x38, [0x02]);
        const ret = await this.i2c.readWait(0x38, 3);
        return !ret[2];
    }
    async getXYWait() {
        this.i2c.write(0x38, [0x02]);
        const ret = await this.i2c.readWait(0x38, 3);
        return ret;
    }
}
exports.default = M5StickC_JoyStick;
