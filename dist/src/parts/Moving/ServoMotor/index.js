"use strict";
/**
 * @packageDocumentation
 * @module Parts.ServoMotor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ServoMotor {
    constructor() {
        this.range = {
            min: 0.5,
            max: 2.4,
        };
        this.keys = ['gnd', 'vcc', 'signal', 'pwm'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'ServoMotor',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        if (obniz.isValidIO(this.params.vcc)) {
            this.io_vcc = obniz.getIO(this.params.vcc);
        }
        if (this.params.pwm) {
            this.pwm = this.params.pwm;
        }
        else {
            this.pwm = obniz.getFreePwm();
            this.pwm_io_num = this.params.signal;
            if (typeof this.pwm_io_num !== 'number') {
                throw new Error(`no io specified for pwm`);
            }
            this.pwm.start({ io: this.pwm_io_num });
        }
        this.pwm.freq(50);
    }
    // Module functions
    angle(ratio) {
        const max = this.range.max;
        const min = this.range.min;
        const val = ((max - min) * ratio) / 180.0 + min;
        this.pwm.pulse(val);
    }
    on() {
        if (this.io_vcc) {
            this.io_vcc.output(true);
        }
    }
    off() {
        if (this.io_vcc) {
            this.io_vcc.output(false);
        }
    }
}
exports.default = ServoMotor;
