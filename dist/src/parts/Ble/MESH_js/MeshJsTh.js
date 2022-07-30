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
        this.MAX_TEMPERATURE_ = 50;
        this.MIN_TEMPERATURE_ = -10;
        this.MAX_HUMIDITY_ = 100;
        this.MIN_HUMIDITY_ = 0;
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
        const TEMP = this.complemnt_(BYTE * data[5] + data[4]) / 10;
        const temperature = Math.min(Math.max(this.MIN_TEMPERATURE_, TEMP), this.MAX_TEMPERATURE_);
        const HUM = BYTE * data[7] + data[6];
        const humidity = Math.min(Math.max(this.MIN_HUMIDITY_, HUM), this.MAX_HUMIDITY_);
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
     * @param temperatureCondition
     * @param humidityRangeUpper
     * @param humidityRangeBottom
     * @param humidityCondision
     * @param type
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(temperatureRangeUpper, temperatureRangeBottom, temperatureCondition, humidityRangeUpper, humidityRangeBottom, humidityCondision, type, opt_requestId = 0) {
        // Error Handle
        if (temperatureRangeBottom < this.MIN_TEMPERATURE_ ||
            this.MAX_TEMPERATURE_ < temperatureRangeUpper) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('temperatureRange', this.MIN_TEMPERATURE_, this.MAX_TEMPERATURE_);
        }
        if (humidityRangeBottom < this.MIN_HUMIDITY_ ||
            this.MAX_HUMIDITY_ < humidityRangeUpper) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('humidityRange', this.MIN_HUMIDITY_, this.MAX_HUMIDITY_);
        }
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
            .concat([temperatureCondition, humidityCondision, type]);
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
}
exports.MeshJsTh = MeshJsTh;
// Constant Values
MeshJsTh.NOTIFY_TYPE = {
    UPDATE_TEMPERATURE: 4,
    UPDATE_HUMIDITY: 8,
    ONCE: 16,
    ALWAYS: 32,
};
