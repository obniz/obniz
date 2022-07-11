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
    }
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        switch (data[1]) {
            case this.DinEventID:
                if (typeof this.onDinEvent !== 'function') {
                    return;
                }
                this.onDinEvent(data[2], data[3]);
                break;
            case this.AinEventID:
                if (typeof this.onAinEvent !== 'function') {
                    return;
                }
                this.onAinEvent(data[2], data[3], data[4], data[5]);
                break;
            case this.DinStateID:
                if (typeof this.onDinState !== 'function') {
                    return;
                }
                this.onDinState(data[2], data[3], data[4]);
                break;
            case this.AinStateID:
                if (typeof this.onAinState !== 'function') {
                    return;
                }
                this.onAinState(data[2], data[3], data[4], data[5]);
                break;
            case this.VoutStateID:
                if (typeof this.onVoutState !== 'function') {
                    return;
                }
                this.onVoutState(data[2], data[3], data[4]);
                break;
            case this.DoutStateID:
                if (typeof this.onDoutState !== 'function') {
                    return;
                }
                this.onDoutState(data[2], data[3], data[4]);
                break;
            case this.PWMoutStateID:
                if (typeof this.onPWMoutState !== 'function') {
                    return;
                }
                this.onPWMoutState(data[2], data[3], data[4]);
                break;
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
    parseSetmodeCommand(din, din_notify, dout, pwm_ratio, ain_range_upper, ain_range_bottom, ain_notify) {
        const HEADER = [this.MessageTypeID, 1];
        const BODY = [
            din,
            din_notify,
            dout,
            pwm_ratio,
            1,
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
