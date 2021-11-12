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
                temperature: Math.floor((((d[22] | (d[23] << 8)) / 65535) * 175 - 45) * 100) / 100,
                humidity: Math.floor(((d[24] | (d[25] << 8)) / 65535) * 100 * 100) / 100,
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
        if (peripheral.scan_resp && peripheral.scan_resp.length === 31) {
            const d = peripheral.scan_resp;
            // console.log(
            //   `x peak ${data.x.peak} rms ${data.x.rms} y peak ${data.y.peak} rms ${data.y.rms} z peak ${data.z.peak} rms ${data.z.rms} address ${data.address}`,
            // );
            return {
                x: {
                    peak: d[5] | (d[6] << 8),
                    rms: d[7] |
                        (d[8] << 8) |
                        (d[9] << 16) |
                        (d[10] << 24) |
                        (d[11] << 32) |
                        (d[12] << 40),
                },
                y: {
                    peak: d[13] | (d[14] << 8),
                    rms: d[15] |
                        (d[16] << 8) |
                        (d[17] << 16) |
                        (d[18] << 24) |
                        (d[19] << 32) |
                        (d[20] << 40),
                },
                z: {
                    peak: d[21] | (d[22] << 8),
                    rms: d[23] |
                        (d[24] << 8) |
                        (d[25] << 16) |
                        (d[26] << 24) |
                        (d[27] << 32) |
                        (d[28] << 40),
                },
            };
        }
        return null;
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
                temp_cycle: ObnizPartsBleAbstract_1.uint(data.slice(0, 2)),
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
            func: (data) => (ObnizPartsBleAbstract_1.uint(data) / 0x10000) * 175 - 45,
        },
        humidity: {
            index: 20,
            length: 2,
            type: 'custom',
            func: (data) => (ObnizPartsBleAbstract_1.uint(data) / 0x10000) * 100,
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
                const range = Logtta_Accel.parseAccelRangeData(peripheral.manufacturerSpecificData[17]);
                const resolution = peripheral.manufacturerSpecificData[19];
                return Object.fromEntries(['x', 'y', 'z'].map((key, i) => [
                    key,
                    (ObnizPartsBleAbstract_1.uint(data.slice(i * 8, i * 8 + 2)) / (2 ** resolution - 1)) *
                        range,
                ]));
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
                const range = Logtta_Accel.parseAccelRangeData(peripheral.manufacturerSpecificData[17]);
                const resolution = peripheral.manufacturerSpecificData[19];
                const n = Logtta_Accel.parseAccelSamplingData(peripheral.manufacturerSpecificData[16]) * ObnizPartsBleAbstract_1.uint(peripheral.manufacturerSpecificData.slice(14, 16));
                return Object.fromEntries(['x', 'y', 'z'].map((key, i) => [
                    key,
                    (range / (2 ** resolution - 1)) *
                        Math.sqrt(ObnizPartsBleAbstract_1.uint(data.slice(i * 8 + 2, i * 8 + 8)) / n),
                ]));
            },
            scanResponse: true,
        },
    },
};
