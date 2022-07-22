"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
class MeshJsBu extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // event handler
        this.onSinglePressed = null;
        this.onLongPressed = null;
        this.onDoublePressed = null;
        this.DataLength = 4;
        this.MessageTypeID = 1;
        this.EventTypeID = 0;
        this.Type = { SINGLE: 1, LONG: 2, DOUBLE: 3 };
    }
    notify(data) {
        super.notify(data);
        if (data.length !== this.DataLength) {
            return;
        }
        if (data[0] !== this.MessageTypeID) {
            return;
        }
        if (data[1] !== this.EventTypeID) {
            return;
        }
        switch (data[2]) {
            case this.Type.SINGLE:
                if (typeof this.onSinglePressed === 'function') {
                    this.onSinglePressed();
                }
                break;
            case this.Type.LONG:
                if (typeof this.onLongPressed === 'function') {
                    this.onLongPressed();
                }
                break;
            case this.Type.DOUBLE:
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
