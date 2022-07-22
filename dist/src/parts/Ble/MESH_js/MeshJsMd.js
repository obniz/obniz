"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
const MeshJsError_1 = require("./MeshJsError");
class MeshJsMd extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onNotify = null;
        // Constant Values
        this.DETECTION_MODE = {
            DETECTED: 0x01,
            NOT_DETECTED: 0x02,
            ONESHOT: 0x10,
            CONTINUOUS: 0x20,
        };
        this.MOTION_STATE = {
            SETUP: 0x00,
            DETECTED: 0x01,
            NOT_DETECTED: 0x02,
        };
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
        this.response_ = { requestId: -1, motionState: -1, detectionMode: -1 };
    }
    get getResponse() {
        return this.response_;
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
        this.response_.requestId = data[2];
        this.response_.motionState = data[3];
        this.response_.detectionMode = data[4];
        if (typeof this.onNotify !== 'function') {
            return;
        }
        this.onNotify(this.response_);
    }
    /**
     *
     * @param detectionMode
     * @param detectionTime
     * @param responseTime
     * @param requestId
     * @returns
     */
    parseSetmodeCommand(detectionMode, detectionTime = 500, responseTime = 500, requestId = 0) {
        // Error Handle
        const DETECTION_TIME_MIN = 200;
        const DETECTION_TIME_MAX = 60000;
        if (detectionTime < DETECTION_TIME_MIN ||
            DETECTION_TIME_MAX < detectionTime) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('detectionTime', DETECTION_TIME_MIN, DETECTION_TIME_MAX);
        }
        const RESPONSE_TIME_MIN = 500;
        const RESPONSE_TIME_MAX = 60000;
        if (responseTime < RESPONSE_TIME_MIN || RESPONSE_TIME_MAX < responseTime) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('responseTime', RESPONSE_TIME_MIN, RESPONSE_TIME_MAX);
        }
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            requestId,
        ];
        const BYTE = 256;
        const BODY = [
            detectionMode,
            detectionTime % BYTE,
            Math.floor(detectionTime / BYTE),
            responseTime % BYTE,
            Math.floor(responseTime / BYTE),
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MeshJsMd = MeshJsMd;
