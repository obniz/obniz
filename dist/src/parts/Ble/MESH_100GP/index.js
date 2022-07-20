"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MESH_js_GP_1 = require("../MESH_js/MESH_js_GP");
/** MESH_100GA management class */
class MESH_100GP extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.DigitalPins = this
            ._mesh.DigitalPins;
        this.AnalogInputEventCondition = () => this._mesh.AnalogInputEventCondition;
        this.Pin = this._mesh.Pin;
        this.Mode = () => this._mesh.Mode;
        this.State = () => this._mesh.State;
        this.VCC = () => this._mesh.VCC;
        // event handler
        this.onDigitalInEventNotify = null;
        this.onAnalogInEventNotify = null;
        this.onDigitalInNotify = null;
        this.onAnalogInNotify = null;
        this.onVOutNotify = null;
        this.onDigitalOutNotify = null;
        this.onPwmNotify = null;
        this.staticClass = MESH_100GP;
    }
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this._mesh.battery,
        };
    }
    setMode(din, din_notify, dout, pwm_ratio, vcc, ain_range_upper, ain_range_bottom, ain_notify) {
        const _gp = this._mesh;
        this.writeWOResponse(_gp.parseSetmodeCommand(din, din_notify, dout, pwm_ratio, vcc, ain_range_upper, ain_range_bottom, ain_notify));
    }
    setDin(pin, request_id = 0) {
        const _gp = this._mesh;
        this.writeWOResponse(_gp.parseSetDinCommand(pin, request_id));
    }
    setAin(mode, request_id = 0) {
        const _gp = this._mesh;
        this.writeWOResponse(_gp.parseSetAinCommand(mode, request_id));
    }
    setVout(pin, request_id = 0) {
        const _gp = this._mesh;
        this.writeWOResponse(_gp.parseSetVoutCommand(pin, request_id));
    }
    setDout(pin, request_id = 0) {
        const _gp = this._mesh;
        this.writeWOResponse(_gp.parseSetDoutCommand(pin, request_id));
    }
    setPWMNotify(request_id = 0) {
        const _gp = this._mesh;
        this.writeWOResponse(_gp.parseSetPWMCommand(request_id));
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100GP._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_GP_1.MESH_js_GP();
        const _gp = this._mesh;
        _gp.onDigitalInEventNotify = (pin, state) => {
            if (typeof this.onDigitalInEventNotify !== 'function') {
                return;
            }
            this.onDigitalInEventNotify(pin, state);
        };
        _gp.onAnalogInEventNotify = (pin, type, threshold, level) => {
            if (typeof this.onAnalogInEventNotify !== 'function') {
                return;
            }
            this.onAnalogInEventNotify(pin, type, threshold, level);
        };
        _gp.onDigitalInNotify = (requestId, pin, state) => {
            if (typeof this.onDigitalInNotify !== 'function') {
                return;
            }
            this.onDigitalInNotify(requestId, pin, state);
        };
        _gp.onAnalogInNotify = (requestId, pin, state, mode) => {
            if (typeof this.onAnalogInNotify !== 'function') {
                return;
            }
            this.onAnalogInNotify(requestId, pin, state, mode);
        };
        _gp.onVOutNotify = (requestId, pin, state) => {
            if (typeof this.onVOutNotify !== 'function') {
                return;
            }
            this.onVOutNotify(requestId, pin, state);
        };
        _gp.onDigitalOutNotify = (requestId, pin, state) => {
            if (typeof this.onDigitalOutNotify !== 'function') {
                return;
            }
            this.onDigitalOutNotify(requestId, pin, state);
        };
        _gp.onPwmNotify = (requestId, level) => {
            if (typeof this.onPwmNotify !== 'function') {
                return;
            }
            this.onPwmNotify(requestId, level);
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
}
exports.default = MESH_100GP;
MESH_100GP.PartsName = 'MESH_100GP';
MESH_100GP._LocalName = 'MESH-100GP';
