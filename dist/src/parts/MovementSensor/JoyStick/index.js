"use strict";
/**
 * @packageDocumentation
 * @module Parts.JoyStick
 */
Object.defineProperty(exports, "__esModule", { value: true });
class JoyStick {
    constructor() {
        this.keys = ['sw', 'y', 'x', 'vcc', 'gnd', 'i2c'];
        this.requiredKeys = ['sw', 'y', 'x'];
        this.pins = this.keys || ['sw', 'y', 'x', 'vcc', 'gnd'];
        this.pinname = { sw: 'sw12' };
        this.shortName = 'joyS';
    }
    static info() {
        return {
            name: 'JoyStick',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.io_sig_sw = obniz.getIO(this.params.sw);
        this.ad_x = obniz.getAD(this.params.x);
        this.ad_y = obniz.getAD(this.params.y);
        this.io_sig_sw.pull('5v');
        this.ad_x.start((value) => {
            this.positionX = value / 5.0;
            if (this.onchangex) {
                this.onchangex(this.positionX * 2 - 1);
            }
        });
        this.ad_y.start((value) => {
            this.positionY = value / 5.0;
            if (this.onchangey) {
                this.onchangey(this.positionY * 2 - 1);
            }
        });
        this.io_sig_sw.input((value) => {
            this.isPressed = value === false;
            if (this.onchangesw) {
                this.onchangesw(value === false);
            }
        });
    }
    async isPressedWait() {
        const ret = await this.io_sig_sw.inputWait();
        return ret === false;
    }
    async getXWait() {
        const value = await this.ad_x.getWait();
        this.positionX = value / 5.0;
        return this.positionX * 2 - 1;
    }
    async getYWait() {
        const value = await this.ad_y.getWait();
        this.positionY = value / 5.0;
        return this.positionY * 2 - 1;
    }
}
exports.default = JoyStick;
