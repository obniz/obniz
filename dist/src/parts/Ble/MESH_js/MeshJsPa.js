"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
const MeshJsError_1 = require("./MeshJsError");
class MeshJsPa extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
    }
    /**
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
        const BYTE = 256;
        const proximity = BYTE * data[5] + data[4];
        const brightness = BYTE * data[7] + data[6];
        const requestId = data[2];
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        this.onSensorEvent(proximity, brightness, requestId);
    }
    /**
     *
     * @param notifyType
     * @param opt_requestId
     * @returns command
     */
    parseSetmodeCommand(notifyMode, opt_requestId = 0) {
        // Error Handle
        this.checkNotifyMode_(notifyMode);
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const FIXED = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2];
        const data = HEADER.concat(FIXED).concat(notifyMode);
        data.push(this.checkSum(data));
        return data;
    }
    checkNotifyMode_(target) {
        if (target === 0) {
            return true;
        }
        if (target % 4 !== 0) {
            throw new MeshJsError_1.MeshJsInvalidValueError('notifyMode');
        }
        const NOTIFY_MODE_MIN = MeshJsPa.NotifyMode.UPDATE_PROXIMITY;
        const NOTIFY_MODE_MAX = MeshJsPa.NotifyMode.UPDATE_PROXIMITY +
            MeshJsPa.NotifyMode.UPDATE_BRIGHTNESS +
            MeshJsPa.NotifyMode.ONCE +
            MeshJsPa.NotifyMode.ALWAYS;
        if (target < NOTIFY_MODE_MIN || NOTIFY_MODE_MAX < target) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('notifyType', NOTIFY_MODE_MIN, NOTIFY_MODE_MAX);
        }
        return true;
    }
}
exports.MeshJsPa = MeshJsPa;
// Constant Values
MeshJsPa.NotifyMode = {
    STOP: 0,
    UPDATE_PROXIMITY: 4,
    UPDATE_BRIGHTNESS: 8,
    ONCE: 16,
    ALWAYS: 32,
};
