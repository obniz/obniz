"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Error_1 = require("../util/Error");
class GPIO extends Base_1.Base {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onDigitalInputEvent = null;
        this.onAnalogInputEvent = null;
        this.onDigitalInput = null;
        this.onAnalogInput = null;
        this.onVOutput = null;
        this.onDigitalOutput = null;
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
     * notify
     *
     * @const
     * @param data
     * @returns
     */
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MESSAGE_TYPE_ID_) {
            return;
        }
        const _receivedId = data[1];
        switch (_receivedId) {
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
        switch (_receivedId) {
            case this.DIGITAL_IN_ID_: {
                if (typeof this.onDigitalInput !== 'function') {
                    return;
                }
                const requestId = data[2];
                const pin = data[3];
                const state = data[4];
                this.onDigitalInput(requestId, pin, state);
                return;
            }
            case this.ANALOG_IN_ID_: {
                if (typeof this.onAnalogInput !== 'function') {
                    return;
                }
                const requestId = data[2];
                const level = data[4];
                const analogInputNotifyMode = data[5];
                this.onAnalogInput(requestId, level, analogInputNotifyMode);
                return;
            }
            case this.V_OUT_ID_: {
                if (typeof this.onVOutput !== 'function') {
                    return;
                }
                const requestId = data[2];
                const vccState = data[4];
                this.onVOutput(requestId, vccState);
                return;
            }
            case this.DIGITAL_OUT_ID_: {
                if (typeof this.onDigitalOutput !== 'function') {
                    return;
                }
                const requestId = data[2];
                const pin = data[3];
                const state = data[4];
                this.onDigitalOutput(requestId, pin, state);
                return;
            }
            case this.PWM_ID_: {
                if (typeof this.onPwm !== 'function') {
                    return;
                }
                const requestId = data[2];
                const level = data[4];
                this.onPwm(requestId, level);
                return;
            }
            default: {
                break;
            }
        }
    }
    /**
     * parseSetmodeCommand
     *
     * @param digitalInputLow2High {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInputHigh2Low {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalOutput {p1:boolean, p2:boolean, p3:boolean}
     * @param pwmRatio 0 ~ 255
     * @param vcc Vcc.AUTO or Vcc.ON or Vcc.OFF
     * @param analogInputRangeUpper 0 ~ 255(0.00 ~ 3.00[V])
     * @param analogInputRangeBottom 0 ~ 255(0.00 ~ 3.00[V])
     * @param analogInputNotify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     * @returns command
     */
    parseSetmodeCommand(digitalInputLow2High, digitalInputHigh2Low, digitalOutput, pwmRatio, vcc, analogInputRangeUpper, analogInputRangeBottom, analogInputNotify) {
        // Error Handle
        const PWM_MIN = 0;
        const PWM_MAX = 255;
        this.checkRange(pwmRatio, PWM_MIN, PWM_MAX, 'pwmRatio');
        if (vcc !== GPIO.Vcc.AUTO && vcc !== GPIO.Vcc.ON && vcc !== GPIO.Vcc.OFF) {
            throw new Error_1.MESHJsInvalidValueError('vcc');
        }
        const ANALOG_IN_RANGE_MIN = 0;
        const ANALOG_IN_RANGE_MAX = 255;
        this.checkRange(analogInputRangeUpper, ANALOG_IN_RANGE_MIN, ANALOG_IN_RANGE_MAX, 'analogInRangeUpper');
        this.checkRange(analogInputRangeBottom, ANALOG_IN_RANGE_MIN, ANALOG_IN_RANGE_MAX, 'analogInRangeBottom');
        if (analogInputNotify !== GPIO.AnalogInEventCondition.NOT_NOTIFY &&
            analogInputNotify !== GPIO.AnalogInEventCondition.ABOVE_THRESHOLD &&
            analogInputNotify !== GPIO.AnalogInEventCondition.BELOW_THRESHOLD) {
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
            analogInputRangeBottom,
            analogInputNotify,
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
    /**
     * parseSetDinCommand
     *
     * @param pin
     * @param opt_requestId
     * @returns
     */
    parseDigitalInputCommand(pin, opt_requestId = 0) {
        return this.parseCommand_(this.DIGITAL_IN_ID_, pin, opt_requestId);
    }
    /**
     * parseSetAinCommand
     *
     * @param analogInputNotifyMode
     * @param requestId
     * @returns
     */
    parseAnalogInputCommand(analogInputNotifyMode, requestId = 0) {
        return this.parseCommand_(this.ANALOG_IN_ID_, analogInputNotifyMode, requestId);
    }
    /**
     * parseSetVOutputCommand
     *
     * @param requestId
     * @returns
     */
    parseVOutputCommand(requestId = 0) {
        const PIN = 0; // VOUT pin
        return this.parseCommand_(this.V_OUT_ID_, PIN, requestId);
    }
    /**
     * parseSetDoutCommand
     *
     * @param pin
     * @param requestId
     * @returns
     */
    parseDigitalOutputCommand(pin, requestId = 0) {
        return this.parseCommand_(this.DIGITAL_OUT_ID_, pin, requestId);
    }
    /**
     * parseSetPWMCommand
     *
     * @param requestId
     * @returns
     */
    parsePwmCommand(requestId = 0) {
        return this.parseCommand_(this.PWM_ID_, GPIO.Pin.P3, requestId);
    }
    parseCommand_(eventId, param, requestId) {
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
GPIO.AnalogInEventCondition = {
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
    UP_EDGE: 0,
    DOWN_EDGE: 1,
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
    AUTO: 0,
    ON: 1,
    OFF: 2,
};
GPIO.VccState = {
    OFF: 0,
    ON: 1,
};
