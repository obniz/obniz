"use strict";
/**
 * @packageDocumentation
 * @module Parts.TR4A
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
/** Tr4A series management class Tr4Aシリーズを管理するクラス */
class Tr4A {
    constructor() {
        // local name adv is exist, but cannot use for filter
        // .groupStart('localName')
        // .groupEnd();
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'TR4A',
        };
    }
    /**
     * Verify that the received peripheral is from the Tr4A
     *
     * 受け取ったPeripheralがTr4Aのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Tr4A
     *
     * Tr4Aかどうか
     */
    static isDevice(peripheral) {
        var _a;
        if (!((_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.startsWith('TR4'))) {
            return false;
        }
        return Tr4A._deviceAdvAnalyzer.validate(peripheral.adv_data);
    }
    /**
     * Get a data from the Tr4A
     *
     * Tr4Aからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Tr4A Tr4Aから受け取ったデータ
     *
     * ```
     * {
     *
     * temperature: temperature 温度 (Unit 単位: 0.1 degC)
     * humidity?: Humidity 湿度 (Unit 単位: 0.1 percent);
     * }
     * ```
     */
    static getData(peripheral) {
        if (!Tr4A.isDevice(peripheral)) {
            return null;
        }
        const measureData = Tr4A._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'measureData');
        if (!measureData) {
            return null;
        }
        if (measureData[0] === 0xee && measureData[1] === 0xee) {
            // sensor error
            return null;
        }
        const temperatureRaw = Buffer.from(measureData).readInt16LE(0);
        const measureData2 = Tr4A._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'measureData2');
        if (!measureData2) {
            return {
                temperature: (temperatureRaw - 1000) / 10,
            };
        }
        if (measureData2[0] === 0x00 && measureData2[1] === 0x00) {
            return {
                temperature: (temperatureRaw - 1000) / 10,
            };
        }
        const humidityRaw = Buffer.from(measureData2).readInt16LE(0);
        return {
            temperature: (temperatureRaw - 1000) / 10,
            humidity: (humidityRaw - 1000) / 10,
        };
    }
}
exports.default = Tr4A;
Tr4A._deviceAdvAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x02, 0x01, 0x06])
    .groupStart('manufacture')
    .addTarget('length', [0x05])
    .addTarget('type', [0x05])
    .addTargetByLength('uuid', 4)
    .addTarget('length2', [0x15])
    .addTarget('type2', [0xff])
    .addTarget('companyId', [0x92, 0x03])
    .addTargetByLength('deviceSerial', 4)
    .addTarget('operationCode', [0x00])
    .addTarget('count', [-1])
    .addTarget('statusCode1', [-1])
    .addTarget('statusCode2', [-1])
    .addTarget('measureData', [-1, -1])
    .addTarget('measureData2', [-1, -1])
    .addTargetByLength('reserved', 6) // from datasheet length=14, but device send length=13
    .groupEnd();
