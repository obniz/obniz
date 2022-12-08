"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const GPIO_1 = require("../utils/abstracts/MESHjs/block/GPIO");
const Error_1 = require("../utils/abstracts/MESHjs/util/Error");
/** MESH_100GP management class */
class MESH_100GP extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        this.DigitalPins = this.meshBlock
            .DigitalPins;
        // Event Handler
        this.onDigitalInputEvent = null;
        this.onAnalogInputEvent = null;
        this.staticClass = MESH_100GP;
        this.digitalInputLow2High_ = { p1: false, p2: false, p3: false };
        this.digitalInputHigh2Low_ = { p1: false, p2: false, p3: false };
        this.digitalOutput_ = { p1: false, p2: false, p3: false };
        this.pwmRatio_ = 0;
        this.vcc_ = MESH_100GP.Vcc.OFF;
        this.analogInputRangeUpper_ = 0;
        this.analogInputRangeLower_ = 0;
        this.analogInputCondition_ = MESH_100GP.AnalogInputEventCondition.NOT_NOTIFY;
        this.retDigitalInState_ = -1;
        this.retPwm_ = -1;
        this.retVccState_ = -1;
        this.retLevel_ = -1;
        this.retDigitalOutState_ = -1;
    }
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral, opt_serialnumber = '') {
        return GPIO_1.GPIO.isMESHblock(peripheral.localName, opt_serialnumber);
    }
    /**
     * getDataWait
     *
     * @returns
     */
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    /**
     * getDigitalInputDataWait
     *
     * @param pin
     * @returns
     */
    async getDigitalInputDataWait(pin, opt_timeoutMsec = this.TIMEOUT_MSEC) {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.createDigitalInputCommand(pin, _requestId);
        await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
        return this.retDigitalInState_;
    }
    /**
     * getAnalogInputDataWait
     *
     * @returns
     */
    async getAnalogInputDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.createAnalogInputCommand(MESH_100GP.AnalogInputNotifyMode.ONCE, _requestId);
        await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
        return this.retLevel_;
    }
    /**
     * getVOutputDataWait
     *
     * @returns
     */
    async getVOutputDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.createVOutputCommand(_requestId);
        await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
        return this.retVccState_;
    }
    /**
     * getDigitalOutputDataWait
     *
     * @param pin
     * @returns
     */
    async getDigitalOutputDataWait(pin, opt_timeoutMsec = this.TIMEOUT_MSEC) {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.createDigitalOutputCommand(pin, _requestId);
        await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
        return this.retDigitalOutState_;
    }
    /**
     * getPwmDataWait
     *
     * @returns
     */
    async getPwmDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
        const _requestId = this.requestId.next();
        const _gpioBlock = this.meshBlock;
        const _command = _gpioBlock.createPwmCommand(_requestId);
        await this.getSensorDataWait(_requestId, _command, opt_timeoutMsec);
        return this.retPwm_;
    }
    /**
     * setMode
     *
     * @param digitalInputLow2High {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalInputHigh2Low {p1:boolean, p2:boolean, p3:boolean}
     * @param digitalOutput {p1:boolean, p2:boolean, p3:boolean}
     * @param pwmRatio 0-255
     * @param vcc Vcc.ON or Vcc.OFF
     * @param analogInputRangeUpper 0-255(0.00-3.00[V])
     * @param analogInputRangeLower 0-255(0.00-3.00[V])
     * @param analogInputCondition AnalogInputEventCondition.NOT_NOTIFY or AnalogInputEventCondition.ABOVE_THRESHOLD or AnalogInputEventCondition.BELOW_THRESHOLD
     */
    setMode(digitalInputLow2High, digitalInputHigh2Low, digitalOutput, pwmRatio, vcc, analogInputRangeUpper, analogInputRangeLower, analogInputCondition) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.createSetmodeCommand(digitalInputLow2High, digitalInputHigh2Low, digitalOutput, pwmRatio, vcc, analogInputRangeUpper, analogInputRangeLower, analogInputCondition);
        this.writeWOResponse(command);
        this.digitalInputLow2High_ = digitalInputLow2High;
        this.digitalInputHigh2Low_ = digitalInputHigh2Low;
        this.digitalOutput_ = digitalOutput;
        this.pwmRatio_ = pwmRatio;
        this.vcc_ = vcc;
        this.analogInputRangeUpper_ = analogInputRangeUpper;
        this.analogInputRangeLower_ = analogInputRangeLower;
        this.analogInputCondition_ = analogInputCondition;
    }
    /**
     * setModeDigitalInput
     *
     * @param digitalInputLow2High { p1:boolean, p2:boolean, p3:boolean }
     * @param digitalInputHigh2Low { p1:boolean, p2:boolean, p3:boolean }
     */
    setModeDigitalInput(digitalInputLow2High, digitalInputHigh2Low) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.createSetmodeCommand(digitalInputLow2High, digitalInputHigh2Low, this.digitalOutput_, this.pwmRatio_, this.vcc_, this.analogInputRangeUpper_, this.analogInputRangeLower_, this.analogInputCondition_);
        this.writeWOResponse(command);
        this.digitalInputLow2High_ = digitalInputLow2High;
        this.digitalInputHigh2Low_ = digitalInputHigh2Low;
    }
    /**
     * setModeAnalogInput
     *
     * @param analogInputRangeUpper 0-255(0.00-3.00[V])
     * @param analogInputRangeLower 0-255(0.00-3.00[V])
     * @param analogInputCondition AnalogInputEventCondition.NOT_NOTIFY or AnalogInputEventCondition.ABOVE_THRESHOLD or AnalogInputEventCondition.BELOW_THRESHOLD
     */
    setModeAnalogInput(analogInputRangeUpper, analogInputRangeLower, analogInputCondition) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.createSetmodeCommand(this.digitalInputLow2High_, this.digitalInputHigh2Low_, this.digitalOutput_, this.pwmRatio_, this.vcc_, analogInputRangeUpper, analogInputRangeLower, analogInputCondition);
        this.writeWOResponse(command);
        this.analogInputRangeUpper_ = analogInputRangeUpper;
        this.analogInputRangeLower_ = analogInputRangeLower;
        this.analogInputCondition_ = analogInputCondition;
    }
    /**
     * setDigitalOutput
     *
     * @param digitalOutput { p1:boolean, p2:boolean, p3:boolean }
     */
    setDigitalOutput(digitalOutput) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.createSetmodeCommand(this.digitalInputLow2High_, this.digitalInputHigh2Low_, digitalOutput, this.pwmRatio_, this.vcc_, this.analogInputRangeUpper_, this.analogInputRangeLower_, this.analogInputCondition_);
        this.writeWOResponse(command);
        this.digitalOutput_ = digitalOutput;
    }
    /**
     * setPwmOutput
     *
     * @param pwmRatio 0-255
     */
    setPwmOutput(pwmRatio) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.createSetmodeCommand(this.digitalInputLow2High_, this.digitalInputHigh2Low_, this.digitalOutput_, pwmRatio, this.vcc_, this.analogInputRangeUpper_, this.analogInputRangeLower_, this.analogInputCondition_);
        this.writeWOResponse(command);
        this.pwmRatio_ = pwmRatio;
    }
    /**
     * setVOutput
     *
     * @param vcc Vcc.ON or Vcc.OFF
     */
    setVOutput(vcc) {
        const gpioBlock = this.meshBlock;
        const command = gpioBlock.createSetmodeCommand(this.digitalInputLow2High_, this.digitalInputHigh2Low_, this.digitalOutput_, this.pwmRatio_, vcc, this.analogInputRangeUpper_, this.analogInputRangeLower_, this.analogInputCondition_);
        this.writeWOResponse(command);
        this.vcc_ = vcc;
    }
    prepareConnect() {
        this.meshBlock = new GPIO_1.GPIO();
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
    async getSensorDataWait(requestId, command, timeoutMsec) {
        this.checkConnected();
        this.writeWOResponse(command);
        let _isTimeout = false;
        const _timeoutId = setTimeout(() => {
            _isTimeout = true;
        }, timeoutMsec);
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
            throw new Error_1.MESHJsTimeOutError(this.peripheral.localName);
        }
        return _result;
    }
}
exports.default = MESH_100GP;
MESH_100GP.PartsName = 'MESH_100GP';
MESH_100GP.LocalName = /^MESH-100GP/;
MESH_100GP.AnalogInputEventCondition = GPIO_1.GPIO.AnalogInputEventCondition;
MESH_100GP.AnalogInputNotifyMode = GPIO_1.GPIO.AnalogInputNotifyMode;
MESH_100GP.Pin = GPIO_1.GPIO.Pin;
MESH_100GP.State = GPIO_1.GPIO.State;
MESH_100GP.DigitalInputState = GPIO_1.GPIO.DigitalInputState;
MESH_100GP.Vcc = GPIO_1.GPIO.Vcc;
MESH_100GP.VccState = GPIO_1.GPIO.VccState;
