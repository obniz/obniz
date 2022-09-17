"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const Base_1 = require("./Base");
class Button extends Base_1.Base {
    constructor() {
        super(...arguments);
        /**
         * Single pressed event
         */
        this.onSinglePressed = null;
        /**
         * Long pressed event
         */
        this.onLongPressed = null;
        /**
         * Double pressed event
         */
        this.onDoublePressed = null;
        // Constant Values
        this.DATA_LENGTH_ = 4;
        this.TYPE_INDEX_ = 2;
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
        this.TYPE_ = {
            SINGLE: 1,
            LONG: 2,
            DOUBLE: 3,
        };
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
            ? (name === null || name === void 0 ? void 0 : name.indexOf('MESH-100BU')) !== -1
            : false;
    }
    /**
     * Parse data that received from MESH block, and emit event
     *
     * @param data
     * @returns
     */
    notify(data) {
        super.notify(data);
        if (data.length !== this.DATA_LENGTH_) {
            return;
        }
        if (data[this.MESSAGE_TYPE_ID_INDEX] !== this.MESSAGE_TYPE_ID_) {
            return;
        }
        if (data[this.EVENT_TYPE_ID_INDEX] !== this.EVENT_TYPE_ID_) {
            return;
        }
        switch (data[this.TYPE_INDEX_]) {
            case this.TYPE_.SINGLE:
                if (typeof this.onSinglePressed === 'function') {
                    this.onSinglePressed();
                }
                break;
            case this.TYPE_.LONG:
                if (typeof this.onLongPressed === 'function') {
                    this.onLongPressed();
                }
                break;
            case this.TYPE_.DOUBLE:
                if (typeof this.onDoublePressed === 'function') {
                    this.onDoublePressed();
                }
                break;
            default:
                break;
        }
    }
}
exports.Button = Button;
