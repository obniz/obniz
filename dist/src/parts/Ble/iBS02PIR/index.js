"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** iBS02PIR management class iBS02PIRを管理するクラス */
class IBS02PIR {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS02PIR',
        };
    }
    /**
     * Verify that the received peripheral is from the iBS02PIR
     *
     * 受け取ったPeripheralがiBS02PIRのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS02PIR
     *
     * iBS02PIRかどうか
     */
    static isDevice(peripheral) {
        if (this.deviceAdv.length > peripheral.adv_data.length) {
            return false;
        }
        for (let index = 0; index < this.deviceAdv.length; index++) {
            if (this.deviceAdv[index] === -1) {
                continue;
            }
            if (peripheral.adv_data[index] === this.deviceAdv[index]) {
                continue;
            }
            return false;
        }
        return true;
    }
    /**
     * Get a data from the iBS02PIR
     *
     * iBS02PIRからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS02PIR iBS02PIRから受け取ったデータ
     */
    static getData(peripheral) {
        if (!IBS02PIR.isDevice(peripheral)) {
            return null;
        }
        return {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            event: Boolean(peripheral.adv_data[11] & 0b100),
        };
    }
}
exports.default = IBS02PIR;
IBS02PIR.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x0d,
    0x00,
    0x82,
    0xbc,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0x01,
    -1,
    -1,
    -1,
];
