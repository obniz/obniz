"use strict";
/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const MESH_1 = require("../utils/abstracts/MESH");
const Motion_1 = require("../utils/abstracts/MESHjs/block/Motion");
const Error_1 = require("../utils/abstracts/MESHjs/util/Error");
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
        this.holdingTime_ = 500; // [ms]
    }
    /**
     * getDataWait
     *
     * @returns
     */
    async getDataWait() {
        this.checkConnected();
        const motionBlock = this.meshBlock;
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
        this.setMode_(MESH_100MD.NotifyMode.ONCE, this.detectionTime_, this.holdingTime_, _requestId);
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
        if (MESH_100MD.NotifyMode.ALWAYS < this.notifyMode_) {
            // Continus previous mode
            this.setMode(this.notifyMode_, this.detectionTime_, this.holdingTime_);
        }
        if (_result == null) {
            throw new Error_1.MESHJsTimeOutError(this.peripheral.localName);
        }
        return _result;
    }
    /**
     * setMode
     *
     * @param notifyMode
     * @param opt_detectionTime
     * @param opt_holdingTime
     */
    setMode(notifyMode, opt_detectionTime = 500, opt_holdingTime = 500) {
        this.setMode_(notifyMode, opt_detectionTime, opt_holdingTime, this.requestId.defaultId());
        this.notifyMode_ = notifyMode;
        this.detectionTime_ = opt_detectionTime;
        this.holdingTime_ = opt_holdingTime;
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH_100MD.PREFIX) !== -1;
    }
    prepareConnect() {
        this.meshBlock = new Motion_1.Motion();
        // set Event Handler
        const motionBlock = this.meshBlock;
        motionBlock.onSensorEvent = (motionState, notifyMode, requestId) => this.setHandler_(motionState, notifyMode, requestId);
        super.prepareConnect();
    }
    async beforeOnDisconnectWait(reason) {
        // do nothing
    }
    setMode_(notifyMode, detectionTime, holdingTime, requestId) {
        const motionBlock = this.meshBlock;
        const command = motionBlock.parseSetmodeCommand(notifyMode, detectionTime, holdingTime, requestId);
        this.writeWOResponse(command);
    }
    setHandler_(motionState, notifyMode, requestId) {
        // Update Inner Values
        this.requestId.received(requestId);
        this.retMotionState_ = motionState;
        // Emit Event
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        if (!this.requestId.isDefaultId(requestId)) {
            return;
        }
        this.onSensorEvent(motionState, notifyMode);
    }
}
exports.default = MESH_100MD;
MESH_100MD.PartsName = 'MESH_100MD';
MESH_100MD.PREFIX = 'MESH-100MD';
MESH_100MD.NotifyMode = Motion_1.Motion.NotifyMode;
MESH_100MD.MotionState = Motion_1.Motion.MotionState;
