"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_Accel
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
 * Logtta_Accel management class Logtta_Accelを管理するクラス
 *
 * Only support in beacon mode
 *
 * ビーコンモードのときのみ動作します
 */
class Logtta_Accel extends Logtta_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = Logtta_Accel;
    }
    static parseAccelSamplingData(data) {
        return 50 * 2 ** (4 - data);
    }
    static parseAccelRangeData(data) {
        return 2 ** ((data & 0b00000011) + 1) * 1000 * 1000;
    }
    static parseAccelAxis(data) {
        return ['z', 'y', 'x'].filter((key, i) => (data & (2 ** i)) > 0);
    }
    parseData(data) {
        return data;
    }
    /**
     * @deprecated
     *
     * Get a scan data from the Logtta_Accel
     *
     * Note: work only in beacon mode
     *
     * Logtta_Accelからスキャンデータを取得
     *
     * 注: ビーコンモードのときのみ動作
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns scan data from Logtta_Accel
     *
     * Logtta_Accelから受け取ったスキャンデータ
     */
    static getScanData(peripheral) {
        if (!Logtta_Accel.isDevice(peripheral)) {
            return null;
        }
        if (peripheral.adv_data && peripheral.adv_data.length === 31) {
            const d = peripheral.adv_data;
            let sampling = 0;
            switch (d[18]) {
                case 0x00:
                    sampling = 800;
                    break;
                case 0x01:
                    sampling = 400;
                    break;
                case 0x02:
                    sampling = 200;
                    break;
                case 0x03:
                    sampling = 100;
                    break;
                case 0x04:
                    sampling = 50;
                    break;
            }
            const alertArray = [];
            alertArray.push((d[26] & 0b11110000) >> 4);
            alertArray.push(d[26] & 0b00001111);
            alertArray.push((d[27] & 0b11110000) >> 4);
            alertArray.push(d[27] & 0b00001111);
            return {
                revision: d[5],
                sequence: d[6],
                battery: d[7],
                name: new TextDecoder().decode(new Uint8Array(d.slice(8, 16))),
                setting: {
                    temp_cycle: d[16] | (d[17] << 8),
                    accel_sampling: sampling,
                    hpf: !!(d[19] & 0b00010000),
                    accel_range: 2 * ((d[19] & 0b00000011) + 1),
                    accel_axis: d[20] & 0b00000111,
                    accel_resolution: d[21],
                },
                temperature: (0, round_to_1.default)(Math.floor((((d[22] | (d[23] << 8)) / 65535) * 175 - 45) * 100) / 100, 3),
                humidity: (0, round_to_1.default)(Math.floor(((d[24] | (d[25] << 8)) / 65535) * 100 * 100) / 100, 3),
                alert: alertArray,
            };
        }
        return null;
    }
    /**
     * @deprecated
     *
     * Get a acceleration data from the Logtta_Accel
     *
     * Note: work only in beacon mode
     *
     * Logtta_Accelから加速度データを取得
     *
     * 注: ビーコンモードのときのみ動作
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns acceleration data from Logtta_Accel
     *
     * Logtta_Accelから受け取った加速度データ
     */
    static getAccelData(peripheral) {
        if (!Logtta_Accel.isDevice(peripheral)) {
            return null;
        }
        const scanData = Logtta_Accel.getScanData(peripheral);
        if (peripheral.scan_resp &&
            peripheral.scan_resp.length === 31 &&
            scanData) {
            const buf = Buffer.from(peripheral.scan_resp);
            const raw = {
                x: {
                    peak: Logtta_Accel._convertAccel(buf.readUInt16LE(5), scanData.setting),
                    rms: Logtta_Accel._convertRms(buf.readUInt32LE(7) | (buf.readUInt16LE(11) << 32), scanData.setting),
                },
                y: {
                    peak: Logtta_Accel._convertAccel(buf.readUInt16LE(13), scanData.setting),
                    rms: Logtta_Accel._convertRms(buf.readUInt32LE(15) | (buf.readUInt16LE(19) << 32), scanData.setting),
                },
                z: {
                    peak: Logtta_Accel._convertAccel(buf.readUInt16LE(21), scanData.setting),
                    rms: Logtta_Accel._convertRms(buf.readUInt32LE(23) | (buf.readUInt16LE(27) << 32), scanData.setting),
                },
            };
            return raw;
        }
        return null;
    }
    /**
     * 加速度ピークを物理量に変換する
     *
     * @private
     */
    static _convertAccel(peak, setting) {
        // return peak;
        const result = (peak * setting.accel_range * 9.8) /
            Math.pow(2, setting.accel_resolution - 1);
        return (0, round_to_1.default)(result, 4);
    }
    /**
     * 加速度ピークを物理量に変換する
     *
     * @private
     */
    static _convertRms(rms, setting) {
        const n = setting.accel_sampling * setting.temp_cycle;
        const result = ((setting.accel_range * 9.8) /
            Math.pow(2, setting.accel_resolution - 1)) *
            Math.sqrt(rms / n);
        return (0, round_to_1.default)(result, 4);
    }
}
exports.default = Logtta_Accel;
Logtta_Accel.PartsName = 'Logtta_Accel';
Logtta_Accel.AvailableBleMode = 'Beacon';
Logtta_Accel.ServiceUuids = {
    Connectable: 'c2de0000-a6c7-437f-8538-54e07f7845df',
    Beacon: null,
};
Logtta_Accel.BeaconDataLength = {
    Connectable: undefined,
    Beacon: 0x1e,
};
Logtta_Accel.BeaconDataLength_ScanResponse = {
    Connectable: undefined,
    Beacon: 0x1e,
};
Logtta_Accel.CompanyID = {
    Connectable: undefined,
    Beacon: [0x10, 0x05],
};
Logtta_Accel.CompanyID_ScanResponse = {
    Connectable: undefined,
    Beacon: [0x10, 0x05],
};
Logtta_Accel.BeaconDataStruct = {
    Connectable: null,
    Beacon: {
        appearance: {
            index: 0,
            type: 'check',
            data: 0x05,
        },
        revision: {
            index: 1,
            type: 'unsignedNumLE',
        },
        sequence: {
            index: 2,
            type: 'unsignedNumLE',
        },
        battery: {
            index: 3,
            type: 'unsignedNumLE',
        },
        name: {
            index: 4,
            length: 8,
            type: 'string',
        },
        setting: {
            index: 12,
            length: 6,
            type: 'custom',
            func: (data) => ({
                temp_cycle: (0, ObnizPartsBleAbstract_1.uint)(data.slice(0, 2)),
                accel_sampling: Logtta_Accel.parseAccelSamplingData(data[2]),
                hpf: (data[3] & 0b00010000) > 0,
                accel_range: Logtta_Accel.parseAccelRangeData(data[3]),
                accel_axis: Logtta_Accel.parseAccelAxis(data[4]),
                accel_resolution: data[5],
            }),
        },
        temperature: {
            index: 18,
            length: 2,
            type: 'custom',
            func: (data) => (0, round_to_1.default)(((0, ObnizPartsBleAbstract_1.uint)(data) / 0x10000) * 175 - 45, 3),
        },
        humidity: {
            index: 20,
            length: 2,
            type: 'custom',
            func: (data) => (0, round_to_1.default)(((0, ObnizPartsBleAbstract_1.uint)(data) / 0x10000) * 100, 3),
        },
        alert: {
            index: 22,
            length: 2,
            type: 'custom',
            func: (data) => [
                (data[0] & 0b11110000) >> 4,
                data[0] & 0b00001111,
                (data[1] & 0b11110000) >> 4,
                data[1] & 0b00001111,
            ],
        },
        appearance_sr: {
            index: 0,
            type: 'check',
            data: 0x05,
            scanResponse: true,
        },
        accel_peak: {
            index: 0,
            length: 24,
            type: 'custom',
            func: (data, peripheral) => {
                if (!peripheral.manufacturerSpecificData)
                    throw new Error('Manufacturer specific data is null.');
                const d = Logtta_Accel.getAccelData(peripheral);
                if (d) {
                    return {
                        x: d.x.peak,
                        y: d.y.peak,
                        z: d.z.peak,
                    };
                }
                else {
                    return {
                        x: 0,
                        y: 0,
                        z: 0,
                    };
                }
            },
            scanResponse: true,
        },
        accel_rms: {
            index: 0,
            length: 24,
            type: 'custom',
            func: (data, peripheral) => {
                if (!peripheral.manufacturerSpecificData)
                    throw new Error('Manufacturer specific data is null.');
                const d = Logtta_Accel.getAccelData(peripheral);
                if (d) {
                    return {
                        x: d.x.rms,
                        y: d.y.rms,
                        z: d.z.rms,
                    };
                }
                else {
                    return {
                        x: 0,
                        y: 0,
                        z: 0,
                    };
                }
            },
            scanResponse: true,
        },
    },
};
