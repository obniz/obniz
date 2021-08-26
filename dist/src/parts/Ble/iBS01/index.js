"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** iBS01 management class iBS01を管理するクラス */
class IBS01 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS01',
        };
    }
    /**
     * Verify that the received peripheral is from the iBS01
     *
     * 受け取ったPeripheralがiBS01のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param strictCheck Whether do strict check
     *
     * strictCheckをするかどうか
     *
     * @returns Whether it is the iBS01
     *
     * iBS01かどうか
     */
    static isDevice(peripheral, strictCheck = false) {
        const deviceAdv = [...this.deviceAdv];
        if (strictCheck) {
            deviceAdv[18] = 0x03;
        }
        if (deviceAdv.length > peripheral.adv_data.length) {
            return false;
        }
        for (let index = 0; index < deviceAdv.length; index++) {
            if (deviceAdv[index] === -1) {
                continue;
            }
            if (peripheral.adv_data[index] === deviceAdv[index]) {
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
     * Get a data from the iBS01
     *
     * iBS01からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param strictCheck Whether do strict check
     *
     * strictCheckをするかどうか
     *
     * @returns received data from the iBS01 iBS01から受け取ったデータ
     */
    static getData(peripheral, strictCheck) {
        if (!IBS01.isDevice(peripheral, strictCheck)) {
            return null;
        }
        const data = {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            button: false,
            moving: false,
            hall_sensor: false,
            fall: false,
        };
        if (peripheral.adv_data[11] & 0b0001) {
            data.button = true;
        }
        if (peripheral.adv_data[11] & 0b0010) {
            data.moving = true;
        }
        if (peripheral.adv_data[11] & 0b0100) {
            data.hall_sensor = true;
        }
        if (peripheral.adv_data[11] & 0b1000) {
            data.fall = true;
        }
        return data;
    }
}
exports.default = IBS01;
IBS01.deviceAdv = [
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
    -1,
    -1,
    -1,
    -1,
];
