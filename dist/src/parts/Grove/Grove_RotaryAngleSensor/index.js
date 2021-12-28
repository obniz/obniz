"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_RotaryAngleSensorOptionsA
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_RotaryAngleSensor {
    constructor() {
        // public vcc_voltage = 5.0;
        this.position = 0;
        this.keys = ['vcc', 'gnd', 'signal', 'grove'];
        this.requiredKeys = [];
        this.drive = '5v';
    }
    static info() {
        return {
            name: 'Grove_RotaryAngleSensor',
        };
    }
    wired(obniz) {
        if (this.params.grove) {
            const groveAd = this.params.grove.getAnalog();
            this.ad = groveAd.primary;
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
            this.ad = obniz.getAD(this.params.signal);
        }
        this.ad.start((value) => {
            this.value = value;
            if (this.onchange) {
                this.onchange(this.value);
            }
        });
    }
}
exports.default = Grove_RotaryAngleSensor;
