"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
const MeshJsError_1 = require("./MeshJsError");
class MeshJsMd extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.MotionState = {
            SETUP: 0x00,
            DETECTED: 0x01,
            NOT_DETECTED: 0x02,
        };
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
     *
     * @param notifyMode
     * @param opt_detectionTime
     * @param opt_responseTime
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(notifyMode, opt_detectionTime = 500, opt_responseTime = 500, opt_requestId = 0) {
        // Error Handle
        const DETECTION_TIME_MIN = 200;
        const DETECTION_TIME_MAX = 60000;
        this.checkRange_(opt_detectionTime, DETECTION_TIME_MIN, DETECTION_TIME_MAX, 'opt_detectionTime');
        const RESPONSE_TIME_MIN = 500;
        const RESPONSE_TIME_MAX = 60000;
        this.checkRange_(opt_responseTime, RESPONSE_TIME_MIN, RESPONSE_TIME_MAX, 'opt_responseTime');
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
            opt_responseTime % BYTE,
            Math.floor(opt_responseTime / BYTE),
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
    checkRange_(target, min, max, name) {
        if (target < min || max < target) {
            throw new MeshJsError_1.MeshJsOutOfRangeError(name, min, max);
        }
        return true;
    }
}
exports.MeshJsMd = MeshJsMd;
// Constant Values
MeshJsMd.NotifyMode = {
    DETECTED: 0x01,
    NOT_DETECTED: 0x02,
    ONCE: 0x10,
    ALWAYS: 0x20,
};
