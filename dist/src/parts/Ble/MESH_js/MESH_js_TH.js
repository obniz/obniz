"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
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
        this.response = { requestId: -1, temperature: -1, humidity: -1 };
    }
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        if (data[1] !== this.EventTypeID) {
            return;
        }
<<<<<<< HEAD
        const temp = this.complemnt(256 * data[5] + data[4]) / 10;
        this.response.temperature = Math.min(Math.max(this.MinTemperature, temp), this.MaxTemperature);
        const hum_ori = 256 * data[7] + data[6];
        this.response.humidity = Math.min(Math.max(this.MinHumidity, hum_ori), this.MaxHumidity);
=======
        const temp_ori = 256 * data[5] + data[4];
        const temp = (temp_ori - (temp_ori > 32767 ? 65536 : 0)) / 10;
        this.response.temperature = Math.min(Math.max(-10, temp), 50);
        const hum_ori = 256 * data[7] + data[6];
        this.response.humidity = Math.min(Math.max(0, hum_ori), 100);
>>>>>>> 4f948b4f8 (inp)
        if (typeof this.onNotify !== 'function') {
            return;
        }
        this.onNotify(this.response);
    }
    get getResponse() {
        return this.response;
    }
<<<<<<< HEAD
    parseSetmodeCommand(temperature_range_upper, temperature_range_bottom, temperature_condition, humidity_range_upper, humidity_range_bottom, humidity_condision, type) {
        const RequestID = 0;
        const HEADER = [this.MessageTypeID, this.EventTypeID, RequestID];
        const TEMP_UPPER = this.num2array(10 * this.invcomplemnt(temperature_range_upper));
        const TEMP_BOTTOM = this.num2array(10 * this.invcomplemnt(temperature_range_bottom));
        const HUMI_UPPER = this.num2array(humidity_range_upper);
        const HUMI_BOTTOM = this.num2array(humidity_range_bottom);
        const data = HEADER.concat(TEMP_UPPER)
            .concat(TEMP_BOTTOM)
            .concat(HUMI_UPPER)
            .concat(HUMI_BOTTOM)
            .concat([temperature_condition, humidity_condision, type]);
=======
    parseSetmodeCommand(temperature_range_upper, temperature_range_bottom, temperature_condition, humidity_range_upper, humidity_range_bottom, humidity_condision, type, request_id = 0) {
        // Generate Command
        const _HEADER = [this.MessageTypeID, this.EventTypeID, request_id];
        const _Byte = 256;
        const _BODY = [
            (10 * temperature_range_upper) % _Byte,
            Math.floor((10 * temperature_range_upper) / _Byte),
            (10 * temperature_range_bottom) % _Byte,
            Math.floor((10 * temperature_range_bottom) / _Byte),
            humidity_range_upper % _Byte,
            Math.floor(humidity_range_upper / _Byte),
            humidity_range_bottom % _Byte,
            Math.floor(humidity_range_bottom / _Byte),
            temperature_condition,
            humidity_condision,
            type,
        ];
        const data = _HEADER.concat(_BODY);
>>>>>>> 4f948b4f8 (inp)
        data.push(this.checkSum(data));
        return data;
    }
    num2array(val) {
        const _base = 256;
        return [val % _base, Math.floor(val / _base)];
    }
    complemnt(val) {
        return val - (val > 32767 ? 65536 : 0);
    }
    invcomplemnt(val) {
        return val + (val < 0 ? 65536 : 0);
    }
}
exports.MESH_js_TH = MESH_js_TH;
