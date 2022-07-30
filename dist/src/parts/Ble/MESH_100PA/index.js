"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsPa_1 = require("../MESH_js/MeshJsPa");
const MeshJsError_1 = require("../MESH_js/MeshJsError");
/** MESH_100PA management class */
class MESH_100PA extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.staticClass = MESH_100PA;
        this.proximity_ = -1;
        this.brightness_ = -1;
        this.proximityRangeUpper_ = 0;
        this.proximityRangeBottom_ = 0;
        this.brightnessRangeUpper_ = 0;
        this.brightnessRangeBottom_ = 0;
    }
    async getDataWait() {
        this.checkConnected();
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    async getSensorDataWait() {
        this.checkConnected();
        // const _start = Date.now();
        const _requestId = this.requestId.next();
        this.setMode_(MESH_100PA.NotifyMode.ONCE, _requestId);
        const _TIMEOUT_MSEC = 2000;
        let _isTimeout = false;
        const _timeoutId = setTimeout(() => {
            _isTimeout = true;
        }, _TIMEOUT_MSEC);
        // let _count = 0;
        const INTERVAL_TIME = 50;
        const _result = await new Promise((resolve) => {
            const _intervalId = setInterval(() => {
                // _count ++;
                if (!this.requestId.isReceived(_requestId)) {
                    if (_isTimeout) {
                        clearInterval(_intervalId);
                        resolve(null);
                    }
                    return;
                }
                clearTimeout(_timeoutId);
                clearInterval(_intervalId);
                // const end = Date.now();
                // console.log(end - _start + ' [ms] ' + _count);
                resolve({ proximity: this.proximity_, brightness: this.brightness_ });
            }, INTERVAL_TIME);
        });
        if (_result == null) {
            throw new MeshJsError_1.MeshJsTimeOutError(MESH_100PA.PartsName);
        }
        return _result;
    }
    setMode(proximityRangeUpper, proximityRangeBottom, brightnessRangeUpper, brightnessRangeBottom, notifyMode) {
        this.setMode_(notifyMode, this.requestId.defaultId(), proximityRangeUpper, proximityRangeBottom, brightnessRangeUpper, brightnessRangeBottom);
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100PA.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsPa_1.MeshJsPa();
        const brightnessBlock = this.meshBlock;
        brightnessBlock.onSensorEvent = (proximity, brightness, requestId) => {
            if (typeof this.onSensorEvent !== 'function') {
                return;
            }
            if (this.requestId.isDefaultId(requestId)) {
                // Emit Event
                this.onSensorEvent(proximity, brightness);
                return;
            }
            // Update Inner Values
            this.requestId.received(requestId);
            this.proximity_ = proximity;
            this.brightness_ = brightness;
        };
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    setMode_(notifyMode, requestId, opt_proximityRangeUpper = this.proximityRangeUpper_, opt_proximityRangeBottom = this.proximityRangeBottom_, opt_brightnessRangeUpper = this.brightnessRangeUpper_, opt_brightnessRangeBottom = this.brightnessRangeBottom_) {
        const brightnessBlock = this.meshBlock;
        const command = brightnessBlock.parseSetmodeCommand(opt_proximityRangeUpper, opt_proximityRangeBottom, opt_brightnessRangeUpper, opt_brightnessRangeBottom, notifyMode, requestId);
        this.writeWOResponse(command);
        // Remember params for using at getSensorDataWait
        this.proximityRangeUpper_ = opt_proximityRangeUpper;
        this.proximityRangeBottom_ = opt_proximityRangeBottom;
        this.brightnessRangeUpper_ = opt_brightnessRangeUpper;
        this.brightnessRangeBottom_ = opt_brightnessRangeBottom;
    }
}
exports.default = MESH_100PA;
MESH_100PA.PartsName = 'MESH_100PA';
MESH_100PA.PREFIX = 'MESH-100PA';
MESH_100PA.NotifyMode = MeshJsPa_1.MeshJsPa.NotifyMode;
