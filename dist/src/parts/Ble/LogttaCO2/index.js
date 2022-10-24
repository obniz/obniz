"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const Logtta_1 = __importDefault(require("../utils/abstracts/Logtta"));
/** Logtta_CO2 management class Logtta_CO2を管理するクラス */
class Logtta_CO2 extends Logtta_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = Logtta_CO2;
        // TODO: delete
        // In order to maintain compatibility, when callback is placed from arguments, the behavior of the document street
        this.callbackFlag = false;
    }
    /**
     * @deprecated
     *
     * Verify that the received peripheral is from the Logtta_CO2
     *
     * 受け取ったPeripheralがLogtta_CO2のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_CO2
     *
     * Logtta_CO2かどうか
     */
    static isDevice(peripheral) {
        return this.getDeviceMode(peripheral) === 'Connectable';
    }
    /**
     * @deprecated
     *
     * Verify that the received advertisement is from the Logtta_CO2 (in Beacon Mode)
     *
     * 受け取ったAdvertisementがLogtta_CO2のものかどうか確認する(ビーコンモード中)
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_CO2
     *
     * Logtta_CO2かどうか
     */
    static isAdvDevice(peripheral) {
        return this.getDeviceMode(peripheral) === 'Beacon';
    }
    /**
     * Notify when the CO2 concentration data have got from the Logtta_CO2 with connected state
     *
     * 接続している状態でLogtta_CO2からCO2濃度データを取得したとき通知
     *
     * @returns
     */
    async startNotifyWait(callback) {
        // TODO: delete try-catch
        try {
            this.checkConnected();
        }
        catch (e) {
            console.error(e);
            return;
        }
        // TODO: delete if
        if (callback) {
            this.callbackFlag = true;
            this.onNotify = callback;
        }
        return await this.subscribeWait(this.serviceUuid, this.getCharUuid(0x21), (data) => {
            if (this.onNotify) {
                if (this.callbackFlag)
                    this.onNotify(this.parseData(data));
                else
                    this.onNotify(this.parseData(data).co2);
            }
        });
    }
    /**
     * @deprecated
     *
     * Get CO2 concentration data with connected state
     *
     * 接続している状態でCO2濃度データを取得
     *
     * @returns CO2 concentration data from the Logtta_CO2
     *
     * Logtta_CO2から受け取ったCO2濃度データ
     */
    async getWait() {
        try {
            return (await this.getDataWait()).co2;
        }
        catch (_a) {
            return null;
        }
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
            co2: (0, ObnizPartsBleAbstract_1.uintBE)(data),
        };
    }
}
exports.default = Logtta_CO2;
Logtta_CO2.PartsName = 'Logtta_CO2';
Logtta_CO2.ServiceUuids = {
    Connectable: '31f3ab20-bd1c-46b1-91e4-f57abcf7d449',
    Beacon: null,
};
Logtta_CO2.BeaconDataStruct = {
    Connectable: null,
    Beacon: {
        appearance: {
            index: 0,
            type: 'check',
            data: 0x02,
        },
        co2: {
            index: 1,
            length: 2,
            type: 'unsignedNumBE',
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
          index: 8,
          type: 'uint8',
        },
        name: {
          index: 9,
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
