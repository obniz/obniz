"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const MESH_js_Error_1 = require("./MESH_js_Error");
class MESH_js_TH extends _1.MESH_js {
    constructor() {
        super(...arguments);
        // Event handler
        this.onNotify = null;
        /**
         * MessageTypeID
         * command header
         */
        this.MessageTypeID = 1;
        /**
         * EventTypeID
         * command header
         */
        this.EventTypeID = 0;
        this.MaxTemperature = 50;
        this.MinTemperature = -10;
        this.MaxHumidity = 100;
        this.MinHumidity = 0;
        this.response = { request_id: -1, temperature: -1, humidity: -1 };
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
        const _Byte = 256;
        const temp = this.complemnt(_Byte * data[5] + data[4]) / 10;
        this.response.temperature = Math.min(Math.max(this.MinTemperature, temp), this.MaxTemperature);
        const hum_ori = _Byte * data[7] + data[6];
        this.response.humidity = Math.min(Math.max(this.MinHumidity, hum_ori), this.MaxHumidity);
        if (typeof this.onNotify !== 'function') {
            return;
        }
        this.onNotify(this.response);
    }
    get getResponse() {
        return this.response;
    }
    parseSetmodeCommand(temperature_range_upper, temperature_range_bottom, temperature_condition, humidity_range_upper, humidity_range_bottom, humidity_condision, type, request_id = 0) {
        // Error Handle
        if (temperature_range_bottom < this.MinTemperature ||
            this.MaxTemperature < temperature_range_upper) {
            throw new MESH_js_Error_1.MESHOutOfRangeError('temperature_range', this.MinTemperature, this.MaxTemperature);
        }
        if (humidity_range_bottom < this.MinHumidity ||
            this.MaxHumidity < humidity_range_upper) {
            throw new MESH_js_Error_1.MESHOutOfRangeError('humidity_range', this.MinHumidity, this.MaxHumidity);
        }
        // Generate Command
        const _HEADER = [this.MessageTypeID, this.EventTypeID, request_id];
        const TEMP_UPPER = this.num2array(10 * this.invcomplemnt(temperature_range_upper));
        const TEMP_BOTTOM = this.num2array(10 * this.invcomplemnt(temperature_range_bottom));
        const HUMI_UPPER = this.num2array(humidity_range_upper);
        const HUMI_BOTTOM = this.num2array(humidity_range_bottom);
        const data = _HEADER
            .concat(TEMP_UPPER)
            .concat(TEMP_BOTTOM)
            .concat(HUMI_UPPER)
            .concat(HUMI_BOTTOM)
            .concat([temperature_condition, humidity_condision, type]);
        data.push(this.checkSum(data));
        return data;
    }
    num2array(val) {
        const _Byte = 256;
        return [val % _Byte, Math.floor(val / _Byte)];
    }
    complemnt(val) {
        const _2Byte = 65536;
        const _2ByteHalf = Math.floor(_2Byte / 2) - 1;
        return val - (val > _2ByteHalf ? _2Byte : 0);
    }
    invcomplemnt(val) {
        const _2Byte = 65536;
        return val + (val < 0 ? _2Byte : 0);
    }
}
exports.MESH_js_TH = MESH_js_TH;
MESH_js_TH.NotifyType = {
    UpdateTemperature: 4,
    UpdateHumidity: 8,
    Once: 16,
    Always: 32,
};
