"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_PressureSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_PressureSensor {
    constructor() {
        this.keys = ['vcc', 'gnd', 'output', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_PressureSensor',
        };
    }
    onchange(value) {
        // do nothing.
    }
    wired(obniz) {
        if (this.params.grove) {
            const groveAd = this.params.grove.getAnalog();
            this.ad = groveAd.primary;
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.ad = obniz.getAD(this.params.output);
        }
        this.ad.start((value) => {
            this.value = value * 100;
            if (this.onchange) {
                this.onchange(this.value);
            }
        });
    }
    async getWait() {
        const value = await this.ad.getWait();
        this.value = value * 100;
        return this.value;
    }
}
exports.default = Grove_PressureSensor;
