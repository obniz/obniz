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
        this.VCC = this._mesh.VCC;
        this.AnalogInputEvent = this
            ._mesh.AnalogInputEvent;
        this.Pin = this._mesh.Pin;
        this.Mode = this._mesh.Mode;
        this.State = this._mesh.State;
        // event handler
        this.onDinEvent = null;
        this.onAinEvent = null;
        this.onDinState = null;
        this.onAinState = null;
        this.onVoutState = null;
        this.onDoutState = null;
        this.onPWMoutState = null;
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
    setPWM(pin, request_id = 0) {
        const _gp = this._mesh;
        this.writeWOResponse(_gp.parseSetPWMCommand(pin, request_id));
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100GP._LocalName) !== -1;
    }
    prepareConnect() {
        this._mesh = new MESH_js_GP_1.MESH_js_GP();
        const _gp = this._mesh;
        _gp.onDinEvent = (pin, state) => {
            if (typeof this.onDinEvent !== 'function') {
                return;
            }
            this.onDinEvent(pin, state);
        };
        _gp.onAinEvent = (pin, type, threshold, level) => {
            if (typeof this.onAinEvent !== 'function') {
                return;
            }
            this.onAinEvent(pin, type, threshold, level);
        };
        _gp.onDinState = (requestId, pin, state) => {
            if (typeof this.onDinState !== 'function') {
                return;
            }
            this.onDinState(requestId, pin, state);
        };
        _gp.onAinState = (requestId, pin, state, mode) => {
            if (typeof this.onAinState !== 'function') {
                return;
            }
            this.onAinState(requestId, pin, state, mode);
        };
        _gp.onVoutState = (requestId, pin, state) => {
            if (typeof this.onVoutState !== 'function') {
                return;
            }
            this.onVoutState(requestId, pin, state);
        };
        _gp.onDoutState = (requestId, pin, state) => {
            if (typeof this.onDoutState !== 'function') {
                return;
            }
            this.onDoutState(requestId, pin, state);
        };
        _gp.onPWMoutState = (requestId, pin, level) => {
            if (typeof this.onPWMoutState !== 'function') {
                return;
            }
            this.onPWMoutState(requestId, pin, level);
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
