"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_Accel
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Logtta_Accel management class Logtta_Accelを管理するクラス */
class Logtta_Accel {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: 'Logtta_Accel',
        };
    }
    /**
     * Verify that the received peripheral is from the Logtta_Accel
     *
     * 受け取ったPeripheralがLogtta_Accelのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_Accel
     *
     * Logtta_Accelかどうか
     */
    static isDevice(peripheral) {
        const advertise = peripheral.advertise_data_rows.filter((adv) => {
            let find = false;
            if (this.deviceAdv.length > adv.length) {
                return find;
            }
            for (let index = 0; index < this.deviceAdv.length; index++) {
                if (this.deviceAdv[index] === -1) {
                    continue;
                }
                if (adv[index] === this.deviceAdv[index]) {
                    find = true;
                    continue;
                }
                find = false;
                break;
            }
            return find;
        });
        return advertise.length !== 0;
    }
    /**
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
Logtta_Accel.deviceAdv = [
    0xff,
    0x10,
    0x05,
    0x05,
];
