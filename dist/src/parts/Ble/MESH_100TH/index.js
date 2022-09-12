"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const TempHumid_1 = require("../utils/abstracts/MESHjs/block/TempHumid");
const Error_1 = require("../utils/abstracts/MESHjs/util/Error");
/** MESH_100TH management class */
class MESH_100TH extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.staticClass = MESH_100TH;
        this.retTemperature_ = -1;
        this.retHumidity_ = -1;
        this.temperatureUpper_ = 50;
        this.temperatureLower_ = -10;
        this.humidityUpper_ = 100;
        this.humidityLower_ = 0;
        this.temperatureCondition_ = MESH_100TH.EmitCondition.ABOVE_UPPER_OR_BELOW_LOWER;
        this.humidityCondition_ = MESH_100TH.EmitCondition.ABOVE_UPPER_OR_BELOW_LOWER;
        this.notifyMode_ = -1;
    }
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral, opt_serialnumber = '') {
        return TempHumid_1.TempHumid.isMESHblock(peripheral.localName, opt_serialnumber);
    }
    async getDataWait() {
        this.checkConnected();
        const _th = this.meshBlock;
        return Object.assign({ name: this.peripheral.localName, address: this.peripheral.address }, (await this.getSensorDataWait()));
    }
    /**
     * getSensorDataWait
     *
     * @returns
     */
    async getSensorDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
        this.checkConnected();
        const _requestId = this.requestId.next();
        this.setMode_(0, 0, 0, 0, 0, 0, MESH_100TH.NotifyMode.ONCE, _requestId);
        let _isTimeout = false;
        const _timeoutId = setTimeout(() => {
            _isTimeout = true;
        }, opt_timeoutMsec);
        const INTERVAL_TIME = 50;
        const _result = await new Promise((resolve) => {
            const _intervalId = setInterval(() => {
                if (!this.requestId.isReceived(_requestId)) {
                    if (_isTimeout) {
                        clearInterval(_intervalId);
                        resolve(null);
                    }
                    return;
                }
                clearTimeout(_timeoutId);
                clearInterval(_intervalId);
                resolve({
                    temperature: this.retTemperature_,
                    humidity: this.retHumidity_,
                });
            }, INTERVAL_TIME);
        });
        if (MESH_100TH.NotifyMode.ALWAYS < this.notifyMode_) {
            // Continus previous mode
            this.setMode(this.temperatureUpper_, this.temperatureLower_, this.humidityUpper_, this.humidityLower_, this.temperatureCondition_, this.humidityCondition_, this.notifyMode_);
        }
        if (_result == null) {
            throw new Error_1.MESHJsTimeOutError(this.peripheral.localName);
        }
        return _result;
    }
    /**
     * setMode
     *
     * @param temperatureUpper
     * @param temperatureLower
     * @param humidityUpper
     * @param humidityLower
     * @param temperatureCondition
     * @param humidityCondition
     * @param notifyMode
     */
    setMode(temperatureUpper, temperatureLower, humidityUpper, humidityLower, temperatureCondition, humidityCondition, notifyMode) {
        this.setMode_(temperatureUpper, temperatureLower, humidityUpper, humidityLower, temperatureCondition, humidityCondition, notifyMode, this.requestId.defaultId());
        this.temperatureUpper_ = temperatureUpper;
        this.temperatureLower_ = temperatureLower;
        this.humidityUpper_ = humidityUpper;
        this.humidityLower_ = humidityLower;
        this.temperatureCondition_ = temperatureCondition;
        this.humidityCondition_ = humidityCondition;
        this.notifyMode_ = notifyMode;
    }
    prepareConnect() {
        this.meshBlock = new TempHumid_1.TempHumid();
        const temperatureAndHumidityBlock = this.meshBlock;
        // set Event Handler
        temperatureAndHumidityBlock.onSensorEvent = (temperature, humidity, requestId) => this.setHandler_(temperature, humidity, requestId);
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    setMode_(temperatureUpper, temperatureLower, humidityUpper, humidityLower, temperatureCondition, humidityCondition, notifyMode, requestId) {
        const temperatureAndHumidityBlock = this.meshBlock;
        const command = temperatureAndHumidityBlock.createSetmodeCommand(temperatureUpper, temperatureLower, humidityUpper, humidityLower, temperatureCondition, humidityCondition, notifyMode, requestId);
        this.writeWOResponse(command);
    }
    setHandler_(temperature, humidity, requestId) {
        // Update Inner Values
        this.requestId.received(requestId);
        this.retTemperature_ = temperature;
        this.retHumidity_ = humidity;
        // Emit Event
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        if (!this.requestId.isDefaultId(requestId)) {
            return;
        }
        this.onSensorEvent(temperature, humidity);
    }
}
exports.default = MESH_100TH;
MESH_100TH.PartsName = 'MESH_100TH';
MESH_100TH.LocalName = /^MESH-100TH/;
MESH_100TH.NotifyMode = TempHumid_1.TempHumid.NotifyMode;
MESH_100TH.EmitCondition = TempHumid_1.TempHumid.EmitCondition;
