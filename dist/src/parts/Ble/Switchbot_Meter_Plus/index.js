"use strict";
/**
 * @packageDocumentation
 * @module Parts.Switchbot_Meter_Plus
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const Switchbot_1 = require("../utils/abstracts/Switchbot");
/** Switchbot_Meter_PLus management class Switchbot_Meter_PLusを管理するクラス */
class Switchbot_Meter_Plus extends Switchbot_1.Switchbot {
    static info() {
        return {
            name: 'Switchbot_Meter_Plus',
        };
    }
    /**
     * Verify that the received peripheral is from the Switchbot_Meter_PLus
     *
     * 受け取ったPeripheralがSwitchbot_Meter_PLusのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_Meter_PLus
     *
     * Switchbot_Meter_PLusかどうか
     */
    static isDevice(peripheral) {
        return Switchbot_1.Switchbot.isSwitchbotDevice(peripheral, 0x69, 5);
    }
    /**
     * Get a data from the Switchbot_Meter_PLus
     *
     * Switchbot_Meter_Plusからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_Meter_PLus Switchbot_Meter_PLusから受け取ったデータ
     */
    static getData(peripheral) {
        if (!Switchbot_Meter_Plus.isDevice(peripheral)) {
            return null;
        }
        const serviceData = Switchbot_1.Switchbot.getServiceDataPayload(peripheral, 0x69, 5);
        if (!serviceData)
            return null; // not target device
        const buf = Buffer.from(serviceData);
        const byte2 = buf.readUInt8(1);
        const byte3 = buf.readUInt8(2);
        const byte4 = buf.readUInt8(3);
        const byte5 = buf.readUInt8(4);
        const temp_sign = byte4 & 0b10000000 ? 1 : -1;
        const temp_c = temp_sign * ((byte4 & 0b01111111) + (byte3 & 0b00001111) / 10);
        const data = {
            temperature: temp_c,
            humidity: byte5 & 0b01111111,
            battery: byte2 & 0b01111111,
        };
        return data;
    }
}
exports.default = Switchbot_Meter_Plus;
