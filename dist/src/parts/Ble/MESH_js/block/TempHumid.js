"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Error_1 = require("../util/Error");
class TempHumid extends Base_1.Base {
    constructor() {
        super(...arguments);
        /**
         * Sensing event
         */
        this.onSensorEvent = null;
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
        this.TEMPERATURE_MAX_ = 50;
        this.TEMPERATURE_MIN_ = -10;
        this.HUMIDITY_MAX_ = 100;
        this.HUMIDITY_MIN_ = 0;
        this.NOTIFY_MODE_MIN_ = TempHumid.NotifyMode.STOP;
        this.NOTIFY_MODE_MAX_ = TempHumid.NotifyMode.STOP +
            TempHumid.NotifyMode.EMIT_TEMPERATURE +
            TempHumid.NotifyMode.EMIT_HUMIDITY +
            TempHumid.NotifyMode.UPDATE_TEMPERATURE +
            TempHumid.NotifyMode.UPDATE_HUMIDITY +
            TempHumid.NotifyMode.ONCE +
            TempHumid.NotifyMode.ALWAYS;
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
        const BASE = 10;
        const TEMP = this.complemnt(BYTE * data[5] + data[4]) / BASE;
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
     * Parse to set-mode command
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
        this.checkRange(temperatureRangeUpper, this.TEMPERATURE_MIN_, this.TEMPERATURE_MAX_, 'temperatureRangeUpper');
        this.checkRange(temperatureRangeBottom, this.TEMPERATURE_MIN_, this.TEMPERATURE_MAX_, 'temperatureRangeBottom');
        this.checkRange(humidityRangeUpper, this.HUMIDITY_MIN_, this.HUMIDITY_MAX_, 'humidityRangeUpper');
        this.checkRange(humidityRangeBottom, this.HUMIDITY_MIN_, this.HUMIDITY_MAX_, 'humidityRangeBottom');
        this.checkEmitCondition_(temperatureCondition, 'temperatureCondition');
        this.checkEmitCondition_(humidityCondision, 'humidityCondision');
        this.checkRange(notifyMode, this.NOTIFY_MODE_MIN_, this.NOTIFY_MODE_MAX_, 'notifyMode');
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const BASE = 10;
        const TEMP_UPPER = this.num2array_(this.invcomplemnt(BASE * temperatureRangeUpper));
        const TEMP_BOTTOM = this.num2array_(this.invcomplemnt(BASE * temperatureRangeBottom));
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
    checkEmitCondition_(target, name) {
        let _isExist = false;
        Object.entries(TempHumid.EmitCondition).forEach(([, value]) => {
            if (target === value) {
                _isExist = true;
            }
        });
        if (_isExist) {
            return true;
        }
        throw new Error_1.MESHJsInvalidValueError(name);
    }
}
exports.TempHumid = TempHumid;
// Constant Values
TempHumid.EmitCondition = {
    ABOVE_UPPER_AND_BELOW_BOTTOM: 0,
    ABOVE_UPPER_AND_ABOVE_BOTTOM: 1,
    BELOW_UPPER_AND_BELOW_BOTTOM: 16,
    BELOW_UPPER_AND_ABOVE_BOTTOM: 17,
};
TempHumid.NotifyMode = {
    STOP: 0,
    EMIT_TEMPERATURE: 1,
    EMIT_HUMIDITY: 2,
    UPDATE_TEMPERATURE: 4,
    UPDATE_HUMIDITY: 8,
    ONCE: 16,
    ALWAYS: 32,
};
