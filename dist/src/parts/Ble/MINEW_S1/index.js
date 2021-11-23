"use strict";
/**
 * @packageDocumentation
 * @module Parts.MINEW_S1_HT
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../../../obniz/libs/utils/util"));
/** MINEW_S1 management class MINEW_S1を管理するクラス */
class MINEW_S1 {
    constructor() {
        this._peripheral = null;
        // non-wired device
        this.keys = [];
        this.requiredKeys = [];
        this.params = {};
    }
    static info() {
        return { name: 'MINEW_S1' };
    }
    /**
     * Verify that the received peripheral is from the MINEW_S1
     *
     * 受け取ったPeripheralがMINEW_S1のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param macAddress (optional: If you want to specify a MAC address) MAC address
     *
     * (任意: MACアドレスを指定したい場合) MACアドレス
     *
     * @returns Whether it is the MINEW_S1
     *
     * MINEW_S1かどうか
     *
     * true: HT Sensor SLOT / Info SLOT
     *
     * false: iBeacon SLOT / UID SLOT / URL SLOT / TLM SLOT / other advertisements
     */
    static isDevice(peripheral, macAddress = null) {
        if (!this._hasPrefix(peripheral)) {
            return false;
        }
        if (macAddress) {
            const data = this.getInfoData(peripheral) || this.getHTData(peripheral);
            if (data && data.macAddress === macAddress) {
                return true;
            }
            return false;
        }
        return true;
    }
    /**
     * Get device information data from the MINEW_S1
     *
     * MINEW_S1からのデバイス情報データを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received device information data from the MINEW_S1
     *
     * MINEW_S1から受け取ったデバイス情報データ
     */
    static getInfoData(peripheral) {
        if (!this._hasPrefix(peripheral)) {
            return null;
        }
        if (!peripheral.adv_data || peripheral.adv_data.length < 20) {
            return null;
        }
        const frameType = peripheral.adv_data[11];
        const versionNumber = peripheral.adv_data[12];
        if (frameType !== 0xa1 || versionNumber !== 0x08) {
            return null;
        }
        const batteryLevel = peripheral.adv_data[13];
        const macAddress = peripheral.adv_data
            .slice(14, 20)
            .map((e) => ('0' + e.toString(16)).slice(-2))
            .join('')
            .match(/.{1,2}/g)
            .reverse()
            .join('');
        const name = util_1.default.dataArray2string(peripheral.adv_data.slice(20));
        return {
            frameType,
            versionNumber,
            batteryLevel,
            name,
            macAddress,
        };
    }
    /**
     * Get temperature and humidity data from the MINEW_S1
     *
     * MINEW_S1からの温湿度データを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received temperature and humidity data from the MINEW_S1
     *
     * MINEW_S1から受け取った温湿度データ
     */
    static getHTData(peripheral) {
        if (!this._hasPrefix(peripheral)) {
            return null;
        }
        if (!peripheral.adv_data || peripheral.adv_data.length !== 24) {
            return null;
        }
        const frameType = peripheral.adv_data[11];
        const versionNumber = peripheral.adv_data[12];
        if (frameType !== 0xa1 || versionNumber !== 0x01) {
            return null;
        }
        const batteryLevel = peripheral.adv_data[13];
        const temperatureH = peripheral.adv_data[14];
        const temperatureL = peripheral.adv_data[15];
        const temperature = temperatureH + (temperatureL * 1) / (1 << 8);
        const humidityH = peripheral.adv_data[16];
        const humidityL = peripheral.adv_data[17];
        const humidity = humidityH + (humidityL * 1) / (1 << 8);
        const macAddress = peripheral.adv_data
            .splice(18)
            .map((e) => ('0' + e.toString(16)).slice(-2))
            .join('')
            .match(/.{1,2}/g)
            .reverse()
            .join('');
        return {
            frameType,
            versionNumber,
            batteryLevel,
            temperature,
            humidity,
            macAddress,
        };
    }
    static _hasPrefix(peripheral) {
        if (!peripheral.adv_data || peripheral.adv_data.length < 10) {
            return false;
        }
        const target = [
            // flag
            0x02,
            0x01,
            0x06,
            // 16bit uuid
            0x03,
            0x03,
            0xe1,
            0xff,
            // service data
            -1,
            0x16,
            0xe1,
            0xff,
        ];
        for (const index in target) {
            if (target[index] >= 0 && target[index] !== peripheral.adv_data[index]) {
                return false;
            }
        }
        return true;
    }
    wired(obniz) {
        // do nothing.
    }
}
exports.default = MINEW_S1;
