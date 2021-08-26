"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** iBS01H management class iBS01Hを管理するクラス */
class IBS01H {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS01H',
        };
    }
    /**
     * Verify that the received peripheral is from the iBS01H
     *
     * 受け取ったPeripheralがiBS01Hのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS01H
     *
     * iBS01Hかどうか
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
     * Get a data from the iBS01H
     *
     * iBS01Hからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS01H iBS01Hから受け取ったデータ
     */
    static getData(peripheral) {
        if (!IBS01H.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
            button: false,
            hall_sensor: false,
        };
        if (peripheral.adv_data[11] & 0b0001) {
            data.button = true;
        }
        if (peripheral.adv_data[11] & 0b0100) {
            data.hall_sensor = true;
        }
        return data;
    }
}
exports.default = IBS01H;
IBS01H.deviceAdv = [
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
    0x04,
    -1,
    -1,
    -1,
];
