"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MESH_js_GP extends _1.MESH_js {
    constructor() {
        super(...arguments);
        this.onDinEvent = null;
        this.onAinEvent = null;
        this.onDinState = null;
        this.onAinState = null;
        this.onVoutState = null;
        this.onDoutState = null;
        this.onPWMoutState = null;
        this.MessageTypeID = 1;
        this.DinEventID = 0;
        this.AinEventID = 1;
        this.DinStateID = 2;
        this.AinStateID = 3;
        this.VoutStateID = 4;
        this.DoutStateID = 5;
        this.PWMoutStateID = 6;
        this.VCC = { AUTO: 0, ON: 1, OFF: 2 };
        this.AnalogInputEvent = {
            NotNotify: 0,
            OverThreshold: 1,
            InThreshold: 2,
        };
        this.Pin = { p1: 0, p2: 1, p3: 2 };
        this.Mode = { Always: 0, Once: 1, AlwaysAndOnce: 2 };
        this.State = { Low2High: 1, High2Low: 2 };
        this.DigitalPins = { p1: false, p2: false, p3: false };
    }
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        switch (data[1]) {
            case this.DinEventID: {
                if (typeof this.onDinEvent !== 'function') {
                    return;
                }
                const _pin = data[2];
                const _state = data[3];
                this.onDinEvent(_pin, _state);
                break;
            }
            case this.AinEventID: {
                if (typeof this.onAinEvent !== 'function') {
                    return;
                }
                const _pin = data[2];
                const _type = data[3];
                const _threshold = data[4];
                const _level = data[5];
                this.onAinEvent(_pin, _type, _threshold, _level);
                break;
            }
            case this.DinStateID: {
                if (typeof this.onDinState !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _state = data[4];
                this.onDinState(_request_id, _pin, _state);
                break;
            }
            case this.AinStateID: {
                if (typeof this.onAinState !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _state = data[4];
                const _mode = data[5];
                this.onAinState(_request_id, _pin, _state, _mode);
                break;
            }
            case this.VoutStateID: {
                if (typeof this.onVoutState !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _state = data[4];
                this.onVoutState(_request_id, _pin, _state);
                break;
            }
            case this.DoutStateID: {
                if (typeof this.onDoutState !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _state = data[4];
                this.onDoutState(_request_id, _pin, _state);
                break;
            }
            case this.PWMoutStateID: {
                if (typeof this.onPWMoutState !== 'function') {
                    return;
                }
                const _request_id = data[2];
                const _pin = data[3];
                const _level = data[4];
                this.onPWMoutState(_request_id, _pin, _level);
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
        if (pwm_ratio < 0 || 255 < pwm_ratio) {
            this.errorOutOfRange('PWM ratio (' + pwm_ratio + ') must be 0 ~ 255.');
            return [];
        }
        const HEADER = [this.MessageTypeID, 1];
        const BODY = [
            (din.p1 ? 1 : 0) + (din.p2 ? 2 : 0) + (din.p3 ? 4 : 0),
            (din_notify.p1 ? 1 : 0) +
                (din_notify.p2 ? 2 : 0) +
                (din_notify.p3 ? 4 : 0),
            (dout.p1 ? 1 : 0) + (dout.p2 ? 2 : 0) + (dout.p3 ? 4 : 0),
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
        return this._parseSetCommand(this.DinStateID, pin, requestId);
    }
    parseSetAinCommand(mode, requestId = 0) {
        return this._parseSetCommand(this.AinStateID, mode, requestId);
    }
    parseSetVoutCommand(pin, requestId = 0) {
        return this._parseSetCommand(this.VoutStateID, pin, requestId);
    }
    parseSetDoutCommand(pin, requestId = 0) {
        return this._parseSetCommand(this.DoutStateID, pin, requestId);
    }
    parseSetPWMCommand(pin, requestId = 0) {
        return this._parseSetCommand(this.PWMoutStateID, pin, requestId);
    }
    _parseSetCommand(eventId, param, requestId) {
        const HEADER = [this.MessageTypeID, eventId, requestId];
        const data = HEADER.concat(param);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MESH_js_GP = MESH_js_GP;
