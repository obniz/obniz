"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const Brightness_1 = require("../utils/abstracts/MESHjs/block/Brightness");
const Error_1 = require("../utils/abstracts/MESHjs/util/Error");
/** MESH_100PA management class */
class MESH_100PA extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.staticClass = MESH_100PA;
        this.proximity_ = -1;
        this.brightness_ = -1;
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
     * getSensorDataWait
     *
     * @returns
     */
    async getSensorDataWait() {
        this.checkConnected();
        const _requestId = this.requestId.next();
        this.setMode_(MESH_100PA.NotifyMode.ONCE, _requestId);
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
                resolve({ proximity: this.proximity_, brightness: this.brightness_ });
            }, INTERVAL_TIME);
        });
        if (_result == null) {
            throw new Error_1.MESHJsTimeOutError(this.peripheral.localName);
        }
        return _result;
    }
    /**
     * setMode
     *
     * @param notifyMode
     */
    setMode(notifyMode) {
        this.setMode_(notifyMode, this.requestId.defaultId());
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100PA.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new Brightness_1.Brightness();
        // set Event Handler
        const brightnessBlock = this.meshBlock;
        brightnessBlock.onSensorEvent = (proximity, brightness, requestId) => this.setHandler_(proximity, brightness, requestId);
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    setMode_(notifyMode, requestId) {
        const brightnessBlock = this.meshBlock;
        const command = brightnessBlock.parseSetmodeCommand(notifyMode, requestId);
        this.writeWOResponse(command);
    }
    setHandler_(proximity, brightness, requestId) {
        // Update Inner Values
        this.requestId.received(requestId);
        this.proximity_ = proximity;
        this.brightness_ = brightness;
        // Emit Event
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        if (!this.requestId.isDefaultId(requestId)) {
            return;
        }
        this.onSensorEvent(proximity, brightness);
    }
}
exports.default = MESH_100PA;
MESH_100PA.PartsName = 'MESH_100PA';
MESH_100PA.PREFIX = 'MESH-100PA';
MESH_100PA.NotifyMode = Brightness_1.Brightness.NotifyMode;
