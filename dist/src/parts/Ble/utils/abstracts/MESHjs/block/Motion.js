"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Motion = void 0;
const Base_1 = require("./Base");
class Motion extends Base_1.Base {
    constructor() {
        super(...arguments);
        /**
         * Sensing event
         */
        this.onSensorEvent = null;
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
    }
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name, opt_serialnumber = '') {
        return super.isMESHblock(name, opt_serialnumber)
            ? (name === null || name === void 0 ? void 0 : name.indexOf('MESH-100MD')) !== -1
            : false;
    }
    /**
     * Parse data that received from MESH block, and emit event
     *
     * @param data
     * @returns void
     */
    notify(data) {
        super.notify(data);
        if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_) {
            return;
        }
        if (data[this.EVENT_TYPE_ID_INDEX] !== this.EVENT_TYPE_ID_) {
            return;
        }
        const requestId = data[2];
        const motionState = data[3];
        const notifyMode = data[4];
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        this.onSensorEvent(motionState, notifyMode, requestId);
    }
    /**
     * Create command of set-mode
     *
     * @param notifyMode
     * @param opt_holdingTime
     * @param opt_detectionTime
     * @param opt_requestId
     * @returns command
     */
    createSetmodeCommand(notifyMode, opt_holdingTime = 500, opt_detectionTime = 500, opt_requestId = 0) {
        // Error Handle
        const HOLDING_TIME_MIN = 200;
        const HOLDING_TIME_MAX = 60000;
        this.checkRange(opt_holdingTime, HOLDING_TIME_MIN, HOLDING_TIME_MAX, 'opt_holdingTime');
        const DETECTION_TIME_MIN = 500;
        const DETECTION_TIME_MAX = 60000;
        this.checkRange(opt_detectionTime, DETECTION_TIME_MIN, DETECTION_TIME_MAX, 'opt_detectionTime');
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const BYTE = 256;
        const BODY = [
            notifyMode,
            opt_holdingTime % BYTE,
            Math.floor(opt_holdingTime / BYTE),
            opt_detectionTime % BYTE,
            Math.floor(opt_detectionTime / BYTE),
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.Motion = Motion;
// Constant Values
Motion.NotifyMode = {
    DETECTED: 1,
    NOT_DETECTED: 2,
    ONCE: 16,
    ALWAYS: 32,
};
Motion.MotionState = {
    SETUP: 0,
    DETECTED: 1,
    NOT_DETECTED: 2,
};
