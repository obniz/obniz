"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const MESH_js_Error_1 = require("./MESH_js_Error");
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
        this.response = { request_id: -1, motion_state: -1, detection_mode: -1 };
    }
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        if (data[1] !== this.EventTypeID) {
            return;
        }
        this.response.request_id = data[2];
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
    parseSetmodeCommand(detection_mode, detection_time = 500, response_time = 500, request_id = 0) {
        // Error Handle
        const _DetectionTimeMin = 200;
        const _DetectionTimeMax = 60000;
        if (detection_time < _DetectionTimeMin ||
            _DetectionTimeMax < detection_time) {
            throw new MESH_js_Error_1.MESHOutOfRangeError('detection_time', _DetectionTimeMin, _DetectionTimeMax);
        }
        const _ResponseTimeMin = 500;
        const _ResponseTimeMax = 60000;
        if (response_time < _ResponseTimeMin || _ResponseTimeMax < response_time) {
            throw new MESH_js_Error_1.MESHOutOfRangeError('response_time', _ResponseTimeMin, _ResponseTimeMax);
        }
        // Generate Command
        const HEADER = [this.MessageTypeID, this.EventTypeID, request_id];
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
