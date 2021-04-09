"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_Buzzer
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_Buzzer {
    constructor() {
        this.keys = ['signal', 'gnd', 'vcc', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_Buzzer',
        };
    }
    wired(obniz) {
        if (this.params.grove) {
            this.pwm = this.params.grove.getPwm();
        }
        else {
            this.obniz = obniz;
            obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.pwm = obniz.getFreePwm();
            this.pwm.start({ io: this.params.signal });
        }
    }
    play(freq) {
        if (typeof freq !== 'number') {
            throw new Error('freq must be a number');
        }
        freq = Math.floor(freq);
        if (freq > 0) {
            this.pwm.freq(freq);
            this.pwm.pulse((1 / freq / 2) * 1000);
        }
        else {
            this.pwm.pulse(0);
        }
    }
    stop() {
        this.play(0);
    }
}
exports.default = Grove_Buzzer;
