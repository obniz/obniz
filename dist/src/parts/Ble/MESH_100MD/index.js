"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const MeshJsMd_1 = require("../MESH_js/MeshJsMd");
const MeshJsError_1 = require("../MESH_js/MeshJsError");
/** MESH_100MD management class */
class MESH_100MD extends MESH_1.MESH {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.staticClass = MESH_100MD;
        this.retMotionState_ = -1;
        this.notifyMode_ = -1;
        this.detectionTime_ = 500; // [ms]
        this.responseTime_ = 500; // [ms]
    }
    async getDataWait() {
        this.checkConnected();
        const motionBlock = this.meshBlock;
        return {
            name: this.peripheral.localName,
            address: this.peripheral.address,
        };
    }
    async getSensorDataWait() {
        this.checkConnected();
        const _requestId = this.requestId.next();
        this.setMode_(MESH_100MD.NotifyMode.ONCE, this.detectionTime_, this.responseTime_, _requestId);
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
                resolve(this.retMotionState_);
            }, INTERVAL_TIME);
        });
        if (this.notifyMode_ !== MESH_100MD.NotifyMode.ONCE) {
            // Continus previous mode
            this.setMode(this.notifyMode_, this.detectionTime_, this.responseTime_);
        }
        if (_result == null) {
            throw new MeshJsError_1.MeshJsTimeOutError(this.peripheral.localName);
        }
        return _result;
    }
    setMode(notifyMode, opt_detectionTime = 500, opt_responseTime = 500) {
        this.setMode_(notifyMode, opt_detectionTime, opt_responseTime, this.requestId.defaultId());
        this.notifyMode_ = notifyMode;
        this.detectionTime_ = opt_detectionTime;
        this.responseTime_ = opt_responseTime;
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100MD.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new MeshJsMd_1.MeshJsMd();
        // set Event Handler
        const motionBlock = this.meshBlock;
        motionBlock.onSensorEvent = (motionState, notifyMode, requestId) => this.setHandler_(motionState, notifyMode, requestId);
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    setMode_(notifyMode, detectionTime, responseTime, requestId) {
        const motionBlock = this.meshBlock;
        const command = motionBlock.parseSetmodeCommand(notifyMode, detectionTime, responseTime, requestId);
        this.writeWOResponse(command);
    }
    setHandler_(motionState, notifyMode, requestId) {
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        if (this.requestId.isDefaultId(requestId)) {
            // Emit Event
            this.onSensorEvent(motionState, notifyMode);
            return;
        }
        // Update Inner Values
        this.requestId.received(requestId);
        this.retMotionState_ = motionState;
    }
}
exports.default = MESH_100MD;
MESH_100MD.PartsName = 'MESH_100MD';
MESH_100MD.PREFIX = 'MESH-100MD';
MESH_100MD.NotifyMode = MeshJsMd_1.MeshJsMd.NotifyMode;
