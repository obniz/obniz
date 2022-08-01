"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsTh_1 = require("../MESH_js/MeshJsTh");
const MeshJsError_1 = require("../MESH_js/MeshJsError");
/** MESH_100TH management class */
class MESH_100TH extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.staticClass = MESH_100TH;
        this.temperature_ = -1;
        this.humidity_ = -1;
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
                resolve({ temperature: this.temperature_, humidity: this.humidity_ });
            }, INTERVAL_TIME);
        });
        // if (this.notifyMode_ !== MESH_100TH.NotifyMode.ONCE) {
        //   // Continus previous mode
        //   this.setMode(this.notifyMode_, this.detectionTime_, this.responseTime_);
        // }
        if (_result == null) {
            throw new MeshJsError_1.MeshJsTimeOutError(MESH_100TH.PartsName);
        }
        return _result;
    }
    setMode(temperatureUpper, temperatureBottom, humidityUpper, humidityBottom, temperatureCondition, humidityCondision, notifyMode) {
        this.setMode_(temperatureUpper, temperatureBottom, humidityUpper, humidityBottom, temperatureCondition, humidityCondision, notifyMode, this.requestId.defaultId());
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100TH.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsTh_1.MeshJsTh();
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
        this.temperature_ = temperature;
        this.humidity_ = humidity;
    }
}
exports.default = MESH_100TH;
MESH_100TH.PartsName = 'MESH_100TH';
MESH_100TH.PREFIX = 'MESH-100TH';
MESH_100TH.NotifyMode = MeshJsTh_1.MeshJsTh.NotifyMode;
MESH_100TH.EmitCondition = MeshJsTh_1.MeshJsTh.EmitCondition;
