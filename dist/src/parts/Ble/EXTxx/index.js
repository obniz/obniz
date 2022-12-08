"use strict";
/**
 * @packageDocumentation
 * @module Parts.EXTxx
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
/** EXTxx management class EXTxxを管理するクラス */
class EXTxx extends ObnizPartsBleInterface_1.ObnizPartsBleInterface {
    constructor(peripheral) {
        super();
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'EXTxx',
        };
    }
    /**
     * (with instantiation) Get a data from the beacon
     *
     * (インスタンス化する場合) ビーコンからデータを取得
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     */
    getData() {
        var _a;
        const advData = (_a = this._peripheral) === null || _a === void 0 ? void 0 : _a.adv_data;
        if (!advData)
            throw new Error('advData is null');
        return {
            uuid: advData
                .slice(6, 22)
                .map((d, i) => ([2, 3, 4, 5].includes(i / 2) ? '-' : '') +
                ('00' + d.toString(16)).slice(-2))
                .join(''),
            major: unsigned16(advData.slice(22, 24)),
            minor: unsigned16(advData.slice(24, 26)),
            power: advData[26],
            battery: advData[27],
        };
    }
    /**
     * (without instantiation) Get a data from the beacon
     *
     * (インスタンス化しない場合) ビーコンからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     */
    static getData(peripheral) {
        if (!EXTxx.isDevice(peripheral)) {
            return null;
        }
        const dev = new EXTxx(peripheral);
        return dev.getData();
    }
    /**
     * Verify that the received peripheral is from the EXTxx
     *
     * 受け取ったperipheralがEXTxxのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the EXTxx
     *
     * EXTxxかどうか
     */
    static isDevice(peripheral) {
        return (this.DefaultAdvData.filter((d, i) => d !== -1 && d !== peripheral.adv_data[i]).length === 0 &&
            this.DefaultAdvData.length === peripheral.adv_data.length);
    }
}
exports.default = EXTxx;
EXTxx.PartsName = 'EXTxx';
EXTxx.AvailableBleMode = 'Beacon';
EXTxx.DefaultAdvData = [
    0x1c,
    0xff,
    0xf5,
    0x03,
    0x02,
    0x15,
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
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0x00, // Type  0: wBeacon  1: BatteryLevelNotification
];
const unsigned16 = (value) => {
    return (value[0] << 8) | value[1];
};
