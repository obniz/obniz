"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_EARTHOptionsA
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_EARTH {
    constructor() {
        this.keys = ['vcc', 'aout', 'dout', 'gnd', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_EARTH',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (this.params.grove) {
            const groveIOs = this.params.grove.getAnalogDigital();
            this.ad = groveIOs.analog;
            this.io = groveIOs.digital;
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.ad = obniz.getAD(this.params.aout);
            this.io = obniz.getIO(this.params.dout);
        }
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
    async getDigitalHumidityWait() {
        return await this.io.inputWait();
    }
}
exports.default = Grove_EARTH;
