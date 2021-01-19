"use strict";
/**
 * @packageDocumentation
 * @module Parts.MINEW_S1_HT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../../../obniz/libs/utils/util"));
class MINEW_S1 {
    constructor() {
        this._peripheral = null;
        // non-wired device
        this.keys = [];
        this.requiredKeys = [];
        this.params = {};
    }
    static info() {
        return { name: "MINEW_S1" };
    }
    static isDevice(peripheral, macAddress = null) {
        if (!this._hasPrefix(peripheral)) {
            return false;
        }
        if (macAddress) {
            const data = this.getInfoData(peripheral) || this.getHTData(peripheral);
            if (data && data.macAddress === macAddress) {
                return true;
            }
            return false;
        }
        return true;
    }
    static getInfoData(peripheral) {
        if (!this._hasPrefix(peripheral)) {
            return null;
        }
        if (!peripheral.adv_data || peripheral.adv_data.length < 20) {
            return null;
        }
        const frameType = peripheral.adv_data[11];
        const versionNumber = peripheral.adv_data[12];
        if (frameType !== 0xa1 || versionNumber !== 0x08) {
            return null;
        }
        const batteryLevel = peripheral.adv_data[13];
        const macAddress = peripheral.adv_data
            .slice(14, 20)
            .map((e) => ("0" + e.toString(16)).slice(-2))
            .join("")
            .match(/.{1,2}/g)
            .reverse()
            .join("");
        const name = util_1.default.dataArray2string(peripheral.adv_data.slice(20));
        return {
            frameType,
            versionNumber,
            batteryLevel,
            name,
            macAddress,
        };
    }
    static getHTData(peripheral) {
        if (!this._hasPrefix(peripheral)) {
            return null;
        }
        if (!peripheral.adv_data || peripheral.adv_data.length !== 24) {
            return null;
        }
        const frameType = peripheral.adv_data[11];
        const versionNumber = peripheral.adv_data[12];
        if (frameType !== 0xa1 || versionNumber !== 0x01) {
            return null;
        }
        const batteryLevel = peripheral.adv_data[13];
        const temperatureH = peripheral.adv_data[14];
        const temperatureL = peripheral.adv_data[15];
        const temperature = temperatureH + (temperatureL * 1) / (1 << 8);
        const humidityH = peripheral.adv_data[16];
        const humidityL = peripheral.adv_data[17];
        const humidity = humidityH + (humidityL * 1) / (1 << 8);
        const macAddress = peripheral.adv_data
            .splice(18)
            .map((e) => ("0" + e.toString(16)).slice(-2))
            .join("")
            .match(/.{1,2}/g)
            .reverse()
            .join("");
        return {
            frameType,
            versionNumber,
            batteryLevel,
            temperature,
            humidity,
            macAddress,
        };
    }
    static _hasPrefix(peripheral) {
        if (!peripheral.adv_data || peripheral.adv_data.length < 10) {
            return false;
        }
        const target = [
            // flag
            0x02,
            0x01,
            0x06,
            // 16bit uuid
            0x03,
            0x03,
            0xe1,
            0xff,
            // service data
            -1,
            0x16,
            0xe1,
            0xff,
        ];
        for (const index in target) {
            if (target[index] >= 0 && target[index] !== peripheral.adv_data[index]) {
                return false;
            }
        }
        return true;
    }
    wired(obniz) { }
}
exports.default = MINEW_S1;
