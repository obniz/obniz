"use strict";
/**
 * @packageDocumentation
 * @module Parts.EXVital
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
/** EXVital management class EXVitalを管理するクラス */
class EXVital extends ObnizPartsBleInterface_1.ObnizPartsBleInterface {
    constructor(peripheral) {
        super();
        this._peripheral = peripheral;
    }
    static info() {
        return {
            name: 'EXVital',
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
            major: unsigned16(advData.slice(11, 13)),
            minor: unsigned16(advData.slice(13, 15)),
            power: advData[14],
            diastolic_pressure: advData[15],
            systolic_pressure: advData[16],
            arm_temp: unsigned16(advData.slice(17, 19)) * 0.1,
            body_temp: unsigned16(advData.slice(19, 21)) * 0.1,
            heart_rate: advData[21],
            // blood_oxygen: advData[22],
            // fall: advData[23] > 0,
            battery: unsigned16(advData.slice(24, 26)) * 0.001,
            steps: unsigned16(advData.slice(26, 28)),
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
        if (!EXVital.isDevice(peripheral)) {
            return null;
        }
        const dev = new EXVital(peripheral);
        return dev.getData();
    }
    /**
     * Verify that the received peripheral is from the EXVital
     *
     * 受け取ったperipheralがEXVitalのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the EXVital
     *
     * EXVitalかどうか
     */
    static isDevice(peripheral) {
        return (this.DefaultAdvData.filter((d, i) => d !== -1 && d !== peripheral.adv_data[i]).length === 0 &&
            this.DefaultAdvData.length === peripheral.adv_data.length);
    }
}
exports.default = EXVital;
EXVital.partsName = 'EXVital';
EXVital.availableBleMode = 'Beacon';
EXVital.DefaultAdvData = [
    0x02,
    0x01,
    -1,
    0x18,
    0xff,
    0xf5,
    0x03,
    0x04,
    0x02,
    0x00,
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
    -1, // Steps
];
const unsigned16 = (value) => {
    return (value[0] << 8) | value[1];
};
