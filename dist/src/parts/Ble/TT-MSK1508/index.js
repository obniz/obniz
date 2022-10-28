"use strict";
/**
 * @packageDocumentation
 * @module Parts.TT_MSK1508
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const easy_crc_1 = require("easy-crc");
const advertismentAnalyzer_1 = require("../utils/advertisement/advertismentAnalyzer");
/** TT-MSK1508 management class TT-MSK1508を管理するクラス */
class TT_MSK1508 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'TT_MSK1508',
        };
    }
    /**
     * Verify that the received peripheral is from the TT-MSK1508
     *
     * 受け取ったPeripheralがTT-MSK1508のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the TT-MSK1508
     *
     * TT-MSK1508かどうか
     */
    static isDevice(peripheral) {
        return TT_MSK1508._deviceAdvAnalyzer.validate(peripheral.adv_data);
    }
    /**
     * Get a data from the TT-MSK1508
     *
     * TT-MSK1508からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the TT-MSK1508 TT-MSK1508から受け取ったデータ
     *
     * ```
     * {
     *
     * temperature: temperature 温度 (Unit 単位: 0.1 degC)
     *
     * }
     * ```
     */
    static getData(peripheral) {
        if (!TT_MSK1508.isDevice(peripheral)) {
            return null;
        }
        const manufacturerId = TT_MSK1508._deviceAdvAnalyzer.getData(peripheral.adv_data, 'originalData', 'manufacturerId');
        const sendData = TT_MSK1508._deviceAdvAnalyzer.getData(peripheral.adv_data, 'originalData', 'sendData');
        const receivedRawCrc = TT_MSK1508._deviceAdvAnalyzer.getData(peripheral.adv_data, 'originalData', 'crc16');
        if (!manufacturerId || !sendData || !receivedRawCrc) {
            return null;
        }
        const patientId = Number(Buffer.from(sendData.slice(0, 6)).toString('hex'));
        const operatingMode = sendData[6] & 0x03;
        const flowRateStatus = (sendData[6] >>> 2) & 0x03;
        const batteryStatus = (sendData[6] >>> 4) & 0x03;
        const model = (sendData[6] >>> 6) & 0x03;
        const totalDoseVolume = Buffer.from(sendData.slice(7, 9)).readUInt16LE(0);
        const totalDoseTime = Buffer.from(sendData.slice(9, 11)).readUInt16LE(0);
        const infusionType = sendData[11] & 0xc0;
        const sensorId = Number(Buffer.from(sendData.slice(12, 14)).toString('hex'));
        const error = sendData[14];
        const battery = sendData[15];
        const crcBeforeCalcData = Buffer.from([...manufacturerId, ...sendData]);
        const crc = (0, easy_crc_1.crc16)('X-25', crcBeforeCalcData);
        const receivedCrc = Buffer.from(receivedRawCrc).readUInt16LE(0);
        if (crc !== receivedCrc)
            return null;
        return {
            patientId,
            operatingMode: this.OperatingMode[operatingMode],
            flowRateStatus: this.FlowRateStatus[flowRateStatus],
            batteryStatus: this.BatteryStatus[batteryStatus],
            model: this.Model[model],
            totalDoseVolume,
            totalDoseTime,
            infusionType: this.InfusionType[infusionType],
            sensorId,
            errors: [this.Errors[error]],
            battery,
        };
    }
}
exports.default = TT_MSK1508;
TT_MSK1508.OperatingMode = {
    0: 'initial',
    2: 'dosing',
};
TT_MSK1508.FlowRateStatus = {
    0: 'standard',
    1: 'low',
    2: 'high',
    3: 'none',
};
TT_MSK1508.BatteryStatus = {
    0: 'standard',
    1: 'low',
};
TT_MSK1508.Model = {
    0: 'drip_navigation_sensor',
    1: 'auto_cremme',
};
TT_MSK1508.InfusionType = {
    0: '20drops/m',
};
TT_MSK1508.Errors = {
    0: 'drip_detection_error',
    1: 'device_internal_error',
};
TT_MSK1508._deviceAdvAnalyzer = new advertismentAnalyzer_1.BleAdvBinaryAnalyzer()
    .groupStart('flag')
    .addTarget('length', [0x02])
    .addTarget('adType', [0x01])
    .addTarget('data', [0x06])
    .groupEnd()
    .groupStart('originalData')
    .addTarget('length', [0x1a])
    .addTarget('adType', [0xff])
    .addTarget('companyId', [0x00, 0x4c])
    .addTarget('beaconType', [0x02, 0x15])
    .addTarget('manufacturerId', [0x76, 0x37])
    .addTargetByLength('sendData', 16)
    .addTargetByLength('crc16', 2)
    .addTarget('txPower', [0x00])
    .groupEnd();
