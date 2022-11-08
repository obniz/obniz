"use strict";
/**
 * @packageDocumentation
 * @module Parts.IBS_TH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
/** IBS_TH management class IBS_THを管理するクラス */
class IBS_TH {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'IBS_TH',
        };
    }
    static isDevice(peripheral) {
        return peripheral.localName === 'sps' || peripheral.localName === 'tst';
    }
    static getData(peripheral) {
        if (!this.isDevice(peripheral)) {
            return null;
        }
        const allData = this._deviceAdvAnalyzer.getAllData(peripheral.manufacturerSpecificData);
        const temperatureRaw = Buffer.from(allData.manufacture.temperature).readInt16LE(0);
        const humidityRaw = Buffer.from(allData.manufacture.humidity).readInt16LE(0);
        const batteryRaw = Buffer.from(allData.manufacture.battery).readInt8(0);
        return {
            temperature: temperatureRaw / 100,
            humidity: humidityRaw / 100,
            battery: batteryRaw,
        };
    }
}
exports.default = IBS_TH;
IBS_TH._deviceAdvAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .groupStart('manufacture')
    .addTarget('temperature', [-1, -1])
    .addTarget('humidity', [-1, -1])
    .addTarget('probeTags', [-1])
    .addTarget('crc', [-1, -1])
    .addTarget('battery', [-1])
    .addTarget('testData', [-1])
    .groupEnd();
