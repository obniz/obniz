"use strict";
/**
 * @packageDocumentation
 * @module Parts.TM511
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
/** TM511 management class TM511を管理するクラス */
class TM511 {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'TM511',
        };
    }
    /**
     * Verify that the received peripheral is from the TM511
     *
     * 受け取ったPeripheralがTM511のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the TM511
     *
     * TM511かどうか
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
     * Get a data from the TM511
     *
     * TM511からのデータ取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the TM511 TM511から受け取ったデータ
     */
    static getData(peripheral) {
        if (!TM511.isDevice(peripheral)) {
            return null;
        }
        const data = {
            battery: peripheral.adv_data[13],
            x: peripheral.adv_data[14] +
                ObnizPartsBleInterface_1.ObnizPartsBleInterface.readFraction(peripheral.adv_data[15]),
            y: peripheral.adv_data[16] +
                ObnizPartsBleInterface_1.ObnizPartsBleInterface.readFraction(peripheral.adv_data[17]),
            z: peripheral.adv_data[18] +
                ObnizPartsBleInterface_1.ObnizPartsBleInterface.readFraction(peripheral.adv_data[19]),
        };
        return data;
    }
}
exports.default = TM511;
TM511.deviceAdv = [
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
    0xa1,
    0x03,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
];
