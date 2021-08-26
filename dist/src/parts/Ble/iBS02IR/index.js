"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** iBS02IR management class iBS02IRを管理するクラス */
class IBS02IR {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS02IR',
        };
    }
    /**
     * Verify that the received peripheral is from the iBS02IR
     *
     * 受け取ったPeripheralがiBS02IRのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS02IR
     *
     * iBS02IRかどうか
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
     * Get a data from the iBS02IR
     *
     * iBS02IRからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS02IR iBS02IRから受け取ったデータ
     */
    static getData(peripheral) {
        if (!IBS02IR.isDevice(peripheral)) {
            return null;
        }
        return {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            event: Boolean(peripheral.adv_data[11] & 0b100),
        };
    }
}
exports.default = IBS02IR;
IBS02IR.deviceAdv = [
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
    0x02,
    -1,
    -1,
    -1,
];
