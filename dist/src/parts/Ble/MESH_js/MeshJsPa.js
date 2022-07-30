"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
const MeshJsError_1 = require("./MeshJsError");
class MeshJsPa extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.NOTIFY_MODE_MIN_ = MeshJsPa.NotifyMode.STOP;
        this.NOTIFY_MODE_MAX_ = MeshJsPa.NotifyMode.STOP +
            MeshJsPa.NotifyMode.EMIT_PROXIMITY +
            MeshJsPa.NotifyMode.EMIT_BRIGHTNESS +
            MeshJsPa.NotifyMode.UPDATE_PROXIMITY +
            MeshJsPa.NotifyMode.UPDATE_BRIGHTNESS +
            MeshJsPa.NotifyMode.ONCE +
            MeshJsPa.NotifyMode.ALWAYS;
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
        const BYTE = 256;
        const proximity = BYTE * data[5] + data[4];
        const LX = 10;
        const brightness = LX * (BYTE * data[7] + data[6]);
        const requestId = data[2];
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        this.onSensorEvent(proximity, brightness, requestId);
    }
    /**
     * parseSetmodeCommand
     *
     * @param notifyMode
     * @param opt_requestId
     * @returns command
     */
    parseSetmodeCommand(proximityRangeUpper, proximityRangeBottom, brightnessRangeUpper, brightnessRangeBottom, notifyMode, opt_requestId = 0) {
        // Error Handle
        this.checkNotifyMode_(notifyMode);
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const PROXIMITY_RANGE_UPPER = this.num2array_(proximityRangeUpper);
        const PROXIMITY_RANGE_BOTTOM = this.num2array_(proximityRangeBottom);
        const BRIGHTNESS_RANGE_UPPER = this.num2array_(brightnessRangeUpper);
        const BRIGHTNESS_RANGE_BOTTOM = this.num2array_(brightnessRangeBottom);
        const FIXED = [0, 0, 2, 2, 2];
        const data = HEADER.concat(PROXIMITY_RANGE_UPPER)
            .concat(PROXIMITY_RANGE_BOTTOM)
            .concat(BRIGHTNESS_RANGE_UPPER)
            .concat(BRIGHTNESS_RANGE_BOTTOM)
            .concat(FIXED)
            .concat(notifyMode);
        data.push(this.checkSum(data));
        return data;
    }
    checkNotifyMode_(target) {
        if (target < this.NOTIFY_MODE_MIN_ || this.NOTIFY_MODE_MAX_ < target) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('notifyType', this.NOTIFY_MODE_MIN_, this.NOTIFY_MODE_MAX_);
        }
        return true;
    }
    num2array_(val) {
        const BYTE = 256;
        return [val % BYTE, Math.floor(val / BYTE)];
    }
}
exports.MeshJsPa = MeshJsPa;
// Constant Values
MeshJsPa.NotifyMode = {
    STOP: 0,
    EMIT_PROXIMITY: 1,
    EMIT_BRIGHTNESS: 2,
    UPDATE_PROXIMITY: 4,
    UPDATE_BRIGHTNESS: 8,
    ONCE: 16,
    ALWAYS: 32,
};
