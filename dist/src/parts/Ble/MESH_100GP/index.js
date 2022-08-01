"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsGp_1 = require("../MESH_js/MeshJsGp");
const MeshJsError_1 = require("../MESH_js/MeshJsError");
/** MESH_100GP management class */
class MESH_100GP extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.DigitalPins = this
            .meshBlock.DigitalPins;
        // Event Handler
        this.onDigitalInputEvent = null;
        this.onAnalogInputEvent = null;
        this.onDigitalInput = null;
        this.onAnalogInput = null;
        this.onVOutput = null;
        this.onDigitalOutput = null;
        this.onPwm = null;
        this.staticClass = MESH_100GP;
        this.pin_ = -1;
        this.state_ = -1;
        this.pwm_ = -1;
    }
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
            battery: this.meshBlock.battery,
        };
    }
    async getDigitalInputDataWait(pin) {
        this.checkConnected();
        const _requestId = this.requestId.next();
        this.setDin(pin, _requestId);
        await this.getSensorDataWait(_requestId);
        return this.state_;
    }
    async getPwmDataWait() {
        this.checkConnected();
        const _requestId = this.requestId.next();
        this.setPwm(_requestId);
        await this.getSensorDataWait(_requestId);
        return this.pwm_;
    }
    /**
     * setMode
     *
     * @param digitalIn {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInNotify {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalOut {p1:boolean, p2:boolean, p3:boolean}
     * @param pwmRatio 0 ~ 255
     * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
     * @param analogInRangeUpper 0.00 ~ 3.00[V]
     * @param analogInRangeBottom 0.00 ~ 3.00[V]
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
    setPwm(opt_requestId = 0) {
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
        gpioBlock.onDigitalInputEvent = (pin, state) => {
            if (typeof this.onDigitalInputEvent !== 'function') {
                return;
            }
            this.onDigitalInputEvent(pin, state);
        };
        gpioBlock.onAnalogInputEvent = (level) => {
            if (typeof this.onAnalogInputEvent !== 'function') {
                return;
            }
            this.onAnalogInputEvent(level);
        };
        gpioBlock.onDigitalInput = (requestId, pin, state) => {
            if (typeof this.onDigitalInput !== 'function') {
                return;
            }
            if (this.requestId.isDefaultId(requestId)) {
                // Emit Event
                this.onDigitalInput(pin, state);
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.pin_ = pin;
            this.state_ = state;
        };
        gpioBlock.onAnalogInput = (requestId, state, mode) => {
            if (typeof this.onAnalogInput !== 'function') {
                return;
            }
            this.onAnalogInput(requestId, state, mode);
        };
        gpioBlock.onVOutput = (requestId, state) => {
            if (typeof this.onVOutput !== 'function') {
                return;
            }
            this.onVOutput(requestId, state);
        };
        gpioBlock.onDigitalOutput = (requestId, pin, state) => {
            if (typeof this.onDigitalOutput !== 'function') {
                return;
            }
            this.onDigitalOutput(requestId, pin, state);
        };
        gpioBlock.onPwm = (requestId, level) => {
            if (typeof this.onPwm !== 'function') {
                return;
            }
            if (this.requestId.isDefaultId(requestId)) {
                // Emit Event
                this.onPwm(level);
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.pwm_ = level;
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    async getSensorDataWait(requestId) {
        const _TIMEOUT_MSEC = 2500;
        let _isTimeout = false;
        const start = Date.now();
        const _timeoutId = setTimeout(() => {
            _isTimeout = true;
        }, _TIMEOUT_MSEC);
        const INTERVAL_TIME = 50;
        const _result = await new Promise((resolve) => {
            const _intervalId = setInterval(() => {
                if (!this.requestId.isReceived(requestId)) {
                    if (_isTimeout) {
                        clearInterval(_intervalId);
                        resolve(null);
                    }
                    return;
                }
                clearTimeout(_timeoutId);
                clearInterval(_intervalId);
                console.log(Date.now() - start + ' [ms]');
                resolve(true);
            }, INTERVAL_TIME);
        });
        // if (this.notifyMode_ !== MESH_100MD.NotifyMode.ONCE) {
        //   // Continus previous mode
        //   this.setMode(this.notifyMode_, this.detectionTime_, this.responseTime_);
        // }
        if (_result == null) {
            throw new MeshJsError_1.MeshJsTimeOutError(MESH_100GP.PartsName);
        }
        return _result;
    }
}
exports.default = MESH_100GP;
MESH_100GP.PartsName = 'MESH_100GP';
MESH_100GP.PREFIX = 'MESH-100GP';
MESH_100GP.AnalogInEventCondition = MeshJsGp_1.MeshJsGp.AnalogInEventCondition;
MESH_100GP.NotifyMode = MeshJsGp_1.MeshJsGp.NotifyMode;
MESH_100GP.Pin = MeshJsGp_1.MeshJsGp.Pin;
MESH_100GP.State = MeshJsGp_1.MeshJsGp.State;
MESH_100GP.Vcc = MeshJsGp_1.MeshJsGp.Vcc;
MESH_100GP.VccState = MeshJsGp_1.MeshJsGp.VccState;
