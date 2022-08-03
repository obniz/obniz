"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
class Move extends Base_1.Base {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onTapped = null;
        this.onShaked = null;
        this.onFlipped = null;
        this.onOrientationChanged = null;
        this.accele = { x: 0, y: 0, z: 0 };
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
        // update accele values
        const BYTE = 256;
        const BASE = 1024;
        this.accele.x = this.complemnt_(BYTE * data[5] + data[4]) / BASE;
        this.accele.y = this.complemnt_(BYTE * data[7] + data[6]) / BASE;
        this.accele.z = this.complemnt_(BYTE * data[9] + data[8]) / BASE;
        // emit event
        switch (data[1]) {
            case this.TAP_EVENT_ID_:
                if (typeof this.onTapped === 'function') {
                    this.onTapped(this.accele);
                }
                break;
            case this.SHAKE_EVENT_ID_:
                if (typeof this.onShaked === 'function') {
                    this.onShaked(this.accele);
                }
                break;
            case this.FLIP_EVENT_ID_:
                if (typeof this.onFlipped === 'function') {
                    this.onFlipped(this.accele);
                }
                break;
            case this.ORIENTATION_EVENT_ID_:
                if (typeof this.onOrientationChanged === 'function') {
                    const face = data[2];
                    this.onOrientationChanged(face, this.accele);
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
exports.Move = Move;
