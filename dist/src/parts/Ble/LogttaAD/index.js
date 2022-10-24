"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const Logtta_1 = __importDefault(require("../utils/abstracts/Logtta"));
/** Logtta_AD management class Logtta_ADを管理するクラス */
class Logtta_AD extends Logtta_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = Logtta_AD;
    }
    /**
     * @deprecated
     *
     * Verify that the received peripheral is from the Logtta_AD
     *
     * 受け取ったPeripheralがLogtta_ADのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_AD
     *
     * Logtta_ADかどうか
     */
    static isDevice(peripheral) {
        return this.getDeviceMode(peripheral) === 'Connectable';
    }
    static parseAmpereData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (16 / 916) * func(data);
    }
    static parseVoltData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (4 / 916) * func(data);
    }
    /**
     * Get the current value from the Logtta_AD
     *
     * Logtta_ADから電流値を取得
     *
     * @returns the current value from the Logtta_AD
     *
     * Logtta_ADから受け取った電流値
     */
    async getAmpereWait() {
        return (await this.getDataWait()).ampere;
    }
    /**
     * Get the voltage value from the Logtta_AD
     *
     * Logtta_ADから電圧値を取得
     *
     * @returns the voltage value from the Logtta_AD
     *
     * Logtta_ADから受け取った電圧値
     */
    async getVoltWait() {
        return (await this.getDataWait()).volt;
    }
    /**
     * Get the count data from the Logtta_AD
     *
     * Logtta_ADからカウントデータを取得
     *
     * @returns the count data from the Logtta_AD
     *
     * Logtta_ADから受け取ったカウントデータ
     */
    async getCountWait() {
        return (await this.getDataWait()).count;
    }
    /**
     * @deprecated
     *
     * Get all data available from the Logtta_AD
     *
     * Logtta_ADから取得可能なデータを全て取得
     *
     * @returns all data available from the Logtta_AD
     *
     * Logtta_ADから受け取った全てのデータ
     */
    async getAllWait() {
        try {
            return await this.getDataWait();
        }
        catch (_a) {
            return null;
        }
    }
    parseData(data) {
        return {
            ampere: this.staticClass.parseAmpereData(data.slice(0, 2), ObnizPartsBleAbstract_1.uintBE),
            volt: this.staticClass.parseVoltData(data.slice(0, 2), ObnizPartsBleAbstract_1.uintBE),
            count: (0, ObnizPartsBleAbstract_1.uintBE)(data.slice(2, 4)),
        };
    }
}
exports.default = Logtta_AD;
Logtta_AD.PartsName = 'Logtta_AD';
Logtta_AD.ServiceUuids = {
    Connectable: '4e43ae20-6687-4f3c-a1c3-1c327583f29d',
    Beacon: null,
};
Logtta_AD.BeaconDataStruct = {
    Connectable: null,
    Beacon: {
        appearance: {
            index: 0,
            type: 'check',
            data: 0x04,
        },
        ampere: {
            index: 1,
            length: 2,
            type: 'custom',
            func: (data) => Logtta_AD.parseAmpereData(data, ObnizPartsBleAbstract_1.uintBE),
        },
        volt: {
            index: 1,
            length: 2,
            type: 'custom',
            func: (data) => Logtta_AD.parseVoltData(data, ObnizPartsBleAbstract_1.uintBE),
        },
        count: {
            index: 3,
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
    },
};
