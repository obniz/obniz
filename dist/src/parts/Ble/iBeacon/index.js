"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBeacon
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** iBeacon management class iBeacon管理クラス */
class iBeacon {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'iBeacon',
        };
    }
    /**
     * Verify that the received peripheral is iBeacon
     *
     * 受け取ったPeripheralがiBeaconのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBeacon
     *
     * iBeaconかどうか
     */
    static isDevice(peripheral) {
        return peripheral.iBeacon != null;
    }
    /**
     * Get a data from the iBeacon
     *
     * iBeaconからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBeacon
     */
    static getData(peripheral) {
        if (!peripheral.iBeacon) {
            return null;
        }
        const iBeaconData = peripheral.iBeacon;
        return {
            uuid: iBeaconData.uuid,
            major: iBeaconData.major,
            minor: iBeaconData.minor,
            power: iBeaconData.power,
        };
    }
}
exports.default = iBeacon;
