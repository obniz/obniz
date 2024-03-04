"use strict";
/**
 * @packageDocumentation
 * @module Parts.Switchbot_IOSensorTH
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const Switchbot_1 = require("../utils/abstracts/Switchbot");
/** Switchbot_IOSensorTH management class Switchbot_WoIOSensorTHを管理するクラス */
class Switchbot_IOSensorTH extends Switchbot_1.Switchbot {
    static info() {
        return {
            name: 'Switchbot_IOSensorTH',
        };
    }
    /**
     * Verify that the received peripheral is from the Switchbot_IOSensorTH
     *
     * 受け取ったPeripheralがSwitchbot_IOSensorTHのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_IOSensorTH
     *
     * Switchbot_IOSensorTHかどうか
     */
    static isDevice(peripheral) {
        return Switchbot_1.Switchbot.isSwitchbotDevice(peripheral, 0x77, 2);
    }
    /**
     * Get a data from the Switchbot_IOSensorTH
     *
     * Switchbot_IOSensorTHからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_IOSensorTH Switchbot_IOSensorTHから受け取ったデータ
     */
    static getData(peripheral) {
        var _a;
        if (!Switchbot_IOSensorTH.isDevice(peripheral)) {
            return null;
        }
        const serviceData = Switchbot_1.Switchbot.getServiceDataPayload(peripheral, 0x77, 2);
        if (!serviceData)
            return null; // not target device
        if (((_a = peripheral.manufacturerSpecificData) === null || _a === void 0 ? void 0 : _a.length) !== 14)
            return null; // not target device
        const manufacturerDataBuf = Buffer.from(peripheral.manufacturerSpecificData);
        const mdByte10 = manufacturerDataBuf.readUInt8(10);
        const mdByte11 = manufacturerDataBuf.readUInt8(11);
        const mdByte12 = manufacturerDataBuf.readUInt8(12);
        const sdByte2 = Buffer.from(serviceData).readUInt8(1);
        const temp_sign = mdByte11 & 0b10000000 ? 1 : -1;
        const temp_c = temp_sign * ((mdByte11 & 0b01111111) + (mdByte10 & 0b00001111) / 10);
        const data = {
            temperature: temp_c,
            fahrenheit: mdByte12 & 0b10000000 ? true : false,
            humidity: mdByte12 & 0b01111111,
            battery: sdByte2 & 0b01111111,
        };
        return data;
    }
}
exports.default = Switchbot_IOSensorTH;
