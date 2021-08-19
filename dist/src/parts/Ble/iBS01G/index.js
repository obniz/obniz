"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** iBS01G management class iBS01Gを管理するクラス */
class IBS01G {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS01G',
        };
    }
    /**
     * verify that the received peripheral is from the iBS01G
     *
     * 受け取ったPeripheralがiBS01Gのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS01G
     *
     * iBS01Gかどうか
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
        return (peripheral.adv_data[12] === 0xff &&
            peripheral.adv_data[13] === 0xff &&
            peripheral.adv_data[14] === 0xff &&
            peripheral.adv_data[15] === 0xff);
    }
    /**
     * Get a data from the iBS01G
     *
     * iBS01Gからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS01G iBS01Gから受け取ったデータ
     */
    static getData(peripheral) {
        if (!IBS01G.isDevice(peripheral)) {
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
exports.default = IBS01G;
IBS01G.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x59,
    0x00,
    0x80,
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
    0x06,
    -1,
    -1,
    -1,
];
