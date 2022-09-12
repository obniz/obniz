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
        this.holdingTime_ = 500; // [ms]
        this.detectionTime_ = 500; // [ms]
    }
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral, opt_serialnumber = '') {
        return Motion_1.Motion.isMESHblock(peripheral.localName, opt_serialnumber);
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
            motionState: await this.getSensorDataWait(),
        };
    }
    /**
     * getSensorDataWait
     *
     * @returns
     */
    async getSensorDataWait(opt_timeoutMsec = this.TIMEOUT_MSEC) {
        this.checkConnected();
        const _requestId = this.requestId.next();
        this.setMode_(MESH_100MD.NotifyMode.ONCE, this.holdingTime_, this.detectionTime_, _requestId);
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
                resolve(this.retMotionState_);
            }, INTERVAL_TIME);
        });
        if (MESH_100MD.NotifyMode.ALWAYS < this.notifyMode_) {
            // Continus previous mode
            this.setMode(this.notifyMode_, this.holdingTime_, this.detectionTime_);
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
     * @param opt_holdingTime
     * @param opt_detectionTime
     */
    setMode(notifyMode, opt_holdingTime = 500, opt_detectionTime = 500) {
        this.setMode_(notifyMode, opt_holdingTime, opt_detectionTime, this.requestId.defaultId());
        this.notifyMode_ = notifyMode;
        this.holdingTime_ = opt_holdingTime;
        this.detectionTime_ = opt_detectionTime;
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
    setMode_(notifyMode, holdingTime, detectionTime, requestId) {
        const motionBlock = this.meshBlock;
        const command = motionBlock.createSetmodeCommand(notifyMode, holdingTime, detectionTime, requestId);
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
MESH_100MD.LocalName = /^MESH-100MD/;
MESH_100MD.NotifyMode = Motion_1.Motion.NotifyMode;
MESH_100MD.MotionState = Motion_1.Motion.MotionState;
