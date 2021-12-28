"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_Speaker
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_Speaker {
    constructor() {
        this.keys = ['vcc', 'gnd', 'signal', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_Speaker',
        };
    }
    onchange(value) {
        // do nothing.
    }
    wired(obniz) {
        if (this.params.grove) {
            this.pwm = this.params.grove.getPwm();
        }
        else {
            this.obniz = obniz;
            this.obniz.setVccGnd(null, this.params.gnd, '5v');
            this.pwm = obniz.getFreePwm();
            this.pwm.start({ io: this.params.signal });
        }
    }
    play(frequency) {
        if (typeof frequency !== 'number') {
            throw new Error('freq must be a number');
        }
        frequency = Math.floor(frequency); // temporary
        if (frequency > 0) {
            this.pwm.freq(frequency);
            this.pwm.pulse((1 / frequency / 2) * 1000);
        }
        else {
            this.pwm.pulse(0);
        }
    }
    stop() {
        this.play(0);
    }
}
exports.default = Grove_Speaker;
