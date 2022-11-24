"use strict";
/**
 * @packageDocumentation
 * @module Parts.INKBIRD
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
/** INKBIRD series management class INKBIRDシリーズを管理するクラス */
class INKBIRD {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'INKBIRD',
        };
    }
    /**
     * Verify that the received peripheral is from the INKBIRD
     *
     * 受け取ったPeripheralがINKBIRDのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the INKBIRD
     *
     * INKBIRDかどうか
     */
    static isDevice(peripheral) {
        if (peripheral.scan_resp) {
            return INKBIRD._deviceScanResponseAnalyzer.validate(peripheral.scan_resp);
        }
        else {
            return false;
        }
    }
    /**
     * Get a data from the INKBIRD
     *
     * INKBIRDからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the INKBIRD INKBIRDから受け取ったデータ
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
        if (!INKBIRD.isDevice(peripheral)) {
            return null;
        }
        if (!peripheral.scan_resp) {
            return null;
        }
        const temperature = INKBIRD._deviceScanResponseAnalyzer.getData(peripheral.scan_resp, 'scanData', 'temperature');
        if (!temperature) {
            return null;
        }
        const temperatureRaw = Buffer.from(temperature).readInt16LE(0);
        const humidity = INKBIRD._deviceScanResponseAnalyzer.getData(peripheral.scan_resp, 'scanData', 'humidity');
        if (!humidity) {
            return null;
        }
        const humidityRaw = Buffer.from(humidity).readInt16LE(0);
        return {
            temperature: temperatureRaw / 100,
            humidity: humidityRaw / 100,
        };
    }
}
exports.default = INKBIRD;
INKBIRD._deviceScanResponseAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .groupStart('scanData')
    .addTarget('length2', [0x04])
    .addTarget('type2', [0x09])
    .addTarget('deviceName', [0x73, 0x70, 0x73])
    .addTarget('dataLength', [0x0a])
    .addTarget('dataType', [0xff])
    .addTargetByLength('temperature', 2)
    .addTargetByLength('humidity', 2)
    .addTargetByLength('proveType', 1)
    .addTargetByLength('crc', 2)
    .addTargetByLength('battery', 1)
    .addTargetByLength('reserved', 1)
    .groupEnd();
