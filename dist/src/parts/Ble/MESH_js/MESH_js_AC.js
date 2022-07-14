"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MESH_js_AC extends _1.MESH_js {
    constructor() {
        super(...arguments);
        /**
         * MessageTypeID
         * command header
         */
        this.MessageTypeID = 1;
        this.accele = { x: -1, y: -1, z: -1 };
        this.face = -1;
        this.DATA_LENGTH = 17;
        // event handler
        this.onTapped = null;
        this.onShaked = null;
        this.onFlipped = null;
        this.onDirection = null;
    }
    notify(data) {
        super.notify(data);
        this.updateAccele(data);
        if (data[0] !== 1) {
            return;
        }
        switch (data[1]) {
            case 0: // Tap
                if (typeof this.onTapped === 'function') {
                    this.onTapped(this.accele);
                }
                break;
            case 1: // Shake
                if (typeof this.onShaked === 'function') {
                    this.onShaked(this.accele);
                }
                break;
            case 2: // Flip
                if (typeof this.onFlipped === 'function') {
                    this.onFlipped(this.accele);
                }
                break;
            case 3: // Direction
                if (typeof this.onDirection === 'function') {
                    this.face = data[2];
                    this.onDirection(this.face, this.accele);
                }
                break;
            default:
                break;
        }
    }
    get getAccele() {
        return this.accele;
    }
    get getFace() {
        return this.face;
    }
    /**
     * setMode
     *
     * @param type
     * @returns
     */
    //   public parseSetmodeCommand(
    //     event: number,
    //     mode: number,
    //     requestId = 0
    //   ): number[] {
    //     const HEADER: number[] = [this.MessageTypeID, 1, requestId];
    //     const data: number[] = HEADER.concat(event).concat(mode);
    //     data.push(this.checkSum(data));
    //     console.log('setMode: ' + data);
    //     return data;
    //   }
    updateAccele(data) {
        if (data.length !== this.DATA_LENGTH) {
            return false;
        }
        if (data[0] !== 1) {
            return false;
        }
        this.accele.x = this.complemnt(256 * data[5] + data[4]) / 1024;
        this.accele.y = this.complemnt(256 * data[7] + data[6]) / 1024;
        this.accele.z = this.complemnt(256 * data[9] + data[8]) / 1024;
        return true;
        // 922-1126
    }
    complemnt(val) {
        return val - (val > 32767 ? 65536 : 0);
    }
}
exports.MESH_js_AC = MESH_js_AC;
