"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brightness = void 0;
const Base_1 = require("./Base");
class Brightness extends Base_1.Base {
    constructor() {
        super(...arguments);
        /**
         * Sensing event
         */
        this.onSensorEvent = null;
        this.NOTIFY_MODE_MIN_ = Brightness.NotifyMode.STOP;
        this.NOTIFY_MODE_MAX_ = Brightness.NotifyMode.STOP +
            Brightness.NotifyMode.UPDATE_PROXIMITY +
            Brightness.NotifyMode.UPDATE_BRIGHTNESS +
            Brightness.NotifyMode.ONCE +
            Brightness.NotifyMode.ALWAYS;
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
        this.LX_ = 10;
    }
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name, opt_serialnumber = '') {
        return super.isMESHblock(name, opt_serialnumber)
            ? (name === null || name === void 0 ? void 0 : name.indexOf('MESH-100PA')) !== -1
            : false;
    }
    /**
     * notify
     *
     * @param data
     * @returns void
     */
    notify(data) {
        super.notify(data);
        if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_) {
            return;
        }
        if (data[this.EVENT_TYPE_ID_INDEX] !== this.EVENT_TYPE_ID_) {
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
     * Create command of set-mode
     *
     * @param notifyMode
     * @param opt_requestId
     * @returns command
     */
    createSetmodeCommand(notifyMode, opt_requestId = 0) {
        // Error Handle
        this.checkRange(notifyMode, this.NOTIFY_MODE_MIN_, this.NOTIFY_MODE_MAX_, 'notifyMode');
        // Generate Command
        const HEADER = [
            this.MESSAGE_TYPE_ID_,
            this.EVENT_TYPE_ID_,
            opt_requestId,
        ];
        const FIXED = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2];
        const data = HEADER.concat(FIXED).concat(notifyMode);
        data.push(this.checkSum(data));
        return data;
    }
}
exports.Brightness = Brightness;
// Constant Values
Brightness.NotifyMode = {
    STOP: 0,
    UPDATE_PROXIMITY: 4,
    UPDATE_BRIGHTNESS: 8,
    ONCE: 16,
    ALWAYS: 32,
};
