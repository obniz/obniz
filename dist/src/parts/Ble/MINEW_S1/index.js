"use strict";
/**
 * @packageDocumentation
 * @module Parts.MINEW_S1
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MINEW_1 = __importDefault(require("../utils/abstracts/MINEW"));
const util_1 = require("../../../obniz/libs/utils/util");
/** MINEW_S1 management class MINEW_S1を管理するクラス */
class MINEW_S1 extends MINEW_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = MINEW_S1;
    }
    // TODO: delete by disable info slot
    static isDeviceWithMode(peripheral, mode) {
        return (peripheral.serviceData !== null &&
            (peripheral.serviceData[3] === 1 || peripheral.serviceData[3] === 8) &&
            MINEW_1.default.isDeviceWithMode(peripheral, mode));
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
        var _a;
        if (MINEW_S1.getDeviceMode(peripheral) !== 'Beacon' ||
            !peripheral.serviceData ||
            peripheral.serviceData[3] !== 0x08) {
            return null;
        }
        const frameType = peripheral.adv_data[11];
        const versionNumber = peripheral.adv_data[12];
        if (frameType !== 0xa1 || versionNumber !== 0x08) {
            return null;
        }
        const batteryLevel = peripheral.adv_data[13];
        const macAddress = ((_a = peripheral.adv_data
            .slice(14, 20)
            .map((e) => ('0' + e.toString(16)).slice(-2))
            .join('')
            .match(/.{1,2}/g)) !== null && _a !== void 0 ? _a : [])
            .reverse()
            .join('');
        const name = util_1.ObnizUtil.dataArray2string(peripheral.adv_data.slice(20));
        return {
            frameType,
            versionNumber,
            batteryLevel,
            name,
            macAddress,
        };
    }
    /**
     * @deprecated
     * Use MINEW_S1.getData();
     *
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
        if (MINEW_S1.getDeviceMode(peripheral) !== 'Beacon' ||
            !peripheral.serviceData ||
            peripheral.serviceData[3] !== 0x01) {
            return null;
        }
        const device = new MINEW_S1(peripheral, 'Beacon');
        return device.getData();
    }
}
exports.default = MINEW_S1;
MINEW_S1.PartsName = 'MINEW_S1';
// TODO: restore by disable info slot
// public static readonly ServiceDataLength = 16;
MINEW_S1.ServiceDataStruct = MINEW_1.default.getServiceDataStruct(7, 1, {
    // TODO: delete
    frameType: {
        index: 0,
        type: 'unsignedNumLE',
    },
    // TODO: delete
    versionNumber: {
        index: 1,
        type: 'unsignedNumLE',
    },
    // TODO: change key name
    batteryLevel: {
        index: 2,
        type: 'unsignedNumLE',
    },
    temperature: {
        index: 3,
        length: 2,
        type: 'numLE',
        fixedIntegerBytes: 1,
        round: 2,
    },
    humidity: {
        index: 5,
        length: 2,
        type: 'numLE',
        fixedIntegerBytes: 1,
        round: 2,
    },
    // TODO: delete
    macAddress: {
        index: 7,
        length: 6,
        type: 'custom',
        func: (data, peripheral) => peripheral.address,
    },
    // TODO: delete by disable info slot
    versionNumber_: {
        index: 1,
        type: 'check',
        data: 1,
        scanResponse: true, // for ignored by check
    },
});
