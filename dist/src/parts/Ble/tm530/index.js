"use strict";
/**
 * @packageDocumentation
 * @module Parts.TM530
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
/** TM530 management class TM530を管理するクラス */
class TM530 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'TM530',
        };
    }
    /**
     * Verify that the received peripheral is from the TM530
     *
     * 受け取ったPeripheralがTM530のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the TM530
     *
     * TM530かどうか
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
     * Get a data from the TM530
     *
     * TM530からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the TM530 TM530から受け取ったデータ
     */
    static getData(peripheral) {
        if (!TM530.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: peripheral.adv_data[13],
            temperature: peripheral.adv_data[14] +
                ObnizPartsBleInterface_1.ObnizPartsBleInterface.readFraction(peripheral.adv_data[15]),
            humidity: peripheral.adv_data[16] +
                ObnizPartsBleInterface_1.ObnizPartsBleInterface.readFraction(peripheral.adv_data[17]),
        };
        return data;
    }
}
exports.default = TM530;
TM530.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x03,
    0x03,
    0xe1,
    0xff,
    -1,
    -1,
    -1,
    -1,
    -1,
    0x01,
    -1,
    -1,
    -1,
    -1,
    -1,
];
