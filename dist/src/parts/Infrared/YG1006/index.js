"use strict";
/**
 * @packageDocumentation
 * @module Parts.YG1006
 */
Object.defineProperty(exports, "__esModule", { value: true });
class YG1006 {
    constructor() {
        this.onchange = null;
        this.keys = ['signal', 'vcc', 'gnd'];
        this.requiredKeys = ['signal'];
    }
    static info() {
        return {
            name: 'YG1006',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.signal = this.obniz.getAD(this.params.signal);
        this.signal.start((value) => {
            if (this.onchange) {
                this.onchange(value);
            }
        });
    }
    async getWait() {
        return await this.signal.getWait();
    }
}
exports.default = YG1006;
