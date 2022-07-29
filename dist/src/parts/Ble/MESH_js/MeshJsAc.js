"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
class MeshJsAc extends MeshJs_1.MeshJs {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onTapped = null;
        this.onShaked = null;
        this.onFlipped = null;
        this.onOrientation = null;
        // Constant Values
        this.MESSAGE_TYPE_ID_ = 1;
        this.DATA_LENGTH_ = 17;
        this.TAP_EVENT_ID_ = 0;
        this.SHAKE_EVENT_ID_ = 1;
        this.FLIP_EVENT_ID_ = 2;
        this.ORIENTATION_EVENT_ID_ = 3;
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
        const BYTE = 256;
        const BASE = 1024;
        const acceleX = this.complemnt_(BYTE * data[5] + data[4]) / BASE;
        const acceleY = this.complemnt_(BYTE * data[7] + data[6]) / BASE;
        const acceleZ = this.complemnt_(BYTE * data[9] + data[8]) / BASE;
        switch (data[1]) {
            case this.TAP_EVENT_ID_:
                if (typeof this.onTapped === 'function') {
                    this.onTapped(acceleX, acceleY, acceleZ);
                }
                break;
            case this.SHAKE_EVENT_ID_:
                if (typeof this.onShaked === 'function') {
                    this.onShaked(acceleX, acceleY, acceleZ);
                }
                break;
            case this.FLIP_EVENT_ID_:
                if (typeof this.onFlipped === 'function') {
                    this.onFlipped(acceleX, acceleY, acceleZ);
                }
                break;
            case this.ORIENTATION_EVENT_ID_:
                if (typeof this.onOrientation === 'function') {
                    const face = data[2];
                    this.onOrientation(face, acceleX, acceleY, acceleZ);
                }
                break;
            default:
                break;
        }
    }
    complemnt_(val) {
        const TWO_BYTE = 65536;
        const TWO_BYTE_HALF = Math.floor(TWO_BYTE / 2) - 1;
        return val - (val > TWO_BYTE_HALF ? TWO_BYTE : 0);
    }
}
exports.MeshJsAc = MeshJsAc;
