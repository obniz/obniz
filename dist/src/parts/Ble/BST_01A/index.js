"use strict";
/**
 * @packageDocumentation
 * @module Parts.BST_01A
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** BST_01A management class BST_01Aを管理するクラス */
class BST_01A {
    constructor() {
        this._peripheral = null;
        // non-wired device
        this.keys = [];
        this.requiredKeys = [];
        this.params = {};
    }
    static info() {
        return { name: 'BST_01A' };
    }
    /**
     * Verify that the received peripheral is from the BST_01A
     *
     * 受け取ったPeripheralがBST_01Aのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns true when peripheral is BST_01A
     *
     * BST_01Aかどうか
     */
    static isDevice(peripheral) {
        if (peripheral.adv_data.length < 9 ||
            peripheral.adv_data[7] !== 0x86 ||
            peripheral.adv_data[8] !== 0x34) {
            return false;
        }
        return true;
    }
    /**
     * Get a data from the BST_01A
     *
     * BST_01Aからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the BST_01A
     *
     * BST_01Aから受け取ったデータ
     */
    static getData(peripheral) {
        if (!this.isDevice(peripheral)) {
            return null;
        }
        const data = Buffer.from(peripheral.adv_data);
        let index = 10;
        const result = {};
        while (index < data.length) {
            switch (data[index++]) {
                case 0x01:
                    if (index + 1 <= data.length) {
                        result.id = 'BST-01A'; // only this
                    }
                    index += 1;
                    break;
                case 0x0f:
                    if (index + 2 <= data.length) {
                        result.battery = data.readUInt16LE(index) / 100;
                    }
                    index += 2;
                    break;
                case 0x10:
                    if (index + 2 <= data.length) {
                        const temp = data.readInt16LE(index);
                        if (temp === 0x7fff) {
                            result.temperature = 'error';
                        }
                        else {
                            result.temperature = temp / 100;
                        }
                    }
                    index += 2;
                    break;
                case 0x11:
                    if (index + 2 <= data.length) {
                        const humidity = data.readUInt16LE(index);
                        if (humidity === 0x7fff) {
                            result.humidity = 'error';
                        }
                        else {
                            result.humidity = humidity / 100;
                        }
                    }
                    index += 2;
                    break;
                case 0x03:
                    index += 7;
                    break;
                default:
                    // unknown. force break
                    index = 2048;
                    break;
            }
        }
        return result;
    }
    wired(obniz) {
        // do nothing.
    }
}
exports.default = BST_01A;
