"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
const Base_1 = require("./Base");
class Move extends Base_1.Base {
    constructor() {
        super(...arguments);
        /**
         * Tapped event
         */
        this.onTapped = null;
        /**
         * Shaked event
         */
        this.onShaked = null;
        /**
         * Flipped event
         */
        this.onFlipped = null;
        /**
         * Orientation changed event
         */
        this.onOrientationChanged = null;
        this.accele = { x: 0, y: 0, z: 0 };
        // Constant Values
        this.TYPE_INDEX_ = 1;
        this.MESSAGE_TYPE_ID_ = 1;
        this.DATA_LENGTH_ = 17;
        this.TAP_EVENT_ID_ = 0;
        this.SHAKE_EVENT_ID_ = 1;
        this.FLIP_EVENT_ID_ = 2;
        this.ORIENTATION_EVENT_ID_ = 3;
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
            ? (name === null || name === void 0 ? void 0 : name.indexOf('MESH-100AC')) !== -1
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
        // update accele values
        const BYTE = 256;
        const BASE = 1024;
        this.accele.x = this.complemnt(BYTE * data[5] + data[4]) / BASE;
        this.accele.y = this.complemnt(BYTE * data[7] + data[6]) / BASE;
        this.accele.z = this.complemnt(BYTE * data[9] + data[8]) / BASE;
        // emit event
        switch (data[this.TYPE_INDEX_]) {
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
}
exports.Move = Move;
