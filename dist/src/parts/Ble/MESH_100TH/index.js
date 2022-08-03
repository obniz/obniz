"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const TempHumid_1 = require("../MESH_js/block/TempHumid");
const MeshJsError_1 = require("../MESH_js/MeshJsError");
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
        this.temperatureBottom_ = -10;
        this.humidityUpper_ = 100;
        this.humidityBottom_ = 0;
        this.temperatureCondition_ = MESH_100TH.EmitCondition.ABOVE_UPPER_AND_BELOW_BOTTOM;
        this.humidityCondision_ = MESH_100TH.EmitCondition.ABOVE_UPPER_AND_BELOW_BOTTOM;
        this.notifyMode_ = -1;
    }
    async getDataWait() {
        this.checkConnected();
        const _th = this.meshBlock;
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    async getSensorDataWait() {
        this.checkConnected();
        const _requestId = this.requestId.next();
        this.setMode_(0, 0, 0, 0, 0, 0, MESH_100TH.NotifyMode.ONCE, _requestId);
        const _TIMEOUT_MSEC = 2000;
        let _isTimeout = false;
        const _timeoutId = setTimeout(() => {
            _isTimeout = true;
        }, _TIMEOUT_MSEC);
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
        if (this.notifyMode_ !== MESH_100TH.NotifyMode.ONCE) {
            // Continus previous mode
            this.setMode(this.temperatureUpper_, this.temperatureBottom_, this.humidityUpper_, this.humidityBottom_, this.temperatureCondition_, this.humidityCondision_, this.notifyMode_);
        }
        if (_result == null) {
            throw new MeshJsError_1.MeshJsTimeOutError(this.peripheral.localName);
        }
        return _result;
    }
    setMode(temperatureUpper, temperatureBottom, humidityUpper, humidityBottom, temperatureCondition, humidityCondision, notifyMode) {
        this.setMode_(temperatureUpper, temperatureBottom, humidityUpper, humidityBottom, temperatureCondition, humidityCondision, notifyMode, this.requestId.defaultId());
        this.temperatureUpper_ = temperatureUpper;
        this.temperatureBottom_ = temperatureBottom;
        this.humidityUpper_ = humidityUpper;
        this.humidityBottom_ = humidityBottom;
        this.temperatureCondition_ = temperatureCondition;
        this.humidityCondision_ = humidityCondision;
        this.notifyMode_ = notifyMode;
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100TH.PREFIX) !== -1;
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
    setMode_(temperatureUpper, temperatureBottom, humidityUpper, humidityBottom, temperatureCondition, humidityCondision, notifyMode, requestId) {
        const temperatureAndHumidityBlock = this.meshBlock;
        const command = temperatureAndHumidityBlock.parseSetmodeCommand(temperatureUpper, temperatureBottom, humidityUpper, humidityBottom, temperatureCondition, humidityCondision, notifyMode, requestId);
        this.writeWOResponse(command);
    }
    setHandler_(temperature, humidity, requestId) {
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        if (this.requestId.isDefaultId(requestId)) {
            // Emit Event
            this.onSensorEvent(temperature, humidity);
            return;
        }
        // Update Inner Values
        this.requestId.received(requestId);
        this.retTemperature_ = temperature;
        this.retHumidity_ = humidity;
    }
}
exports.default = MESH_100TH;
MESH_100TH.PartsName = 'MESH_100TH';
MESH_100TH.PREFIX = 'MESH-100TH';
MESH_100TH.NotifyMode = TempHumid_1.TempHumid.NotifyMode;
MESH_100TH.EmitCondition = TempHumid_1.TempHumid.EmitCondition;
