"use strict";
/**
 * @packageDocumentation
 * @module Parts.TM551
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
class TM551 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "TM551",
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
        if (!TM551.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: peripheral.adv_data[13],
            x: peripheral.adv_data[14] + ObnizPartsBleInterface_1.default.readFraction(peripheral.adv_data[15]),
            y: peripheral.adv_data[16] + ObnizPartsBleInterface_1.default.readFraction(peripheral.adv_data[17]),
            z: peripheral.adv_data[18] + ObnizPartsBleInterface_1.default.readFraction(peripheral.adv_data[19]),
        };
        return data;
    }
}
exports.default = TM551;
TM551.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x03,
    0x03,
    0xe1,
    0xff,
    -1,
    -1,
    -1,
    -1,
    0xa1,
    0x03,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
];
