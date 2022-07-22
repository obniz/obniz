"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsGp_1 = require("../MESH_js/MeshJsGp");
/** MESH_100GA management class */
class MESH_100GP extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.DigitalPins = this
            ._mesh.DigitalPins;
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
    /**
     * setMode
     *
     * @param din {p1:boolean, p2:boolean, p3:boolean}
     * @param din_notify {p1:boolean, p2:boolean, p3:boolean}
     * @param dout {p1:boolean, p2:boolean, p3:boolean}
     * @param pwm_ratio 0 ~ 255
     * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
     * @param ain_range_upper 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param ain_range_bottom 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param ain_notify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     */
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
        this._mesh = new MeshJsGp_1.MeshJsGp();
        const _gp = this._mesh;
        _gp.onDigitalInEventNotify = (pin, state) => {
            if (typeof this.onDigitalInEventNotify !== 'function') {
                return;
            }
            this.onDigitalInEventNotify(pin, state);
        };
        _gp.onAnalogInEventNotify = (level) => {
            if (typeof this.onAnalogInEventNotify !== 'function') {
                return;
            }
            this.onAnalogInEventNotify(level);
        };
        _gp.onDigitalInNotify = (requestId, pin, state) => {
            if (typeof this.onDigitalInNotify !== 'function') {
                return;
            }
            this.onDigitalInNotify(requestId, pin, state);
        };
        _gp.onAnalogInNotify = (requestId, state, mode) => {
            if (typeof this.onAnalogInNotify !== 'function') {
                return;
            }
            this.onAnalogInNotify(requestId, state, mode);
        };
        _gp.onVOutNotify = (requestId, state) => {
            if (typeof this.onVOutNotify !== 'function') {
                return;
            }
            this.onVOutNotify(requestId, state);
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
MESH_100GP.AnalogInputEventCondition = MeshJsGp_1.MeshJsGp.AnalogInputEventCondition;
MESH_100GP.Mode = MeshJsGp_1.MeshJsGp.Mode;
MESH_100GP.Pin = MeshJsGp_1.MeshJsGp.Pin;
MESH_100GP.State = MeshJsGp_1.MeshJsGp.State;
MESH_100GP.VCC = MeshJsGp_1.MeshJsGp.VCC;
