"use strict";
/**
 * @packageDocumentation
 * @module Parts.SEN0114
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SEN0114 {
    constructor() {
        this.keys = ['vcc', 'output', 'gnd'];
        this.requiredKeys = ['output'];
    }
    static info() {
        return {
            name: 'SEN0114',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.ad = obniz.getAD(this.params.output);
        this.ad.start((value) => {
            this.value = value;
            if (this.onchange) {
                this.onchange(this.value);
            }
        });
    }
    async getHumidityWait() {
        return await this.ad.getWait();
    }
}
exports.default = SEN0114;
