"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MESH_js_PA extends _1.MESH_js {
    constructor() {
        super(...arguments);
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
        this.response = { requestId: -1, proximity: -1, brightness: -1 };
        this.onNotify = null;
    }
    notify(data) {
        super.notify(data);
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        if (data[1] !== this.EventTypeID) {
            return;
        }
        this.response.requestId = data[2];
        this.response.proximity = 256 * data[5] + data[4];
        this.response.brightness = 256 * data[7] + data[6];
        if (typeof this.onNotify !== 'function') {
            return;
        }
        this.onNotify(this.response);
    }
    get getResponse() {
        return this.response;
    }
    /**
     * setMode
     *
     * @param type
     * @returns
     */
    parseSetmodeCommand(notifyType, requestId = 0) {
        const HEADER = [this.MessageTypeID, this.EventTypeID, requestId];
        const FIXED = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2];
        const data = HEADER.concat(FIXED).concat(notifyType);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MESH_js_PA = MESH_js_PA;
