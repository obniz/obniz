"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS04 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "iBS04",
        };
    }
    static isDevice(peripheral) {
        if (this.deviceAdv.length > peripheral.adv_data.length) {
            return false;
        }
        for (let index = 0; index < this.deviceAdv.length; index++) {
            if (this.deviceAdv[index] === -1) {
                continue;
            }
            if (peripheral.adv_data[index] === this.deviceAdv[index]) {
                continue;
            }
            return false;
        }
        return true;
    }
    static getData(peripheral) {
        if (!IBS04.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            button: false,
        };
        if (Boolean(peripheral.adv_data[11] & 0b0001)) {
            data.button = true;
        }
        return data;
    }
}
exports.default = IBS04;
IBS04.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x0d,
    0x00,
    0x83,
    0xbc,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0x19,
    -1,
    -1,
    -1,
];
