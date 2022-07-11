"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MESH_js_MD extends _1.MESH_js {
    constructor() {
        super(...arguments);
        this.DetectionMode = {
            DETECTED: 0x01,
            NOTDETECTED: 0x02,
            ONESHOT: 0x10,
            CONTINUOUS: 0x20,
        };
        this.MotionState = {
            SETUP: 0x00,
            DETECTED: 0x01,
            NOTDETECTED: 0x02,
        };
        this.onNotify = null;
        this.MessageTypeID = 1;
        this.EventTypeID = 0;
        this.response = { requestId: -1, motion_state: -1, detection_mode: -1 };
    }
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        if (data[1] !== this.EventTypeID) {
            return;
        }
        this.response.requestId = data[2];
        this.response.motion_state = data[3];
        this.response.detection_mode = data[4];
        if (typeof this.onNotify !== 'function') {
            return;
        }
        this.onNotify(this.response);
    }
    get getResponse() {
        return this.response;
    }
    parseSetmodeCommand(detection_mode, detection_time = 500, response_time = 500, requestid = 0) {
        if (detection_time < 200 || 60000 < detection_time) {
            this.errorOutOfRange('detection_time (' + detection_time + ') must be 200 ~ 60000.');
            return [];
        }
        if (response_time < 500 || 60000 < response_time) {
            this.errorOutOfRange('response_time (' + response_time + ') must be 500 ~ 60000.');
            return [];
        }
        const HEADER = [this.MessageTypeID, this.EventTypeID, requestid];
        const BODY = [
            detection_mode,
            detection_time % 256,
            Math.floor(detection_time / 256),
            response_time % 256,
            Math.floor(response_time / 256),
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MESH_js_MD = MESH_js_MD;
