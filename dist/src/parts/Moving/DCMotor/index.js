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
        this.setPwmGndPin(this.forward_io_num, this.back_io_num);
    }
    // Module functions
    /**
     * Start rotation to the forward direction.
     */
    forward() {
        this.move(true);
    }
    /**
     * Start rotation to the reverse direction.
     */
    reverse() {
        this.move(false);
    }
    /**
     * Stop rotation.
     */
    stop() {
        if (this.status.direction === null) {
            return;
        }
        this.status.direction = null;
        this.pwm.duty(0);
    }
    /**
     * Start rotation by specifying rotation direction.
     *
     * @param forward true is forward rotation, and false is reverse rotation.
     */
    move(forward) {
        if (forward === undefined) {
            if (this.status.direction === null) {
                return;
            }
        }
        else {
            if (this.status.direction === forward) {
                return;
            }
            this.status.direction = forward;
        }
        const pwm_io = this.status.direction
            ? this.forward_io_num
            : this.back_io_num;
        const gnd_io = this.status.direction
            ? this.back_io_num
            : this.forward_io_num;
        this.setPwmGndPin(pwm_io, gnd_io);
        this.pwm.duty(this.status.power);
    }
    /**
     * Set the motor power.
     *
     * @param power Specify between 0 and 100.
     */
    power(power) {
        this.status.power = power;
        if (this.status.direction !== null) {
            this.pwm.duty(this.status.power);
        }
    }
    setPwmGndPin(pwm_io, gnd_io) {
        var _a;
        this.pwm.start({ io: pwm_io });
        this.pwm.freq(100000);
        this.obniz.getIO(gnd_io).output(false);
        (_a = this.obniz.display) === null || _a === void 0 ? void 0 : _a.setPinNames(DCMotor.info().name, {
            [this.forward_io_num]: 'forward',
            [this.back_io_num]: 'back',
        });
    }
}
exports.default = DCMotor;
