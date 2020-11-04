"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IBS01 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "iBS01",
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
        return (peripheral.adv_data[12] === 0xff &&
            peripheral.adv_data[13] === 0xff &&
            peripheral.adv_data[14] === 0xff &&
            peripheral.adv_data[15] === 0xff);
    }
    static getData(peripheral) {
        if (!IBS01.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            button: false,
            moving: false,
            hall_sensor: false,
            fall: false,
        };
        if (Boolean(peripheral.adv_data[11] & 0b0001)) {
            data.button = true;
        }
        if (Boolean(peripheral.adv_data[11] & 0b0010)) {
            data.moving = true;
        }
        if (Boolean(peripheral.adv_data[11] & 0b0100)) {
            data.hall_sensor = true;
        }
        if (Boolean(peripheral.adv_data[11] & 0b1000)) {
            data.fall = true;
        }
        return data;
    }
}
exports.default = IBS01;
IBS01.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x59,
    0x00,
    0x80,
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
    -1,
    -1,
    -1,
    -1,
];
