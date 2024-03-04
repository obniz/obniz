"use strict";
/**
 * @packageDocumentation
 * @module Parts.Switchbot_PlugMini
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const binary_analyzer_1 = require("binary-analyzer");
const Switchbot_1 = require("../utils/abstracts/Switchbot");
/** Switchbot_PlugMini management class Switchbot_PlugMiniを管理するクラス */
class Switchbot_PlugMini extends Switchbot_1.Switchbot {
    static info() {
        return {
            name: 'Switchbot_PlugMini',
        };
    }
    static getPayload(peripheral) {
        const payload = this.parser.getAllData(peripheral.adv_data);
        return payload;
    }
    /**
     * Verify that the received peripheral is from the Switchbot_PlugMini
     *
     * 受け取ったPeripheralがSwitchbot_PlugMiniのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_PlugMini
     *
     * Switchbot_PlugMiniかどうか
     */
    static isDevice(peripheral) {
        const payload = Switchbot_PlugMini.getPayload(peripheral);
        return payload !== null;
    }
    /**
     * Get a data from the Switchbot_PlugMini
     *
     * Switchbot_PlugMiniからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_PlugMini Switchbot_PlugMiniから受け取ったデータ
     */
    static getData(peripheral) {
        const data = Switchbot_PlugMini.getPayload(peripheral);
        if (data === null)
            return null;
        return {
            sequenceNumber: data.manufacture.sequenceNumber,
            powerState: data.manufacture.powerState,
            hasDelay: data.manufacture.byte10.hasDelay,
            hasTimer: data.manufacture.byte10.hasTimer,
            alreadySyncTime: data.manufacture.byte10.alreadySyncTime,
            wifiRssi: data.manufacture.wifiRssi,
            overload: data.manufacture.byte12_13.overload,
            power: data.manufacture.byte12_13.power,
        };
    }
}
exports.default = Switchbot_PlugMini;
Switchbot_PlugMini.parser = new binary_analyzer_1.BinaryAnalyzer()
    .addTarget('flag', [0x02, 0x01, 0x06], 'RawArray')
    .addGroup('manufacture', new binary_analyzer_1.BinaryAnalyzer()
    .addTarget('length', [-1], 'RawArray')
    .addTarget('type', [0xff], 'RawArray')
    .addTarget('companyId', [0x69, 0x09], 'RawArray')
    .addTargetByLength('macAddress', 6, 'RawArray')
    .addTargetByLength('sequenceNumber', 1, 'RawArray', ([v]) => v)
    .addTargetByLength('powerState', 1, 'RawArray', ([v]) => v === 0x00 ? 'off' : v === 0x80 ? 'on' : null)
    .addTargetByLength('byte10', 1, 'RawArray', ([v]) => {
    const hasDelay = v & 0b00000001 ? true : false;
    const hasTimer = v & 0b00000010 ? true : false;
    const alreadySyncTime = v & 0b00000100 ? true : false;
    return {
        hasDelay,
        hasTimer,
        alreadySyncTime,
    };
})
    .addTargetByLength('wifiRssi', 1, 'RawArray', ([v]) => -v)
    .addTargetByLength('byte12_13', 2, 'RawArray', ([_12, _13]) => {
    const overload = _12 & 0b10000000 ? true : false;
    const msb = _12 & 0b01111111;
    const lsb = _13;
    const power = ((msb << 8) + lsb) / 10;
    return {
        overload,
        power,
    };
}));
