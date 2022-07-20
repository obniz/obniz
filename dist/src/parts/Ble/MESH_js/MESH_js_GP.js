"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const MESH_js_Error_1 = require("./MESH_js_Error");
class MESH_js_GP extends _1.MESH_js {
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
        this.VCC = { AUTO: 0, ON: 1, OFF: 2 };
        this.AnalogInputEventCondition = {
            NotNotify: 0,
            OverThreshold: 1,
            InThreshold: 2,
        };
        this.Pin = { p1: 0, p2: 1, p3: 2 };
        this.Mode = { Always: 0, Once: 1, AlwaysAndOnce: 2 };
        this.State = { Low2High: 1, High2Low: 2 };
        this.DigitalPins = { p1: false, p2: false, p3: false };
        this.MessageTypeID = 1;
        this.DigitalInEventID = 0;
        this.AnalogInEventID = 1;
        this.DigitalInID = 2;
        this.AnalogInID = 3;
        this.VOutID = 4;
        this.DigitalOutID = 5;
        this.PwmID = 6;
    }
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        switch (data[1]) {
            case this.DigitalInEventID: {
                if (typeof this.onDigitalInEventNotify !== 'function') {
                    return;
                }
                const _pin = data[2];
                const _state = data[3];
                this.onDigitalInEventNotify(_pin, _state);
                break;
            }
            case this.AnalogInEventID: {
                if (typeof this.onAnalogInEventNotify !== 'function') {
                    return;
                }
                const _pin = data[2];
                const _type = data[3];
                const _threshold = data[4];
                const _level = data[5];
                this.onAnalogInEventNotify(_pin, _type, _threshold, _level);
                break;
            }
            case this.DigitalInID: {
                if (typeof this.onDigitalInNotify !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _state = data[4];
                this.onDigitalInNotify(_request_id, _pin, _state);
                break;
            }
            case this.AnalogInID: {
                if (typeof this.onAnalogInNotify !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _state = data[4];
                const _mode = data[5];
                this.onAnalogInNotify(_request_id, _pin, _state, _mode);
                break;
            }
            case this.VOutID: {
                if (typeof this.onVOutNotify !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _state = data[4];
                this.onVOutNotify(_request_id, _pin, _state);
                break;
            }
            case this.DigitalOutID: {
                if (typeof this.onDigitalOutNotify !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _state = data[4];
                this.onDigitalOutNotify(_request_id, _pin, _state);
                break;
            }
            case this.PwmID: {
                if (typeof this.onPwmNotify !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _level = data[4];
                this.onPwmNotify(_request_id, _level);
                break;
            }
            default:
                break;
        }
    }
    /**
     *
     * @param din
     * @param din_notify
     * @param dout
     * @param pwm_ratio
     * @param ain_range_upper
     * @param ain_range_bottom
     * @param ain_notify
     * @returns
     */
    parseSetmodeCommand(din, din_notify, dout, pwm_ratio, vcc, ain_range_upper, ain_range_bottom, ain_notify) {
        // Error Handle
        const _PwmMin = 0;
        const _PwmMax = 255;
        if (pwm_ratio < _PwmMin || _PwmMax < pwm_ratio) {
            throw new MESH_js_Error_1.MESHOutOfRangeError('pwm_ratio', _PwmMin, _PwmMax);
        }
        // Generate Command
        const HEADER = [this.MessageTypeID, 1];
        const BODY = [
            this.pin2num(din),
            this.pin2num(din_notify),
            this.pin2num(dout),
            pwm_ratio,
            vcc,
            ain_range_upper,
            ain_range_bottom,
            ain_notify,
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
    parseSetDinCommand(pin, requestId = 0) {
        return this._parseSetCommand(this.DigitalInID, pin, requestId);
    }
    parseSetAinCommand(mode, requestId = 0) {
        return this._parseSetCommand(this.AnalogInID, mode, requestId);
    }
    parseSetVoutCommand(pin, requestId = 0) {
        return this._parseSetCommand(this.VOutID, pin, requestId);
    }
    parseSetDoutCommand(pin, requestId = 0) {
        return this._parseSetCommand(this.DigitalOutID, pin, requestId);
    }
    parseSetPWMCommand(requestId = 0) {
        return this._parseSetCommand(this.PwmID, this.Pin.p3, requestId);
    }
    _parseSetCommand(eventId, param, requestId) {
        const HEADER = [this.MessageTypeID, eventId, requestId];
        const data = HEADER.concat(param);
        data.push(this.checkSum(data));
        return data;
    }
    pin2num(pins) {
        return (pins.p1 ? 1 : 0) + (pins.p2 ? 2 : 0) + (pins.p3 ? 4 : 0);
    }
}
exports.MESH_js_GP = MESH_js_GP;
