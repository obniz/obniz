"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const Logtta_1 = __importDefault(require("../utils/abstracts/Logtta"));
const round_to_1 = __importDefault(require("round-to"));
/**
 * Logtta_TH(Logtta_Temp) management class
 *
 * Logtta_TH(Logtta_Temp)を管理するクラス
 */
class Logtta_TH extends Logtta_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = Logtta_TH;
    }
    static parseTemperatureData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (0, round_to_1.default)((func(data) / 0x10000) * 175.72 - 46.85, 2);
    }
    static parseHumidityData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (0, round_to_1.default)((func(data) / 0x10000) * 125 - 6, 2);
    }
    /**
     * @deprecated
     *
     * Verify that the received peripheral is from the Logtta_TH(Logtta_Temp)
     *
     * 受け取ったPeripheralがLogtta_TH(Logtta_Temp)のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)かどうか
     */
    static isDevice(peripheral) {
        return this.getDeviceMode(peripheral) === 'Connectable';
    }
    /**
     * @deprecated
     *
     * Verify that the received advertisement is from the Logtta_TH(Logtta_Temp) (in Beacon Mode)
     *
     * 受け取ったAdvertisementがLogtta_TH(Logtta_Temp)のものかどうか確認する(ビーコンモード中)
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)かどうか
     */
    static isAdvDevice(peripheral) {
        return this.getDeviceMode(peripheral) === 'Beacon';
    }
    /**
     * @deprecated
     *
     * Get all data with connected state
     *
     * 接続している状態で全てのデータを取得
     *
     * @returns all data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った全てのデータ
     */
    async getAllWait() {
        try {
            return await this.getDataWait();
        }
        catch (_a) {
            return null;
        }
    }
    /**
     * Get the temperature data with connected state
     *
     * 接続している状態で温度のデータを取得
     *
     * @returns temperature data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った温度データ
     */
    async getTemperatureWait() {
        return (await this.getDataWait()).temperature;
    }
    /**
     * Get the humidity data with connected state
     *
     * 接続している状態で湿度のデータを取得
     *
     * @returns humidity data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った湿度データ
     */
    async getHumidityWait() {
        return (await this.getDataWait()).humidity;
    }
    /**
     * @deprecated
     *
     * Set enable / disable for beacon mode (periodic beacon transmission)
     *
     * Call this function after authenticating with the sensor
     *
     * After setting, disconnect once to enable it
     *
     * To stop beacon mode, you need to hold the button on the sensor for more than 2 seconds
     *
     * (For more detail, please see http://www.uni-elec.co.jp/logtta_page.html )
     *
     * ビーコンモード(定期的なビーコン発信)の有効/無効の設定
     *
     * センサとの認証を済ませた状態で実行してください
     *
     * 設定後に切断した後から有効になります
     *
     * ビーコンモードの終了は、デバイスのボタンを2秒以上長押しする操作が必要です(詳しくは http://www.uni-elec.co.jp/logtta_page.html )
     *
     * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
     *
     * @returns
     */
    setBeaconMode(enable) {
        return this.setBeaconModeWait(enable);
    }
    parseData(data) {
        return {
            temperature: Logtta_TH.parseTemperatureData(data.slice(0, 2)),
            humidity: Logtta_TH.parseHumidityData(data.slice(2, 4)),
        };
    }
}
exports.default = Logtta_TH;
Logtta_TH.PartsName = 'Logtta_TH';
Logtta_TH.AvailableBleMode = [
    'Connectable',
    'Beacon',
];
Logtta_TH.LocalName = {
    Connectable: undefined,
    Beacon: /null/,
};
Logtta_TH.ServiceUuids = {
    Connectable: 'f7eeaa20-276e-4165-aa69-7e3de7fc627e',
    Beacon: null,
};
Logtta_TH.BeaconDataStruct = {
    Connectable: null,
    Beacon: {
        appearance: {
            index: 0,
            type: 'check',
            data: 0x01,
        },
        temperature: {
            index: 1,
            length: 2,
            type: 'custom',
            func: (data) => Logtta_TH.parseTemperatureData(data, ObnizPartsBleAbstract_1.uintBE),
        },
        humidity: {
            index: 3,
            length: 2,
            type: 'custom',
            func: (data) => Logtta_TH.parseHumidityData(data, ObnizPartsBleAbstract_1.uintBE),
        },
        battery: {
            index: 5,
            type: 'unsignedNumBE',
        },
        interval: {
            index: 6,
            length: 2,
            type: 'unsignedNumBE',
        },
        /* alert: {
          index: 7,
          type: 'uint8',
        },
        name: {
          index: 8,
          length: 15,
          type: 'string',
        } */
        // TODO: delete
        address: {
            index: 0,
            type: 'custom',
            func: (data, peripheral) => peripheral.address,
        },
    },
};
