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
            .meshBlock.DigitalPins;
        // Event Handler
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
            battery: this.meshBlock.battery,
        };
    }
    /**
     * setMode
     *
     * @param digitalIn {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInNotify {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalOut {p1:boolean, p2:boolean, p3:boolean}
     * @param pwmRatio 0 ~ 255
     * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
     * @param analogInRangeUpper 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param analogInRangeBottom 0.00 ~ 3.00[V], resolution 0.05[V]
     * @param analogInNotify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     */
    setMode(digitalIn, digitalInNotify, digitalOut, pwmRatio, vcc, analogInRangeUpper, analogInRangeBottom, analogInNotify) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetmodeCommand(digitalIn, digitalInNotify, digitalOut, pwmRatio, vcc, analogInRangeUpper, analogInRangeBottom, analogInNotify);
        this.writeWOResponse(command);
    }
    setDin(pin, opt_requestId = 0) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetDinCommand(pin, opt_requestId);
        this.writeWOResponse(command);
    }
    setAin(mode, opt_requestId = 0) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetAinCommand(mode, opt_requestId);
        this.writeWOResponse(command);
    }
    setVout(pin, opt_requestId = 0) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetVoutCommand(pin, opt_requestId);
        this.writeWOResponse(command);
    }
    setDout(pin, opt_requestId = 0) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetDoutCommand(pin, opt_requestId);
        this.writeWOResponse(command);
    }
    setPWMNotify(opt_requestId = 0) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetPWMCommand(opt_requestId);
        this.writeWOResponse(command);
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100GP.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsGp_1.MeshJsGp();
        const gpioBlock = this.meshBlock;
        gpioBlock.onDigitalInEventNotify = (pin, state) => {
            if (typeof this.onDigitalInEventNotify !== 'function') {
                return;
            }
            this.onDigitalInEventNotify(pin, state);
        };
        gpioBlock.onAnalogInEventNotify = (level) => {
            if (typeof this.onAnalogInEventNotify !== 'function') {
                return;
            }
            this.onAnalogInEventNotify(level);
        };
        gpioBlock.onDigitalInNotify = (requestId, pin, state) => {
            if (typeof this.onDigitalInNotify !== 'function') {
                return;
            }
            this.onDigitalInNotify(requestId, pin, state);
        };
        gpioBlock.onAnalogInNotify = (requestId, state, mode) => {
            if (typeof this.onAnalogInNotify !== 'function') {
                return;
            }
            this.onAnalogInNotify(requestId, state, mode);
        };
        gpioBlock.onVOutNotify = (requestId, state) => {
            if (typeof this.onVOutNotify !== 'function') {
                return;
            }
            this.onVOutNotify(requestId, state);
        };
        gpioBlock.onDigitalOutNotify = (requestId, pin, state) => {
            if (typeof this.onDigitalOutNotify !== 'function') {
                return;
            }
            this.onDigitalOutNotify(requestId, pin, state);
        };
        gpioBlock.onPwmNotify = (requestId, level) => {
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
MESH_100GP.PREFIX = 'MESH-100GP';
MESH_100GP.AnalogInputEventCondition = MeshJsGp_1.MeshJsGp.ANALOG_IN_EVENT_CONDITION;
MESH_100GP.MODE = MeshJsGp_1.MeshJsGp.MODE;
MESH_100GP.PIN = MeshJsGp_1.MeshJsGp.PIN;
MESH_100GP.STATE = MeshJsGp_1.MeshJsGp.STATE;
MESH_100GP.VCC = MeshJsGp_1.MeshJsGp.VCC;
