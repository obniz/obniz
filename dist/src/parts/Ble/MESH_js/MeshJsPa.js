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
    parseSetmodeCommand(notifyType, opt_requestId = 0) {
        // Error Handle
        if (notifyType % 4 !== 0) {
            throw new MeshJsError_1.MeshJsInvalidValueError('notifyType');
        }
        const NOTIFY_TYPE_MIN = MeshJsPa.NOTIFY_TYPE.UPDATE_PROXIMITY;
        const NOTIFY_TYPE_MAX = MeshJsPa.NOTIFY_TYPE.UPDATE_PROXIMITY +
            MeshJsPa.NOTIFY_TYPE.UPDATE_BRIGHTNESS +
            MeshJsPa.NOTIFY_TYPE.ONCE +
            MeshJsPa.NOTIFY_TYPE.ALWAYS;
        if (notifyType < NOTIFY_TYPE_MIN || NOTIFY_TYPE_MAX < notifyType) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('notifyType', NOTIFY_TYPE_MIN, NOTIFY_TYPE_MAX);
        }
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const FIXED = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2];
        const data = HEADER.concat(FIXED).concat(notifyType);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MeshJsPa = MeshJsPa;
// Constant Values
MeshJsPa.NOTIFY_TYPE = {
    UPDATE_PROXIMITY: 4,
    UPDATE_BRIGHTNESS: 8,
    ONCE: 16,
    ALWAYS: 32,
};
