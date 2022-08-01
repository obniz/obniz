"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
const MeshJsError_1 = require("./MeshJsError");
class MeshJsTh extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSensorEvent = null;
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
        this.TEMPERATURE_MAX_ = 50;
        this.TEMPERATURE_MIN_ = -10;
        this.HUMIDITY_MAX_ = 100;
        this.HUMIDITY_MIN_ = 0;
        this.NOTIFY_MODE_MIN_ = MeshJsTh.NotifyMode.STOP;
        this.NOTIFY_MODE_MAX_ = MeshJsTh.NotifyMode.STOP +
            MeshJsTh.NotifyMode.EMIT_TEMPERATURE +
            MeshJsTh.NotifyMode.EMIT_HUMIDITY +
            MeshJsTh.NotifyMode.UPDATE_TEMPERATURE +
            MeshJsTh.NotifyMode.UPDATE_HUMIDITY +
            MeshJsTh.NotifyMode.ONCE +
            MeshJsTh.NotifyMode.ALWAYS;
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
        const BASE = 10;
        const TEMP = this.complemnt_(BYTE * data[5] + data[4]) / BASE;
        const temperature = Math.min(Math.max(this.TEMPERATURE_MIN_, TEMP), this.TEMPERATURE_MAX_);
        const HUM = BYTE * data[7] + data[6];
        const humidity = Math.min(Math.max(this.HUMIDITY_MIN_, HUM), this.HUMIDITY_MAX_);
        const requestId = data[2];
        if (typeof this.onSensorEvent !== 'function') {
            return;
        }
        this.onSensorEvent(temperature, humidity, requestId);
    }
    /**
     *
     * @param temperatureRangeUpper
     * @param temperatureRangeBottom
     * @param humidityRangeUpper
     * @param humidityRangeBottom
     * @param temperatureCondition
     * @param humidityCondision
     * @param notifyMode
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(temperatureRangeUpper, temperatureRangeBottom, humidityRangeUpper, humidityRangeBottom, temperatureCondition, humidityCondision, notifyMode, opt_requestId = 0) {
        // Error Handle
        this.checkRange_(temperatureRangeUpper, this.TEMPERATURE_MIN_, this.TEMPERATURE_MAX_, 'temperatureRangeUpper');
        this.checkRange_(temperatureRangeBottom, this.TEMPERATURE_MIN_, this.TEMPERATURE_MAX_, 'temperatureRangeBottom');
        this.checkRange_(humidityRangeUpper, this.HUMIDITY_MIN_, this.HUMIDITY_MAX_, 'humidityRangeUpper');
        this.checkRange_(humidityRangeBottom, this.HUMIDITY_MIN_, this.HUMIDITY_MAX_, 'humidityRangeBottom');
        this.checkEmitCondition_(temperatureCondition, 'temperatureCondition');
        this.checkEmitCondition_(humidityCondision, 'humidityCondision');
        this.checkNotifyMode_(notifyMode);
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const BASE = 10;
        const TEMP_UPPER = this.num2array_(BASE * this.invcomplemnt_(temperatureRangeUpper));
        const TEMP_BOTTOM = this.num2array_(BASE * this.invcomplemnt_(temperatureRangeBottom));
        const HUMI_UPPER = this.num2array_(humidityRangeUpper);
        const HUMI_BOTTOM = this.num2array_(humidityRangeBottom);
        const data = HEADER.concat(TEMP_UPPER)
            .concat(TEMP_BOTTOM)
            .concat(HUMI_UPPER)
            .concat(HUMI_BOTTOM)
            .concat([temperatureCondition, humidityCondision, notifyMode]);
        data.push(this.checkSum(data));
        return data;
    }
    num2array_(val) {
        const BYTE = 256;
        return [val % BYTE, Math.floor(val / BYTE)];
    }
    complemnt_(val) {
        const TWO_BYTE = 65536;
        const TWO_BYTE_HALF = Math.floor(TWO_BYTE / 2) - 1;
        return val - (val > TWO_BYTE_HALF ? TWO_BYTE : 0);
    }
    invcomplemnt_(val) {
        const TWO_BYTE = 65536;
        return val + (val < 0 ? TWO_BYTE : 0);
    }
    checkRange_(target, min, max, name) {
        if (target < min || max < target) {
            throw new MeshJsError_1.MeshJsOutOfRangeError(name, min, max);
        }
        return true;
    }
    checkEmitCondition_(target, name) {
        let _isExist = false;
        Object.entries(MeshJsTh.EmitCondition).forEach(([, value]) => {
            if (target === value) {
                _isExist = true;
            }
        });
        if (_isExist) {
            return true;
        }
        throw new MeshJsError_1.MeshJsInvalidValueError(name);
    }
    checkNotifyMode_(target) {
        if (target < this.NOTIFY_MODE_MIN_ || this.NOTIFY_MODE_MAX_ < target) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('notifyType', this.NOTIFY_MODE_MIN_, this.NOTIFY_MODE_MAX_);
        }
        return true;
    }
}
exports.MeshJsTh = MeshJsTh;
// Constant Values
MeshJsTh.EmitCondition = {
    ABOVE_UPPER_AND_BELOW_BOTTOM: 0,
    ABOVE_UPPER_AND_ABOVE_BOTTOM: 1,
    BELOW_UPPER_AND_BELOW_BOTTOM: 16,
    BELOW_UPPER_AND_ABOVE_BOTTOM: 17,
};
MeshJsTh.NotifyMode = {
    STOP: 0,
    EMIT_TEMPERATURE: 1,
    EMIT_HUMIDITY: 2,
    UPDATE_TEMPERATURE: 4,
    UPDATE_HUMIDITY: 8,
    ONCE: 16,
    ALWAYS: 32,
};
