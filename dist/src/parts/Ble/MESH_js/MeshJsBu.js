"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
class MeshJsBu extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onSinglePressed = null;
        this.onLongPressed = null;
        this.onDoublePressed = null;
        // Constant Values
        this.DATA_LENGTH_ = 4;
        this.MESSAGE_TYPE_ID_ = 1;
        this.EVENT_TYPE_ID_ = 0;
        this.TYPE_ = {
            SINGLE: 1,
            LONG: 2,
            DOUBLE: 3,
        };
    }
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data) {
        super.notify(data);
        if (data.length !== this.DATA_LENGTH_) {
            return;
        }
        if (data[0] !== this.MESSAGE_TYPE_ID_) {
            return;
        }
        if (data[1] !== this.EVENT_TYPE_ID_) {
            return;
        }
        switch (data[2]) {
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
exports.MeshJsBu = MeshJsBu;
