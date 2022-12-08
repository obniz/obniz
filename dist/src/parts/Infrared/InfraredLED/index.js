"use strict";
/**
 * @packageDocumentation
 * @module Parts.InfraredLED
 */
Object.defineProperty(exports, "__esModule", { value: true });
class InfraredLED {
    constructor() {
        this.dataSymbolLength = 0.07;
        this.keys = ['anode', 'cathode'];
        this.requiredKeys = ['anode'];
    }
    static info() {
        return {
            name: 'InfraredLED',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (!this.obniz.isValidIO(this.params.anode)) {
            throw new Error('anode is not valid io');
        }
        if (this.params.cathode) {
            if (!this.obniz.isValidIO(this.params.cathode)) {
                throw new Error('cathode is not valid io');
            }
            this.io_cathode = obniz.getIO(this.params.cathode);
            this.io_cathode.output(false);
        }
        this.pwm = this.obniz.getFreePwm();
        this.pwm.start({ io: this.params.anode });
        this.pwm.freq(38000);
        this.obniz.wait(150); // TODO: this is instant fix for pwm start delay
    }
    send(data) {
        if (data && data.length > 0 && data[data.length - 1] === 1) {
            data.push(0);
        }
        this.pwm.modulate('am', this.dataSymbolLength, data);
    }
}
exports.default = InfraredLED;
