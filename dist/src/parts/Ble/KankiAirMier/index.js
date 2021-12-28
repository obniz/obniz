"use strict";
/**
 * @packageDocumentation
 * @module Parts.KankiAirMier
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
/** Kanki AirMier management class 換気エアミエルを管理するクラス */
class KankiAirMier {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'KankiAirMier',
        };
    }
    /**
     * Verify that the received peripheral is from the Kanki AirMier
     *
     * 受け取ったPeripheralが換気エアミエルのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Kanki AirMier
     *
     * 換気エアミエルかどうか
     */
    static isDevice(peripheral) {
        return KankiAirMier._deviceAdvAnalyzer.validate(peripheral.adv_data);
    }
    /**
     * Get a data from the Kanki AirMier
     *
     * 換気エアミエルからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Kanki AirMier 換気エアミエルから受け取ったデータ
     */
    static getData(peripheral) {
        if (!KankiAirMier.isDevice(peripheral)) {
            return null;
        }
        const allData = KankiAirMier._deviceAdvAnalyzer.getAllData(peripheral.adv_data);
        const temperatureRaw = Buffer.from(allData.manufacture.temperature).readInt16LE(0);
        const co2Raw = Buffer.from(allData.manufacture.co2).readInt16LE(0);
        const humidityRaw = Buffer.from(allData.manufacture.humidity).readInt16LE(0);
        const sequenceNumber = allData.manufacture.sequence[0] >> 5;
        const deviceName = Buffer.from(allData.manufacture.deviceName).toString('utf8');
        return {
            co2: co2Raw,
            temperature: temperatureRaw / 10,
            humidity: humidityRaw / 10,
            sequenceNumber,
            deviceName,
        };
    }
}
exports.default = KankiAirMier;
KankiAirMier._deviceAdvAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .groupStart('manufacture')
    .addTarget('length', [0x1e])
    .addTarget('type', [0xff])
    .addTarget('companyId', [0x9e, 0x09])
    .addTarget('appearance', [0x01])
    .addTarget('co2', [-1, -1])
    .addTarget('temperature', [-1, -1])
    .addTarget('humidity', [-1, -1])
    .addTarget('battery', [0xfe])
    .addTarget('interval', [0x02, 0x00])
    .addTarget('sequence', [-1])
    .addTarget('firmwareVersion', [-1])
    .addTargetByLength('deviceName', 15) // from datasheet length=14, but device send length=13
    .groupEnd();
