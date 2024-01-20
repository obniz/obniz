"use strict";
/**
 * @packageDocumentation
 * @module Parts.TR7
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
/**
 * Class that manages TR7 series.
 *
 * TR7シリーズを管理するクラス。
 */
class TR7 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'TR7',
        };
    }
    /**
     * Verify that the received peripheral is from the TR7.
     *
     * 受け取ったPeripheralがTR7シリーズのものかどうかを確認する。
     *
     * @param peripheral Instance of BleRemotePeripheral. BleRemotePeripheralのインスタンス。
     *
     * @returns Whether it is the TR7 or not. TR7かどうか。
     *
     */
    static isDevice(peripheral) {
        return this._deviceAdvAnalyzer.validate(peripheral.adv_data);
    }
    /**
     * Get data from TR7 series.
     *
     * T7シリーズからデータを取得。
     *
     * @param peripheral Instance of BleRemotePeripheral. BleRemotePeripheralのインスタンス。
     *
     * @returns Data recieved from TR7. TR7から受け取ったデータ。
     *
     * ```
     * {
     *    deviceSerial: デバイスシリアル
     *    controlCode: コントロールコード
     *    counter: カウンタ
     *    statusCode1: ステータスコード1
     *    statusCode2: ステータスコード2
     *    temperature: temperature 温度 (Unit: 0.1 degC)
     *    humidity: humidity 湿度 (Unit: 0.1 %)
     * }
     * ```
     */
    static getData(peripheral) {
        if (!this.isDevice(peripheral))
            return null;
        const deviceSerialBytes = this._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'deviceSerial');
        const controlCodeBytes = this._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'controlCode');
        const counterBytes = this._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'counter');
        const statusCode1Bytes = this._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'statusCode1');
        const statusCode2Bytes = this._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'statusCode2');
        const temperatureBytes = this._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'measuredDataCh1');
        const humidityBytes = this._deviceAdvAnalyzer.getData(peripheral.adv_data, 'manufacture', 'measuredDataCh2');
        if (!deviceSerialBytes ||
            !controlCodeBytes ||
            !counterBytes ||
            !statusCode1Bytes ||
            !statusCode2Bytes ||
            !temperatureBytes ||
            !humidityBytes) {
            return null;
        }
        let temperature = null;
        if ((temperatureBytes === null || temperatureBytes === void 0 ? void 0 : temperatureBytes[0]) !== 0xee || (temperatureBytes === null || temperatureBytes === void 0 ? void 0 : temperatureBytes[1]) !== 0xee) {
            // NOTE: Document says we have to do this mathmatics.
            temperature = (Buffer.from(temperatureBytes).readInt16LE(0) - 1000) / 10;
        }
        let humidity = null;
        if ((humidityBytes === null || humidityBytes === void 0 ? void 0 : humidityBytes[0]) !== 0xee || (humidityBytes === null || humidityBytes === void 0 ? void 0 : humidityBytes[1]) !== 0xee) {
            // NOTE: Document says we have to do this mathmatics.
            humidity = (Buffer.from(humidityBytes).readInt16LE(0) - 1000) / 10;
        }
        return {
            deviceSerial: Buffer.from(deviceSerialBytes).toString('hex'),
            controlCode: controlCodeBytes[0],
            counter: counterBytes[0],
            statusCode1: statusCode1Bytes[0],
            statusCode2: statusCode2Bytes[0],
            temperature,
            humidity,
        };
    }
}
exports.default = TR7;
TR7._deviceAdvAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .addTarget('flags', [0x02, 0x01, 0x06]) // NOTE: length, ad type, ad data
    .addTarget('32bitServiceUuids', [0x05, 0x05, 0x0a, 0x18, 0x00, 0x00]) // NOTE: little endian
    .groupStart('manufacture')
    .addTarget('length', [0x15])
    .addTarget('type', [0xff])
    .addTarget('companyId', [0x92, 0x03]) // NOTE: little endian
    .addTargetByLength('deviceSerial', 4)
    .addTargetByLength('controlCode', 1)
    .addTargetByLength('counter', 1)
    .addTargetByLength('statusCode1', 1)
    .addTargetByLength('statusCode2', 1)
    .addTargetByLength('measuredDataCh1', 2)
    .addTargetByLength('measuredDataCh2', 2)
    .addTargetByLength('spare', 4)
    .addTargetByLength('unused', 2)
    .groupEnd();
