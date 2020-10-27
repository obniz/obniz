"use strict";
/**
 * @packageDocumentation
 * @module Parts.TM530
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
class TM530 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "TM530",
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
        if (!TM530.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: peripheral.adv_data[13],
            temperature: peripheral.adv_data[14] + ObnizPartsBleInterface_1.default.readFraction(peripheral.adv_data[15]),
            humidity: peripheral.adv_data[16] + ObnizPartsBleInterface_1.default.readFraction(peripheral.adv_data[17]),
        };
        return data;
    }
}
exports.default = TM530;
TM530.deviceAdv = [
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
    -1,
    0x01,
    -1,
    -1,
    -1,
    -1,
    -1,
];
