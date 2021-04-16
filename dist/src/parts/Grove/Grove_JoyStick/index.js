"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_JoyStick
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_JoyStick {
    constructor() {
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_JoyStick',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        const speed = 400000;
        if (this.params.grove) {
            this.i2c = this.params.grove.getI2c(speed, '5v');
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.obniz.wait(100); // wait for booting of MEGA328
            this.params.mode = 'master';
            this.params.clock = speed;
            this.params.pull = '5v';
            this.i2c = this.obniz.getI2CWithConfig(this.params);
        }
    }
    async getXWait() {
        const ret = await this.i2c.readWait(0x52, 3);
        return ret[0];
    }
    async getYWait() {
        const ret = await this.i2c.readWait(0x52, 3);
        return ret[1];
    }
    async isPressedWait() {
        const ret = await this.i2c.readWait(0x52, 3);
        return Boolean(ret[2]);
    }
}
exports.default = Grove_JoyStick;
