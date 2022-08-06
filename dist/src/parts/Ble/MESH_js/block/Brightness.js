"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Error_1 = require("../util/Error");
class Brightness extends Base_1.Base {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.PROXIMITY_RANGE_MIN_ = 0;
        this.PROXIMITY_RANGE_MAX_ = 4095;
        this.BRIGHTNESS_RANGE_MIN_ = 0;
        this.BRIGHTNESS_RANGE_MAX_ = 65535;
        this.NOTIFY_MODE_MIN_ = Brightness.NotifyMode.STOP;
        this.NOTIFY_MODE_MAX_ = Brightness.NotifyMode.STOP +
            Brightness.NotifyMode.EMIT_PROXIMITY +
            Brightness.NotifyMode.EMIT_BRIGHTNESS +
            Brightness.NotifyMode.UPDATE_PROXIMITY +
            Brightness.NotifyMode.UPDATE_BRIGHTNESS +
            Brightness.NotifyMode.ONCE +
            Brightness.NotifyMode.ALWAYS;
        this.MESSAGE_TYPE_INDEX_ = 0;
        this.EVENT_TYPE_INDEX_ = 1;
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
        this.LX_ = 10;
    }
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data) {
        super.notify(data);
        if (data[this.MESSAGE_TYPE_INDEX_] !== this.MESSAGE_TYPE_ID_) {
            return;
        }
        if (data[this.EVENT_TYPE_INDEX_] !== this.EVENT_TYPE_ID_) {
            return;
        }
        const BYTE = 256;
        const proximity = BYTE * data[5] + data[4];
        const brightness = this.LX_ * (BYTE * data[7] + data[6]);
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
    parseSetmodeCommand(proximityRangeUpper, proximityRangeBottom, brightnessRangeUpper, brightnessRangeBottom, proximityCondition, brightnessCondition, notifyMode, opt_requestId = 0) {
        // Convert
        const _brightnessRangeUpper = brightnessRangeUpper / this.LX_;
        const _brightnessRangeBottom = brightnessRangeBottom / this.LX_;
        // Error Handle
        this.checkRange(proximityRangeUpper, this.PROXIMITY_RANGE_MIN_, this.PROXIMITY_RANGE_MAX_, 'proximityRangeUpper');
        this.checkRange(proximityRangeBottom, this.PROXIMITY_RANGE_MIN_, this.PROXIMITY_RANGE_MAX_, 'proximityRangeBottom');
        this.checkRange(_brightnessRangeUpper, this.BRIGHTNESS_RANGE_MIN_, this.BRIGHTNESS_RANGE_MAX_, 'brightnessRangeUpper/' + this.LX_);
        this.checkRange(_brightnessRangeBottom, this.BRIGHTNESS_RANGE_MIN_, this.BRIGHTNESS_RANGE_MAX_, 'brightnessRangeBottom/' + this.LX_);
        this.checkEmitCondition_(proximityCondition, 'proximityCondition');
        this.checkEmitCondition_(brightnessCondition, 'brightnessCondition');
        this.checkRange(notifyMode, this.NOTIFY_MODE_MIN_, this.NOTIFY_MODE_MAX_, 'notifyMode');
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const PROXIMITY_RANGE_UPPER = this.num2array_(proximityRangeUpper);
        const PROXIMITY_RANGE_BOTTOM = this.num2array_(proximityRangeBottom);
        const BRIGHTNESS_RANGE_UPPER = this.num2array_(_brightnessRangeUpper);
        const BRIGHTNESS_RANGE_BOTTOM = this.num2array_(_brightnessRangeBottom);
        const FIXED = [2, 2, 2];
        const data = HEADER.concat(PROXIMITY_RANGE_UPPER)
            .concat(PROXIMITY_RANGE_BOTTOM)
            .concat(BRIGHTNESS_RANGE_UPPER)
            .concat(BRIGHTNESS_RANGE_BOTTOM)
            .concat(proximityCondition)
            .concat(brightnessCondition)
            .concat(FIXED)
            .concat(notifyMode);
        data.push(this.checkSum(data));
        return data;
    }
    checkEmitCondition_(target, name) {
        let _isExist = false;
        Object.entries(Brightness.EmitCondition).forEach(([key, value]) => {
            if (target === value) {
                _isExist = true;
            }
        });
        if (_isExist) {
            return true;
        }
        throw new Error_1.MESHJsInvalidValueError(name);
    }
    num2array_(val) {
        const BYTE = 256;
        return [val % BYTE, Math.floor(val / BYTE)];
    }
}
exports.Brightness = Brightness;
// Constant Values
Brightness.EmitCondition = {
    ABOVE_UPPER_AND_BELOW_BOTTOM: 0,
    ABOVE_UPPER_AND_ABOVE_BOTTOM: 1,
    BELOW_UPPER_AND_BELOW_BOTTOM: 16,
    BELOW_UPPER_AND_ABOVE_BOTTOM: 17,
};
Brightness.NotifyMode = {
    STOP: 0,
    EMIT_PROXIMITY: 1,
    EMIT_BRIGHTNESS: 2,
    UPDATE_PROXIMITY: 4,
    UPDATE_BRIGHTNESS: 8,
    ONCE: 16,
    ALWAYS: 32,
};
