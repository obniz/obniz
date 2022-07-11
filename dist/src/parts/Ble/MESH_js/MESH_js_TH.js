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
        const temp_ori = 256 * data[5] + data[4];
        const temp = (temp_ori - (temp_ori > 32767 ? 65536 : 0)) / 10;
        this.response.temperature = Math.min(Math.max(-10, temp), 50);
        // this.response.temperature = (temp < -10) ? -10 : ((temp > 50) ? 50 : temp);
        const hum_ori = 256 * data[7] + data[6];
        this.response.humidity = Math.min(Math.max(0, hum_ori), 100);
        // this.response.humidity = (hum_ori < 0) ? 0 : ((hum_ori > 100) ? 100 : hum_ori);
        if (typeof this.onNotify !== 'function') {
            return;
        }
        this.onNotify(this.response);
    }
    get getResponse() {
        return this.response;
    }
    parseSetmodeCommand(temperature_range_upper, temperature_range_bottom, temperature_condition, humidity_range_upper, humidity_range_bottom, humidity_condision, type) {
        const RequestID = 0;
        const HEADER = [this.MessageTypeID, this.EventTypeID, RequestID];
        const BODY = [
            (10 * temperature_range_upper) % 256,
            Math.floor((10 * temperature_range_upper) / 256),
            (10 * temperature_range_bottom) % 256,
            Math.floor((10 * temperature_range_bottom) / 256),
            humidity_range_upper % 256,
            Math.floor(humidity_range_upper / 256),
            humidity_range_bottom % 256,
            Math.floor(humidity_range_bottom / 256),
            temperature_condition,
            humidity_condision,
            type,
        ];
        const data = HEADER.concat(BODY);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MESH_js_TH = MESH_js_TH;
