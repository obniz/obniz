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
        this.onDirection = null;
        // Constant Values
        this.MESSAGE_TYPE_ID_ = 1;
        this.DATA_LENGTH_ = 17;
        this.TAP_EVENT_ID_ = 0;
        this.SHAKE_EVENT_ID_ = 1;
        this.FLIP_EVENT_ID_ = 2;
        this.DIRECTION_EVENT_ID_ = 3;
        this.accele_ = { x: -1, y: -1, z: -1 };
        this.face_ = -1;
    }
    get getAccele() {
        return this.accele_;
    }
    get getFace() {
        return this.face_;
    }
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data) {
        super.notify(data);
        this.updateAccele_(data);
        if (data[0] !== 1) {
            return;
        }
        switch (data[1]) {
            case this.TAP_EVENT_ID_:
                if (typeof this.onTapped === 'function') {
                    this.onTapped(this.accele_);
                }
                break;
            case this.SHAKE_EVENT_ID_:
                if (typeof this.onShaked === 'function') {
                    this.onShaked(this.accele_);
                }
                break;
            case this.FLIP_EVENT_ID_:
                if (typeof this.onFlipped === 'function') {
                    this.onFlipped(this.accele_);
                }
                break;
            case this.DIRECTION_EVENT_ID_:
                if (typeof this.onDirection === 'function') {
                    this.face_ = data[2];
                    this.onDirection(this.face_, this.accele_);
                }
                break;
            default:
                break;
        }
    }
    updateAccele_(data) {
        if (data.length !== this.DATA_LENGTH_) {
            return false;
        }
        if (data[0] !== this.MESSAGE_TYPE_ID_) {
            return false;
        }
        const BYTE = 256;
        const BASE = 1024;
        this.accele_.x = this.complemnt_(BYTE * data[5] + data[4]) / BASE;
        this.accele_.y = this.complemnt_(BYTE * data[7] + data[6]) / BASE;
        this.accele_.z = this.complemnt_(BYTE * data[9] + data[8]) / BASE;
        return true;
    }
    complemnt_(val) {
        const TWO_BYTE = 65536;
        const TWO_BYTE_HALF = Math.floor(TWO_BYTE / 2) - 1;
        return val - (val > TWO_BYTE_HALF ? TWO_BYTE : 0);
    }
}
exports.MeshJsAc = MeshJsAc;
