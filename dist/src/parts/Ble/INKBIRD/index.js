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
        // if (!peripheral.localName?.startsWith('sps')) {
        //   return false;
        // }
        // if (peripheral.localName?.startsWith('sps')) {
        //   console.log(peripheral);
        // }
        // console.log(INKBIRD._deviceAdvAnalyzer.validate(peripheral.adv_data));
        if (peripheral.adv_data && peripheral.scan_resp) {
            return INKBIRD._deviceAdvAnalyzer.validate([
                ...peripheral.adv_data,
                ...peripheral.scan_resp,
            ]);
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
        const temperature = INKBIRD._deviceAdvAnalyzer.getData([...peripheral.adv_data, ...peripheral.scan_resp], 'manufacture', 'temperature');
        if (!temperature) {
            return null;
        }
        const temperatureRaw = Buffer.from(temperature).readInt16LE(0);
        const humidity = INKBIRD._deviceAdvAnalyzer.getData([...peripheral.adv_data, ...peripheral.scan_resp], 'manufacture', 'humidity');
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
INKBIRD._deviceAdvAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x02, 0x01, 0x06])
    .groupStart('manufacture')
    .addTarget('length', [0x03])
    .addTarget('type', [0x02])
    .addTargetByLength('uuid', 2)
    .addTarget('length2', [0x04])
    .addTarget('type2', [0x09])
    .addTarget('deviceName', [0x73, 0x70, 0x73])
    .addTarget('dataLength', [0x0a])
    .addTarget('dataType', [0xff])
    .addTargetByLength('temperature', 2)
    .addTargetByLength('humidity', 2)
    .addTargetByLength('reserved', 5)
    .groupEnd();
