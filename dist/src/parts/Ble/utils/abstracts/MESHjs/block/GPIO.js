"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPIO = void 0;
const Base_1 = require("./Base");
const Error_1 = require("../util/Error");
class GPIO extends Base_1.Base {
    constructor() {
        super(...arguments);
        /**
         * Digital input event
         */
        this.onDigitalInputEvent = null;
        /**
         * Analog input event
         */
        this.onAnalogInputEvent = null;
        /**
         * Digital input
         */
        this.onDigitalInput = null;
        /**
         * Analog input
         */
        this.onAnalogInput = null;
        /**
         * VCC output
         */
        this.onVOutput = null;
        /**
         * Digital output
         */
        this.onDigitalOutput = null;
        /**
         * PWM output
         */
        this.onPwm = null;
        this.DigitalPins = { p1: false, p2: false, p3: false };
        this.MESSAGE_TYPE_ID_ = 1;
        this.DIGITAL_IN_EVENT_ID_ = 0;
        this.ANALOG_IN_EVENT_ID_ = 1;
        this.DIGITAL_IN_ID_ = 2;
        this.ANALOG_IN_ID_ = 3;
        this.V_OUT_ID_ = 4;
        this.DIGITAL_OUT_ID_ = 5;
        this.PWM_ID_ = 6;
    }
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name, opt_serialnumber = '') {
        return super.isMESHblock(name, opt_serialnumber)
            ? (name === null || name === void 0 ? void 0 : name.indexOf('MESH-100GP')) !== -1
            : false;
    }
    /**
     * Parse data that received from MESH block, and emit event
     *
     * @const
     * @param data
     * @returns void
     */
    notify(data) {
        super.notify(data);
        if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_) {
            return;
        }
        const _receivedEventId = data[1];
        switch (_receivedEventId) {
            case this.DIGITAL_IN_EVENT_ID_: {
                if (typeof this.onDigitalInputEvent !== 'function') {
                    return;
                }
                const _pin = data[2];
                const _state = data[3];
                this.onDigitalInputEvent(_pin, _state);
                return;
            }
            case this.ANALOG_IN_EVENT_ID_: {
                if (typeof this.onAnalogInputEvent !== 'function') {
                    return;
                }
                const _level = data[5];
                this.onAnalogInputEvent(_level);
                return;
            }
            default: {
                break;
            }
        }
        const _requestId = data[2];
        switch (_receivedEventId) {
            case this.DIGITAL_IN_ID_: {
                if (typeof this.onDigitalInput !== 'function') {
                    return;
                }
                const pin = data[3];
                const state = data[4];
                this.onDigitalInput(_requestId, pin, state);
                return;
            }
            case this.ANALOG_IN_ID_: {
                if (typeof this.onAnalogInput !== 'function') {
                    return;
                }
                const level = data[4];
                const analogInputNotifyMode = data[5];
                this.onAnalogInput(_requestId, level, analogInputNotifyMode);
                return;
            }
            case this.V_OUT_ID_: {
                if (typeof this.onVOutput !== 'function') {
                    return;
                }
                const vccState = data[4];
                this.onVOutput(_requestId, vccState);
                return;
            }
            case this.DIGITAL_OUT_ID_: {
                if (typeof this.onDigitalOutput !== 'function') {
                    return;
                }
                const pin = data[3];
                const state = data[4];
                this.onDigitalOutput(_requestId, pin, state);
                return;
            }
            case this.PWM_ID_: {
                if (typeof this.onPwm !== 'function') {
                    return;
                }
                const level = data[4];
                this.onPwm(_requestId, level);
                return;
            }
            default: {
                break;
            }
        }
    }
    /**
     * Create command of set-mode
     *
     * @param digitalInputLow2High { p1:boolean, p2:boolean, p3:boolean }
     * @param digitalInputHigh2Low { p1:boolean, p2:boolean, p3:boolean }
     * @param digitalOutput { p1:boolean, p2:boolean, p3:boolean }
     * @param pwmRatio 0-255
     * @param vcc Vcc.ON or Vcc.OFF
     * @param analogInputRangeUpper 0-255(0.00-3.00[V])
     * @param analogInputRangeLower 0-255(0.00-3.00[V])
     * @param analogInputNotify AnalogInputEventCondition.NOT_NOTIFY or AnalogInputEventCondition.ABOVE_THRESHOLD or AnalogInputEventCondition.BELOW_THRESHOLD
     * @returns command
     */
    createSetmodeCommand(digitalInputLow2High, digitalInputHigh2Low, digitalOutput, pwmRatio, vcc, analogInputRangeUpper, analogInputRangeLower, analogInputNotify) {
        // Error Handle
        const PWM_MIN = 0;
        const PWM_MAX = 255;
        this.checkRange(pwmRatio, PWM_MIN, PWM_MAX, 'pwmRatio');
        if (vcc !== GPIO.Vcc.ON && vcc !== GPIO.Vcc.OFF) {
            throw new Error_1.MESHJsInvalidValueError('vcc');
        }
        const ANALOG_IN_RANGE_MIN = 0;
        const ANALOG_IN_RANGE_MAX = 255;
        this.checkRange(analogInputRangeUpper, ANALOG_IN_RANGE_MIN, ANALOG_IN_RANGE_MAX, 'analogInRangeUpper');
        this.checkRange(analogInputRangeLower, ANALOG_IN_RANGE_MIN, ANALOG_IN_RANGE_MAX, 'analogInRangeLower');
        if (analogInputNotify !== GPIO.AnalogInputEventCondition.NOT_NOTIFY &&
            analogInputNotify !== GPIO.AnalogInputEventCondition.ABOVE_THRESHOLD &&
            analogInputNotify !== GPIO.AnalogInputEventCondition.BELOW_THRESHOLD) {
            throw new Error_1.MESHJsInvalidValueError('analogInNotify');
        }
        // Generate Command
        const HEADER = [this.MESSAGE_TYPE_ID_, 1];
        const BODY = [
            this.pin2num_(digitalInputLow2High),
            this.pin2num_(digitalInputHigh2Low),
            this.pin2num_(digitalOutput),
            pwmRatio,
            vcc,
            analogInputRangeUpper,
            analogInputRangeLower,
            analogInputNotify,
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
    /**
     * Create command of digital-input
     *
     * @param pin
     * @param opt_requestId
     * @returns command
     */
    createDigitalInputCommand(pin, opt_requestId = 0) {
        return this.createCommand_(this.DIGITAL_IN_ID_, pin, opt_requestId);
    }
    /**
     * Create command of analog-input
     *
     * @param analogInputNotifyMode
     * @param opt_requestId
     * @returns command
     */
    createAnalogInputCommand(analogInputNotifyMode, opt_requestId = 0) {
        return this.createCommand_(this.ANALOG_IN_ID_, analogInputNotifyMode, opt_requestId);
    }
    /**
     * Create command of v-output
     *
     * @param opt_requestId
     * @returns command
     */
    createVOutputCommand(opt_requestId = 0) {
        const PIN = 0; // VOUT pin
        return this.createCommand_(this.V_OUT_ID_, PIN, opt_requestId);
    }
    /**
     * Create command of digital-output
     *
     * @param pin
     * @param opt_requestId
     * @returns command
     */
    createDigitalOutputCommand(pin, opt_requestId = 0) {
        return this.createCommand_(this.DIGITAL_OUT_ID_, pin, opt_requestId);
    }
    /**
     * Create command of PWM
     *
     * @param opt_requestId
     * @returns command
     */
    createPwmCommand(opt_requestId = 0) {
        return this.createCommand_(this.PWM_ID_, GPIO.Pin.P3, opt_requestId);
    }
    createCommand_(eventId, param, requestId) {
        const HEADER = [this.MESSAGE_TYPE_ID_, eventId, requestId];
        const data = HEADER.concat(param);
        data.push(this.checkSum(data));
        return data;
    }
    pin2num_(pins) {
        return (pins.p1 ? 1 : 0) + (pins.p2 ? 2 : 0) + (pins.p3 ? 4 : 0);
    }
}
exports.GPIO = GPIO;
// Constant Values
GPIO.AnalogInputEventCondition = {
    NOT_NOTIFY: 0,
    ABOVE_THRESHOLD: 17,
    BELOW_THRESHOLD: 34,
};
GPIO.AnalogInputNotifyMode = {
    STOP: 0,
    ONCE: 1,
    ALWAYS: 2,
};
GPIO.DigitalInputState = {
    HIGH: 0,
    LOW: 1,
};
GPIO.Pin = {
    P1: 0,
    P2: 1,
    P3: 2,
};
GPIO.State = {
    LOW_2_HIGH: 1,
    HIGH_2_LOW: 2,
};
GPIO.Vcc = {
    ON: 1,
    OFF: 2,
};
GPIO.VccState = {
    OFF: 0,
    ON: 1,
};
