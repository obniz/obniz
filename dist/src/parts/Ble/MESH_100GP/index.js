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
        this.staticClass = MESH_100GP;
        this.digitalInputLow2High_ = { p1: false, p2: false, p3: false };
        this.digitalInputHigh2Low_ = { p1: false, p2: false, p3: false };
        this.digitalOutput_ = { p1: false, p2: false, p3: false };
        this.pwmRatio_ = 0;
        this.vcc_ = MESH_100GP.Vcc.AUTO;
        this.analogInputRangeUpper_ = 0;
        this.analogInputRangeBottom_ = 0;
        this.analogInputCondition_ = MESH_100GP.AnalogInEventCondition.NOT_NOTIFY;
        this.retDigitalInState_ = -1;
        this.retPwm_ = -1;
        this.retVccState_ = -1;
        this.retLevel_ = -1;
        this.retDigitalOutState_ = -1;
    }
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    /**
     *
     * @param pin
     * @returns
     */
    async getDigitalInputDataWait(pin) {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.parseSetDinCommand(pin, _requestId);
        await this.getSensorDataWait(_requestId, _command);
        return this.retDigitalInState_;
    }
    /**
     *
     * @returns
     */
    async getAnalogInputDataWait() {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.parseSetAinCommand(MESH_100GP.AnalogInputNotifyMode.ONCE, _requestId);
        await this.getSensorDataWait(_requestId, _command);
        return this.retLevel_;
    }
    /**
     *
     * @returns
     */
    async getVOutputDataWait() {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.parseSetVOutputCommand(_requestId);
        await this.getSensorDataWait(_requestId, _command);
        return this.retVccState_;
    }
    /**
     *
     * @param pin
     * @returns
     */
    async getDigitalOutputDataWait(pin) {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.parseSetDoutCommand(pin, _requestId);
        await this.getSensorDataWait(_requestId, _command);
        return this.retDigitalOutState_;
    }
    /**
     *
     * @returns
     */
    async getPwmDataWait() {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.parseSetPWMCommand(_requestId);
        await this.getSensorDataWait(_requestId, _command);
        return this.retPwm_;
    }
    /**
     * setMode
     *
     * @param digitalInputLow2High {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInputHigh2Low {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalOutput {p1:boolean, p2:boolean, p3:boolean}
     * @param pwmRatio 0 ~ 255
     * @param vcc Vcc.AUTO or Vcc.ON or Vcc.OFF
     * @param analogInputRangeUpper 0 ~ 255(0.00 ~ 3.00[V])
     * @param analogInputRangeBottom 0 ~ 255(0.00 ~ 3.00[V])
     * @param analogInputCondition AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     */
    setMode(digitalInputLow2High, digitalInputHigh2Low, digitalOutput, pwmRatio, vcc, analogInputRangeUpper, analogInputRangeBottom, analogInputCondition) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetmodeCommand(digitalInputLow2High, digitalInputHigh2Low, digitalOutput, pwmRatio, vcc, analogInputRangeUpper, analogInputRangeBottom, analogInputCondition);
        this.writeWOResponse(command);
        this.digitalInputLow2High_ = digitalInputLow2High;
        this.digitalInputHigh2Low_ = digitalInputHigh2Low;
        this.digitalOutput_ = digitalOutput;
        this.pwmRatio_ = pwmRatio;
        this.vcc_ = vcc;
        this.analogInputRangeUpper_ = analogInputRangeUpper;
        this.analogInputRangeBottom_ = analogInputRangeBottom;
        this.analogInputCondition_ = analogInputCondition;
    }
    /**
     * setModeDigitalInput
     *
     * @param digitalInputLow2High {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInputHigh2Low {p1:boolean, p2:boolean, p3:boolean}
     */
    setModeDigitalInput(digitalInputLow2High, digitalInputHigh2Low) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetmodeCommand(digitalInputLow2High, digitalInputHigh2Low, this.digitalOutput_, this.pwmRatio_, this.vcc_, this.analogInputRangeUpper_, this.analogInputRangeBottom_, this.analogInputCondition_);
        this.writeWOResponse(command);
        this.digitalInputLow2High_ = digitalInputLow2High;
        this.digitalInputHigh2Low_ = digitalInputHigh2Low;
    }
    /**
     * setModeAnalogInput
     *
     * @param analogInputRangeUpper 0 ~ 255(0.00 ~ 3.00[V])
     * @param analogInputRangeBottom 0 ~ 255(0.00 ~ 3.00[V])
     * @param analogInputCondition AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
     */
    setModeAnalogInput(analogInputRangeUpper, analogInputRangeBottom, analogInputCondition) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetmodeCommand(this.digitalInputLow2High_, this.digitalInputHigh2Low_, this.digitalOutput_, this.pwmRatio_, this.vcc_, analogInputRangeUpper, analogInputRangeBottom, analogInputCondition);
        this.writeWOResponse(command);
        this.analogInputRangeUpper_ = analogInputRangeUpper;
        this.analogInputRangeBottom_ = analogInputRangeBottom;
        this.analogInputCondition_ = analogInputCondition;
    }
    /**
     * setDigitalOutput
     *
     * @param digitalOutput {p1:boolean, p2:boolean, p3:boolean}
     */
    setDigitalOutput(digitalOutput) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetmodeCommand(this.digitalInputLow2High_, this.digitalInputHigh2Low_, digitalOutput, this.pwmRatio_, this.vcc_, this.analogInputRangeUpper_, this.analogInputRangeBottom_, this.analogInputCondition_);
        this.writeWOResponse(command);
        this.digitalOutput_ = digitalOutput;
    }
    /**
     * setPwmOutput
     *
     * @param pwmRatio 0 ~ 255
     */
    setPwmOutput(pwmRatio) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetmodeCommand(this.digitalInputLow2High_, this.digitalInputHigh2Low_, this.digitalOutput_, pwmRatio, this.vcc_, this.analogInputRangeUpper_, this.analogInputRangeBottom_, this.analogInputCondition_);
        this.writeWOResponse(command);
        this.pwmRatio_ = pwmRatio;
    }
    /**
     * setVOutput
     *
     * @param vcc Vcc.AUTO or Vcc.ON or Vcc.OFF
     */
    setVOutput(vcc) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.parseSetmodeCommand(this.digitalInputLow2High_, this.digitalInputHigh2Low_, this.digitalOutput_, this.pwmRatio_, vcc, this.analogInputRangeUpper_, this.analogInputRangeBottom_, this.analogInputCondition_);
        this.writeWOResponse(command);
        this.vcc_ = vcc;
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
            if (this.requestId.isDefaultId(requestId)) {
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.retDigitalInState_ = state;
            void pin;
        };
        gpioBlock.onAnalogInput = (requestId, level, analogInputNotifyMode) => {
            if (this.requestId.isDefaultId(requestId)) {
                return;
            }
            if (analogInputNotifyMode !== MESH_100GP.AnalogInputNotifyMode.ONCE) {
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.retLevel_ = level;
        };
        gpioBlock.onVOutput = (requestId, vccState) => {
            if (this.requestId.isDefaultId(requestId)) {
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.retVccState_ = vccState;
        };
        gpioBlock.onDigitalOutput = (requestId, pin, state) => {
            if (this.requestId.isDefaultId(requestId)) {
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.retDigitalOutState_ = state;
            void pin;
        };
        gpioBlock.onPwm = (requestId, level) => {
            if (this.requestId.isDefaultId(requestId)) {
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.retPwm_ = level;
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    async getSensorDataWait(requestId, command) {
        this.checkConnected();
        this.writeWOResponse(command);
        const _TIMEOUT_MSEC = 2500;
        let _isTimeout = false;
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
                resolve(true);
            }, INTERVAL_TIME);
        });
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
MESH_100GP.AnalogInputNotifyMode = MeshJsGp_1.MeshJsGp.AnalogInputNotifyMode;
MESH_100GP.Pin = MeshJsGp_1.MeshJsGp.Pin;
MESH_100GP.State = MeshJsGp_1.MeshJsGp.State;
MESH_100GP.DigitalInputState = MeshJsGp_1.MeshJsGp.DigitalInputState;
MESH_100GP.Vcc = MeshJsGp_1.MeshJsGp.Vcc;
MESH_100GP.VccState = MeshJsGp_1.MeshJsGp.VccState;
