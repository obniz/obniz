"use strict";
/**
 * @packageDocumentation
 * @module Parts.Keyestudio_MoistureSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Keyestudio_MoistureSensor {
    constructor() {
        this.keys = ['vcc', 'signal', 'gnd'];
        this.requiredKeys = ['signal'];
    }
    static info() {
        return {
            name: 'Keyestudio_MoistureSensor',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.ad = obniz.getAD(this.params.signal);
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
exports.default = Keyestudio_MoistureSensor;
