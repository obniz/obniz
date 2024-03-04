"use strict";
/**
 * @packageDocumentation
 * @module Parts.Switchbot_ContactSensor
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const Switchbot_1 = require("../utils/abstracts/Switchbot");
/** Switchbot_ContactSensor management class Switchbot_ContactSensorを管理するクラス */
class Switchbot_ContactSensor extends Switchbot_1.Switchbot {
    static info() {
        return {
            name: 'Switchbot_ContactSensor',
        };
    }
    /**
     * Verify that the received peripheral is from the Switchbot_ContactSensor
     *
     * 受け取ったPeripheralがSwitchbot_ContactSensorのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_ContactSensor
     *
     * Switchbot_ContactSensorかどうか
     */
    static isDevice(peripheral) {
        return Switchbot_1.Switchbot.isSwitchbotDevice(peripheral, [0x44, 0x64], // 0x53(Pair Mode) or 0x73(Const Adv Mode) with no encryption
        8);
    }
    /**
     * Get a data from the Switchbot_ContactSensor
     *
     * Switchbot_ContactSensorからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_ContactSensor Switchbot_ContactSensorから受け取ったデータ
     */
    static getData(peripheral) {
        if (!Switchbot_ContactSensor.isDevice(peripheral)) {
            return null;
        }
        const serviceData = Switchbot_1.Switchbot.getServiceDataPayload(peripheral, [0x44, 0x64], // 0x53(Pair Mode) or 0x73(Const Adv Mode) with no encryption
        8);
        if (!serviceData)
            return null; // not target device
        const buf = Buffer.from(serviceData);
        const byte1 = buf.readUInt8(0);
        const byte2 = buf.readUInt8(1);
        const byte3 = buf.readUInt8(2);
        const pirUTC = buf.readUInt16BE(3);
        const halUTC = buf.readUInt16BE(5);
        const byte8 = buf.readUInt8(7);
        const scopeTested = byte1 & 0b10000000 ? true : false;
        const pirState = byte1 & 0b01000000 ? true : false;
        const battery = byte2 & 0b01111111;
        const highestPIR = (byte3 & 0b10000000) >> 7;
        const highestHAL = (byte3 & 0b01000000) >> 6;
        const doorStatusBit = (byte3 & 0b00000110) >> 1;
        const halState = doorStatusBit === 0
            ? 'close'
            : doorStatusBit === 1
                ? 'open'
                : doorStatusBit === 2
                    ? 'timeoutNotClose'
                    : null;
        if (halState === null)
            return null; // unknown door status
        const lightLevel = byte3 & 0b00000001 ? 'light' : 'dark';
        const numberOfEntrances = (byte8 & 0b11000000) >> 6;
        const numberOfGoOutCounter = (byte8 & 0b00110000) >> 3;
        const buttonPushCounter = byte8 & 0b00000111;
        const pir = highestPIR * 65536 + pirUTC;
        const hal = highestHAL * 65536 + halUTC;
        const data = {
            scopeTested,
            someoneIsMoving: pirState,
            battery,
            pir,
            hal,
            halState,
            lightLevel,
            numberOfEntrances,
            numberOfGoOutCounter,
            buttonPushCounter,
        };
        return data;
    }
}
exports.default = Switchbot_ContactSensor;
