"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
class IBS03TP {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "iBS03TP",
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
        if (!IBS03TP.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            button: false,
            moving: false,
            hall_sensor: false,
            temperature: ObnizPartsBleInterface_1.default.signed16FromBinary(peripheral.adv_data[13], peripheral.adv_data[12]) * 0.01,
            probe_temperature: ObnizPartsBleInterface_1.default.signed16FromBinary(peripheral.adv_data[15], peripheral.adv_data[14]) * 0.01,
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
        return data;
    }
}
exports.default = IBS03TP;
IBS03TP.deviceAdv = [
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
    0x17,
    -1,
    -1,
    -1,
];
