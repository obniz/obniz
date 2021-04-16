"use strict";
/**
 * @packageDocumentation
 * @module Parts.PaPIRsVZ
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PaPIRsVZ {
    constructor() {
        this.keys = ['vcc', 'gnd', 'signal'];
        this.requiredKeys = ['signal'];
    }
    static info() {
        return {
            name: 'PaPIRsVZ',
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
}
exports.default = PaPIRsVZ;
