"use strict";
/**
 * @packageDocumentation
 * @module Parts.Potentiometer
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Potentiometer {
    constructor() {
        this.vcc_voltage = 5.0;
        this.position = 0;
        this.keys = ['pin0', 'pin1', 'pin2'];
        this.requiredKeys = ['pin0', 'pin1', 'pin2'];
    }
    static info() {
        return {
            name: 'Potentiometer',
        };
    }
    wired(obniz) {
        this.obniz.setVccGnd(this.params.pin0, this.params.pin2, '5v');
        this.ad = obniz.getAD(this.params.pin1);
        obniz.getAD(this.params.pin0).start((value) => {
            this.vcc_voltage = value;
        });
        this.ad.start((value) => {
            this.position = value / this.vcc_voltage;
            if (this.onchange) {
                this.onchange(this.position);
            }
        });
    }
}
exports.default = Potentiometer;
