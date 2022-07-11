"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MESH_js_BU extends _1.MESH_js {
    constructor() {
        super(...arguments);
        // event handler
        this.onSinglePressed = null;
        this.onLongPressed = null;
        this.onDoublePressed = null;
        this.DATA_LENGTH = 4;
        this.MessageTypeID = 1;
        this.EventTypeID = 0;
        this.TYPE = { SINGLE: 1, LONG: 2, DOUBLE: 3 };
    }
    notify(data) {
        super.notify(data);
        if (data.length !== this.DATA_LENGTH) {
            return;
        }
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        if (data[1] !== this.EventTypeID) {
            return;
        }
        switch (data[2]) {
            case this.TYPE.SINGLE:
                if (typeof this.onSinglePressed === 'function') {
                    this.onSinglePressed();
                }
                break;
            case this.TYPE.LONG:
                if (typeof this.onLongPressed === 'function') {
                    this.onLongPressed();
                }
                break;
            case this.TYPE.DOUBLE:
                if (typeof this.onDoublePressed === 'function') {
                    this.onDoublePressed();
                }
                break;
            default:
                break;
        }
    }
}
exports.MESH_js_BU = MESH_js_BU;
