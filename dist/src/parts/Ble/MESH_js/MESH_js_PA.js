"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const MESH_js_Error_1 = require("./MESH_js_Error");
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
        const _Byte = 256;
        this.response.requestId = data[2];
        this.response.proximity = _Byte * data[5] + data[4];
        this.response.brightness = _Byte * data[7] + data[6];
        if (typeof this.onNotify !== 'function') {
            return;
        }
        this.onNotify(this.response);
    }
    get getResponse() {
        return this.response;
    }
    /**
     *
     * @param notifyType
     * @param requestId
     * @returns command
     */
    parseSetmodeCommand(notifyType, requestId = 0) {
        // Error Handle
        if (notifyType % 4 !== 0) {
            throw new MESH_js_Error_1.MESHInvalidValue('notifyType');
        }
        const _notifytypeMin = 4;
        const _notifytypeMax = 60;
        if (notifyType < _notifytypeMin || _notifytypeMax < notifyType) {
            throw new MESH_js_Error_1.MESHOutOfRangeError('notifyType');
        }
        // Generate Command
        const _HEADER = [this.MessageTypeID, this.EventTypeID, requestId];
        const _FIXED = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2];
        const data = _HEADER.concat(_FIXED).concat(notifyType);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MESH_js_PA = MESH_js_PA;
MESH_js_PA.NotifyType = {
    UpdateProximity: 4,
    UpdateBrightness: 8,
    Once: 16,
    Always: 32,
};
