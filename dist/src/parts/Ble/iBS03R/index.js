"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** iBS03R management class iBS03Rを管理するクラス */
class IBS03R {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBS03R',
        };
    }
    /**
     * Verify that the received peripheral is from the iBS03R
     *
     * 受け取ったPeripheralがiBS03Rのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS03R
     *
     * iBS03Rかどうか
     */
    static isDevice(peripheral) {
        return IBS03R.getDeviceArray(peripheral) !== null;
    }
    /**
     * Get a data from the iBS03R
     *
     * iBS03Rからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS03R iBS03Rから受け取ったデータ
     */
    static getData(peripheral) {
        const adv = IBS03R.getDeviceArray(peripheral);
        if (adv === null) {
            return null;
        }
        const data = {
            battery: (adv[5] + adv[6] * 256) * 0.01,
            button: Boolean(adv[7]),
            distance: adv[10] + adv[11] * 256,
            address: peripheral.address,
        };
        return data;
    }
    static getDeviceArray(peripheral) {
        const advertise = !peripheral.advertise_data_rows
            ? []
            : peripheral.advertise_data_rows.filter((adv) => {
                let find = false;
                if (this.deviceAdv.length > adv.length) {
                    return find;
                }
                for (let index = 0; index < this.deviceAdv.length; index++) {
                    if (this.deviceAdv[index] === -1) {
                        continue;
                    }
                    if (adv[index] === this.deviceAdv[index]) {
                        find = true;
                        continue;
                    }
                    find = false;
                    break;
                }
                return find;
            });
        if (advertise.length !== 1) {
            return null;
        }
        return advertise[0];
    }
}
exports.default = IBS03R;
IBS03R.deviceAdv = [
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
    0x13,
    -1,
    -1,
    -1, // reserved
];
