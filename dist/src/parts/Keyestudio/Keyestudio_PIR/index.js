"use strict";
/**
 * @packageDocumentation
 * @module Parts.Keyestudio_PIR
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Keyestudio_PIR {
    constructor() {
        this.keys = ['vcc', 'gnd', 'signal'];
        this.requiredKeys = ['signal'];
    }
    static info() {
        return {
            name: 'Keyestudio_PIR',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.io_signal = obniz.getIO(this.params.signal);
        this.io_signal.pull('0v');
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.io_signal.input((value) => {
            if (this.onchange) {
                this.onchange(value);
            }
        });
    }
    async getWait() {
        return await this.io_signal.inputWait();
    }
}
exports.default = Keyestudio_PIR;
