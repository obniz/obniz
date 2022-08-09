"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
     * notify
     *
     * @param data
     * @returns
     */
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MESSAGE_TYPE_ID_) {
            return;
        }
        if (data[1] !== this.EVENT_TYPE_ID_) {
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
     * Parse to set-mode command
     *
     * @param notifyMode
     * @param opt_detectionTime
     * @param opt_holdingTime
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(notifyMode, opt_detectionTime = 500, opt_holdingTime = 500, opt_requestId = 0) {
        // Error Handle
        const DETECTION_TIME_MIN = 200;
        const DETECTION_TIME_MAX = 60000;
        this.checkRange(opt_detectionTime, DETECTION_TIME_MIN, DETECTION_TIME_MAX, 'opt_detectionTime');
        const HOLDING_TIME_MIN = 500;
        const HOLDING_TIME_MAX = 60000;
        this.checkRange(opt_holdingTime, HOLDING_TIME_MIN, HOLDING_TIME_MAX, 'opt_holdingTime');
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const BYTE = 256;
        const BODY = [
            notifyMode,
            opt_detectionTime % BYTE,
            Math.floor(opt_detectionTime / BYTE),
            opt_holdingTime % BYTE,
            Math.floor(opt_holdingTime / BYTE),
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.Motion = Motion;
// Constant Values
Motion.NotifyMode = {
    DETECTED: 0x01,
    NOT_DETECTED: 0x02,
    ONCE: 0x10,
    ALWAYS: 0x20,
};
Motion.MotionState = {
    SETUP: 0x00,
    DETECTED: 0x01,
    NOT_DETECTED: 0x02,
};
