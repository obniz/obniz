"use strict";
/**
 * @packageDocumentation
 * @module Parts.DCMotor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class DCMotor {
    constructor() {
        this.keys = ['forward', 'back'];
        this.requiredKeys = ['forward', 'back'];
        this.status = {
            direction: null,
            power: 30,
        };
    }
    static info() {
        return {
            name: 'DCMotor',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.forward_io_num = this.params.forward;
        this.back_io_num = this.params.back;
        this.pwm = obniz.getFreePwm();
        this.setPwmGnd(this.forward_io_num, this.back_io_num);
        this.power(this.status.power);
    }
    // Module functions
    forward() {
        this.move(true);
    }
    reverse() {
        this.move(false);
    }
    stop() {
        if (this.status.direction === null) {
            return;
        }
        this.status.direction = null;
        this.pwm.duty(0);
    }
    move(forward) {
        if (forward) {
            if (this.status.direction === true) {
                return;
            }
            this.status.direction = true;
        }
        else {
            if (this.status.direction === false) {
                return;
            }
            this.status.direction = false;
        }
        const power = this.power();
        this.power(0);
        this.power(power);
    }
    power(power) {
        if (power === undefined) {
            return this.status.power;
        }
        this.status.power = power;
        if (this.status.direction === null) {
            this.pwm.duty(0);
            return;
        }
        const pwm_io = this.status.direction
            ? this.forward_io_num
            : this.back_io_num;
        const gnd_io = this.status.direction
            ? this.back_io_num
            : this.forward_io_num;
        this.setPwmGnd(pwm_io, gnd_io);
        this.pwm.duty(power);
    }
    setPwmGnd(pwm_io, gnd_io) {
        var _a, _b;
        this.pwm.start({ io: pwm_io });
        this.pwm.freq(100000);
        (_a = this.obniz.display) === null || _a === void 0 ? void 0 : _a.setPinName(pwm_io, 'DCMotor', 'pwm');
        this.obniz.getIO(gnd_io).output(false);
        (_b = this.obniz.display) === null || _b === void 0 ? void 0 : _b.setPinName(gnd_io, 'DCMotor', 'gnd');
    }
}
exports.default = DCMotor;
