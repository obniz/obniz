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
     * @param opt_detectionTime
     * @param opt_responseTime
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(detectionMode, opt_detectionTime = 500, opt_responseTime = 500, opt_requestId = 0) {
        // Error Handle
        const DETECTION_TIME_MIN = 200;
        const DETECTION_TIME_MAX = 60000;
        if (opt_detectionTime < DETECTION_TIME_MIN ||
            DETECTION_TIME_MAX < opt_detectionTime) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('opt_detectionTime', DETECTION_TIME_MIN, DETECTION_TIME_MAX);
        }
        const RESPONSE_TIME_MIN = 500;
        const RESPONSE_TIME_MAX = 60000;
        if (opt_responseTime < RESPONSE_TIME_MIN ||
            RESPONSE_TIME_MAX < opt_responseTime) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('opt_responseTime', RESPONSE_TIME_MIN, RESPONSE_TIME_MAX);
        }
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const BYTE = 256;
        const BODY = [
            detectionMode,
            opt_detectionTime % BYTE,
            Math.floor(opt_detectionTime / BYTE),
            opt_responseTime % BYTE,
            Math.floor(opt_responseTime / BYTE),
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MeshJsMd = MeshJsMd;
