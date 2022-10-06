"use strict";
/**
 * @packageDocumentation
 * @module Parts.RTR500B
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
/** Tr4 series management class RTR500Bシリーズを管理するクラス */
class RTR500B {
    constructor() {
        // local name adv is exist, but cannot use for filter
        // .groupStart('localName')
        // .groupEnd();
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'RTR500B',
        };
    }
    /**
     * Verify that the received peripheral is from the RTR500B
     *
     * 受け取ったPeripheralがRTR500Bのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the RTR500B
     *
     * RTR500Bかどうか
     */
    static isDevice(peripheral) {
        var _a;
        if (!((_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.startsWith('RTR'))) {
            return false;
        }
        return RTR500B._deviceAdvAnalyzer.validate(peripheral.adv_data);
    }
    /**
     * Get a data from the RTR500B
     *
     * Tr4からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the RTR500B RTR500Bから受け取ったデータ
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
        if (!RTR500B.isDevice(peripheral)) {
            return null;
        }
        const measureData = RTR500B._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'measureData');
        if (!measureData) {
            return null;
        }
        if (measureData[0] === 0xee && measureData[1] === 0xee) {
            // sensor error
            return null;
        }
        const temperatureRaw = Buffer.from(measureData).readInt16LE(0);
        const measureData2 = RTR500B._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'measureData2');
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
exports.default = RTR500B;
RTR500B._deviceAdvAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x02, 0x01, 0x06])
    .groupStart('manufacture')
    .addTarget('length', [0x05])
    .addTarget('type', [0x05])
    .addTargetByLength('uuid', 4)
    .addTarget('length2', [0x15])
    .addTarget('type2', [0xff])
    .addTarget('companyId', [0x92, 0x03])
    .addTargetByLength('deviceSerial', 4)
    .addTarget('operationCode', [-1])
    .addTarget('statusCode1', [-1])
    .addTarget('statusCode2', [-1])
    .addTarget('statusCode3', [-1])
    .addTarget('measureData', [-1, -1])
    .addTarget('measureData2', [-1, -1])
    .addTargetByLength('reserved', 6) // from datasheet length=14, but device send length=13
    .groupEnd();
