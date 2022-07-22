"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
const MeshJsError_1 = require("./MeshJsError");
class MeshJsGp extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onDigitalInEventNotify = null;
        this.onAnalogInEventNotify = null;
        this.onDigitalInNotify = null;
        this.onAnalogInNotify = null;
        this.onVOutNotify = null;
        this.onDigitalOutNotify = null;
        this.onPwmNotify = null;
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
        switch (data[1]) {
            case this.DIGITAL_IN_EVENT_ID_: {
                if (typeof this.onDigitalInEventNotify !== 'function') {
                    return;
                }
                const _pin = data[2];
                const _state = data[3];
                this.onDigitalInEventNotify(_pin, _state);
                break;
            }
            case this.ANALOG_IN_EVENT_ID_: {
                if (typeof this.onAnalogInEventNotify !== 'function') {
                    return;
                }
                const _level = data[5];
                this.onAnalogInEventNotify(_level);
                break;
            }
            case this.DIGITAL_IN_ID_: {
                if (typeof this.onDigitalInNotify !== 'function') {
                    return;
                }
                const requestId = data[2];
                const pin = data[3];
                const state = data[4];
                this.onDigitalInNotify(requestId, pin, state);
                break;
            }
            case this.ANALOG_IN_ID_: {
                if (typeof this.onAnalogInNotify !== 'function') {
                    return;
                }
                const requestId = data[2];
                const state = data[4];
                const mode = data[5];
                this.onAnalogInNotify(requestId, state, mode);
                break;
            }
            case this.V_OUT_ID_: {
                if (typeof this.onVOutNotify !== 'function') {
                    return;
                }
                const requestId = data[2];
                const state = data[4];
                this.onVOutNotify(requestId, state);
                break;
            }
            case this.DIGITAL_OUT_ID_: {
                if (typeof this.onDigitalOutNotify !== 'function') {
                    return;
                }
                const requestId = data[2];
                const pin = data[3];
                const state = data[4];
                this.onDigitalOutNotify(requestId, pin, state);
                break;
            }
            case this.PWM_ID_: {
                if (typeof this.onPwmNotify !== 'function') {
                    return;
                }
                const requestId = data[2];
                const level = data[4];
                this.onPwmNotify(requestId, level);
                break;
            }
            default:
                break;
        }
    }
    /**
     * parseSetmodeCommand
     *
     * @param digitalIn {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInNotify {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalOut {p1:boolean, p2:boolean, p3:boolean}
     * @param pwmRatio 0 ~ 255
     * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
     * @param analogInRangeUpper 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param analogInRangeBottom 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param analogInNotify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     * @returns command
     */
    parseSetmodeCommand(digitalIn, digitalInNotify, digitalOut, pwmRatio, vcc, analogInRangeUpper, analogInRangeBottom, analogInNotify) {
        // Error Handle
        const PWM_MIN = 0;
        const PWM_MAX = 255;
        if (pwmRatio < PWM_MIN || PWM_MAX < pwmRatio) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('pwmRatio', PWM_MIN, PWM_MAX);
        }
        if (vcc !== MeshJsGp.VCC.AUTO &&
            vcc !== MeshJsGp.VCC.ON &&
            vcc !== MeshJsGp.VCC.OFF) {
            throw new MeshJsError_1.MeshJsInvalidValueError('vcc');
        }
        const ANALOG_IN_RANGE_MIN = 0;
        const ANALOG_IN_RANGE_MAX = 3;
        if (analogInRangeUpper < ANALOG_IN_RANGE_MIN ||
            ANALOG_IN_RANGE_MAX < analogInRangeUpper) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('analogInRangeUpper', ANALOG_IN_RANGE_MIN, ANALOG_IN_RANGE_MAX);
        }
        if (analogInRangeBottom < ANALOG_IN_RANGE_MIN ||
            ANALOG_IN_RANGE_MAX < analogInRangeBottom) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('analogInRangeBottom', ANALOG_IN_RANGE_MIN, ANALOG_IN_RANGE_MAX);
        }
        if (analogInNotify !== MeshJsGp.ANALOG_IN_EVENT_CONDITION.NOT_NOTIFY &&
            analogInNotify !== MeshJsGp.ANALOG_IN_EVENT_CONDITION.ABOVE_THRESHOLD &&
            analogInNotify !== MeshJsGp.ANALOG_IN_EVENT_CONDITION.BELOW_THRESHOLD) {
            throw new MeshJsError_1.MeshJsInvalidValueError('analogInNotify');
        }
        // Generate Command
        const HEADER = [this.MESSAGE_TYPE_ID_, 1];
        const BODY = [
            this.pin2num(digitalIn),
            this.pin2num(digitalInNotify),
            this.pin2num(digitalOut),
            pwmRatio,
            vcc,
            analogInRangeUpper,
            analogInRangeBottom,
            analogInNotify,
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
    /**
     * parseSetDinCommand
     *
     * @param pin
     * @param requestId
     * @returns
     */
    parseSetDinCommand(pin, requestId = 0) {
        return this.parseSetCommand_(this.DIGITAL_IN_ID_, pin, requestId);
    }
    /**
     * parseSetAinCommand
     *
     * @param mode
     * @param requestId
     * @returns
     */
    parseSetAinCommand(mode, requestId = 0) {
        return this.parseSetCommand_(this.ANALOG_IN_ID_, mode, requestId);
    }
    /**
     * parseSetVoutCommand
     *
     * @param pin
     * @param requestId
     * @returns
     */
    parseSetVoutCommand(pin, requestId = 0) {
        return this.parseSetCommand_(this.V_OUT_ID_, pin, requestId);
    }
    /**
     * parseSetDoutCommand
     *
     * @param pin
     * @param requestId
     * @returns
     */
    parseSetDoutCommand(pin, requestId = 0) {
        return this.parseSetCommand_(this.DIGITAL_OUT_ID_, pin, requestId);
    }
    /**
     * parseSetPWMCommand
     *
     * @param requestId
     * @returns
     */
    parseSetPWMCommand(requestId = 0) {
        return this.parseSetCommand_(this.PWM_ID_, MeshJsGp.PIN.P3, requestId);
    }
    parseSetCommand_(eventId, param, requestId) {
        const HEADER = [this.MESSAGE_TYPE_ID_, eventId, requestId];
        const data = HEADER.concat(param);
        data.push(this.checkSum(data));
        return data;
    }
    pin2num(pins) {
        return (pins.p1 ? 1 : 0) + (pins.p2 ? 2 : 0) + (pins.p3 ? 4 : 0);
    }
}
exports.MeshJsGp = MeshJsGp;
// Constant Values
MeshJsGp.ANALOG_IN_EVENT_CONDITION = {
    NOT_NOTIFY: 0,
    ABOVE_THRESHOLD: 1,
    BELOW_THRESHOLD: 2,
};
MeshJsGp.MODE = {
    ALWAYS: 0,
    ONCE: 1,
    ALWAYS_AND_ONECE: 2,
};
MeshJsGp.PIN = {
    P1: 0,
    P2: 1,
    P3: 2,
};
MeshJsGp.STATE = {
    LOW_2_HIGH: 1,
    HIGH_2_LOW: 2,
};
MeshJsGp.VCC = {
    AUTO: 0,
    ON: 1,
    OFF: 2,
};
