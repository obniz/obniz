"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeripheralPWM = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
const util_1 = require("../utils/util");
/**
 * We will now generate PWM.
 * Maximum current depends on the driving mode. See [[PeripheralIO|io]].
 *
 * @category Peripherals
 */
class PeripheralPWM extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, id) {
        super(obniz);
        /**
         * @ignore
         */
        this.used = false;
        this.id = id;
        this._reset();
    }
    /**
     * This starts a pwm on a given io.
     * freq=1khz, duty=0% at start.
     *
     * io drive and pull can be configured. See more details on [[PeripheralIO|io]]
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0}); // start pwm. output at io0
     * pwm.freq(1000);
     * pwm.duty(50);
     *
     * var pwm2 = obniz.getFreePwm();
     * pwm2.start({io:1, drive:"open-drain", pull:"5v"});
     * ```
     *
     * @param params
     */
    start(params) {
        const err = util_1.ObnizUtil._requiredKeys(params, ['io']);
        if (err) {
            throw new Error("pwm start param '" + err + "' required, but not found ");
        }
        this.params = util_1.ObnizUtil._keyFilter(params, ['io', 'drive', 'pull']);
        const io = this.params.io;
        const ioObj = this.Obniz.getIO(io);
        ioObj.drive(this.params.drive || '5v');
        ioObj.pull(this.params.pull || null);
        this.state = {
            io,
            freq: 1000,
        };
        this.sendWS({
            io,
        });
        this.used = true;
    }
    /**
     * Set frequency, not pulse duration.
     *
     *
     * For example, this value will be 1khz with DC motor.
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0});
     * pwm.freq(1000); // set pwm. frequency to 1khz
     * ```
     *
     * @param freq frequency (Hz)
     */
    freq(freq) {
        if (!this.used) {
            throw new Error(`pwm${this.id} is not started`);
        }
        freq *= 1;
        if (typeof freq !== 'number') {
            throw new Error('please provide freq in number');
        }
        this.state.freq = freq;
        this.sendWS({
            freq,
        });
        if (typeof this.state.duty === 'number') {
            this.duty(this.state.duty);
        }
    }
    /**
     * Set pulse duty
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0});
     * pwm.freq(2000); // set pwm frequency to 2khz
     * pwm.pulse(0.5) // set pwm pulse 0.5ms.  so this is  25% ratio.
     * ```
     *
     * @param pulse_width pulse time (ms).
     */
    pulse(pulse_width) {
        if (!this.used) {
            throw new Error(`pwm${this.id} is not started`);
        }
        this.state.pulse = pulse_width;
        delete this.state.duty;
        this.sendWS({
            pulse: pulse_width,
        });
    }
    /**
     * Set pulse duty in terms of ratio.
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0});
     * pwm.freq(2000); // set pwm frequency to 2khz
     * pwm.duty(50) // set pwm pulse width 50%
     * ```
     *
     * @param duty
     */
    duty(duty) {
        if (!this.used) {
            throw new Error(`pwm${this.id} is not started`);
        }
        duty *= 1;
        if (typeof this.state.freq !== 'number' || this.state.freq <= 0) {
            throw new Error('please provide freq first.');
        }
        if (typeof duty !== 'number') {
            throw new Error('please provide duty in number');
        }
        if (duty < 0) {
            duty = 0;
        }
        if (duty > 100) {
            duty = 100;
        }
        const pulse_width = (1.0 / this.state.freq) * 1000 * duty * 0.01;
        this.state.duty = duty;
        this.sendWS({
            pulse: pulse_width,
        });
    }
    /**
     * @ignore
     */
    isUsed() {
        return this.used;
    }
    /**
     * It stops pwm and releases io.
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0});
     * pwm.end();
     * ```
     */
    end() {
        this.state = {};
        this.sendWS(null);
        this.used = false;
    }
    /**
     * This modulates pwm with data.
     *
     * Modulation can be chosen from below.
     *
     * 1. "am"
     *
     * ### am modulation
     * data "1" means put out the pwm with duty ratio of 50%. "0" means stop pwm. io will be 0.
     * Interval defines the symbol baud rate.
     * Duty is fixed at 50%.
     *
     *
     * ![](media://pwm_modu.png)
     *
     * This is useful to generate IR signal (Remote control).
     * Frequency of 38kHz gets modulated with signals.
     *
     * @param type
     * @param symbol_length
     * @param data data array. All data[index] is 0 or 1.
     */
    modulate(type, symbol_length, data) {
        if (!this.used) {
            throw new Error(`pwm${this.id} is not started`);
        }
        this.sendWS({
            modulate: {
                type,
                symbol_length,
                data,
            },
        });
    }
    /**
     * @ignore
     * @private
     */
    schemaBasePath() {
        return 'pwm' + this.id;
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.state = {};
        this.used = false;
    }
    sendWS(obj) {
        const wsObj = {};
        wsObj['pwm' + this.id] = obj;
        this.Obniz.send(wsObj);
    }
}
exports.PeripheralPWM = PeripheralPWM;
