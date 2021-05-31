"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
class IBS01T {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS01T',
        };
    }
    static isDevice(peripheral, strictCheck = false) {
        const deviceAdv = [...this.deviceAdv];
        if (strictCheck) {
            deviceAdv[18] = 0x05;
        }
        if (deviceAdv.length > peripheral.adv_data.length) {
            return false;
        }
        for (let index = 0; index < deviceAdv.length; index++) {
            if (deviceAdv[index] === -1) {
                continue;
            }
            if (peripheral.adv_data[index] === deviceAdv[index]) {
                continue;
            }
            return false;
        }
        return !(peripheral.adv_data[12] === 0xff &&
            peripheral.adv_data[13] === 0xff &&
            peripheral.adv_data[14] === 0xff &&
            peripheral.adv_data[15] === 0xff);
    }
    static getData(peripheral, strictCheck) {
        if (!IBS01T.isDevice(peripheral, strictCheck)) {
            return null;
        }
        const d = {
            button: false,
            moving: false,
            reed: false,
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            temperature: ObnizPartsBleInterface_1.default.signed16FromBinary(peripheral.adv_data[13], peripheral.adv_data[12]) * 0.01,
            humidity: ObnizPartsBleInterface_1.default.signed16FromBinary(peripheral.adv_data[15], peripheral.adv_data[14]),
        };
        if (peripheral.adv_data[11] & 0b0001) {
            d.button = true;
        }
        if (peripheral.adv_data[11] & 0b0010) {
            d.moving = true;
        }
        if (peripheral.adv_data[11] & 0b0100) {
            d.reed = true;
        }
        return d;
    }
}
exports.default = IBS01T;
IBS01T.deviceAdv = [
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
