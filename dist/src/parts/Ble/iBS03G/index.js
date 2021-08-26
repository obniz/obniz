"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** iBS03G management class iBS03Gを管理するクラス */
class IBS03G {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS03G',
        };
    }
    /**
     * Verify that the received peripheral is from the iBS03G
     *
     * 受け取ったPeripheralがiBS03Gのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS03G
     *
     * iBS03Gかどうか
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
     * Get a data from the iBS03G
     *
     * iBS03Gからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS03G iBS03Gから受け取ったデータ
     */
    static getData(peripheral) {
        if (!IBS03G.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            button: false,
            moving: false,
            fall: false,
        };
        if (peripheral.adv_data[11] & 0b0001) {
            data.button = true;
        }
        if (peripheral.adv_data[11] & 0b0010) {
            data.moving = true;
        }
        if (peripheral.adv_data[11] & 0b1000) {
            data.fall = true;
        }
        return data;
    }
}
exports.default = IBS03G;
IBS03G.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x0d,
    0x00,
    0x83,
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
    0x16,
    -1,
    -1,
    -1,
];
