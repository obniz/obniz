"use strict";
/**
 * @packageDocumentation
 * @module Parts.HEM-9200T
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** HEM_9200T management class HEM_9200Tを管理するクラス */
class HEM_9200T {
    constructor(peripheral, options = {}) {
        this.keys = [];
        this.requiredKeys = [];
        this._peripheral = null;
        // if (peripheral && !HEM_9200T.isDevice(peripheral)) {
        //   throw new Error("peripheral is not HEM_9200T");
        // }
        this._peripheral = peripheral;
        this._timezoneOffsetMinute = options.timezoneOffsetMinute || 0;
        this._passkey = options.passkey || 0;
    }
    static info() {
        return {
            name: 'HEM_9200T',
        };
    }
    /**
     * Verify that the received peripheral is from the HEM_9200T
     *
     * 受け取ったPeripheralがHEM_9200Tのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the HEM_9200T
     *
     * HEM_9200Tかどうか
     */
    static isDevice(peripheral) {
        if (peripheral.localName &&
            (peripheral.localName.startsWith('BLESmart_') ||
                peripheral.localName.startsWith('BLEsmart_'))) {
            return true;
        }
        return false;
    }
    /**
     * Connect to the device, get data, and then disconnect from the device
     *
     * You can get only data that the device has not yet sent
     *
     * デバイスに接続しデータを取得後、デバイスとの接続を切断
     *
     * 取得できるデータはデバイスが未送信のデータのみです
     *
     * @returns received data from the HEM_9200T HEM_9200Tから受け取ったデータ
     */
    async getDataWait() {
        if (!this._peripheral) {
            throw new Error('HEM_9200T is not find.');
        }
        // console.log(`connecting HEM passkey ${this._passkey}`);
        await this._peripheral.connectWait({
            pairingOption: {
                passkeyCallback: async () => {
                    // console.log(`passkey called`);
                    return this._passkey;
                },
            },
        });
        // console.log(`connected HEM`);
        // const passkeyCallback = async () => {
        //   // HTML prompt
        //   const pass = 16393;
        //   return pass;
        // };
        // // pairing with user input passkey.
        // console.log("connected. pairing...");
        // const key = await this._peripheral.pairingWait({ passkeyCallback });
        // console.log("paired");
        const results = [];
        // TODO: check alternative method
        // eslint-disable-next-line no-async-promise-executor
        return await new Promise(async (resolve) => {
            this._peripheral.ondisconnect = (reason) => {
                resolve(results);
            };
            await this.subscribeWait('1805', '2A2B'); // current time
            await this.subscribeWait('180F', '2A19'); // battery level
            await this.subscribeWait('1810', '2A35', async (data) => {
                // console.log(data);
                results.push(this._analyzeData(data));
            }); // blood pressure
        });
        /* const waitDisconnect = new Promise<HEM_9200TResult[]>((resolve, reject) => {
          this._peripheral!.ondisconnect = (reason: any) => {
            resolve(results);
          };
        });
        await this.subscribeWait('1805', '2A2B'); // current time
        await this.subscribeWait('180F', '2A19'); // battery level
        await this.subscribeWait('1810', '2A35', async (data: any) => {
          // console.log(data);
          results.push(this._analyzeData(data));
        }); // blood pressure
        return await waitDisconnect;*/
    }
    /**
     * Execute a callback function when data is received from any service characteristic
     *
     * 任意のサービス・キャラクタティスティックからデータを受け取ると、コールバック関数を実行
     *
     * @param service service サービス
     *
     * @param char characteristic キャラクタリスティック
     *
     * @param callback callback function when received data
     * データを受け取ったときのコールバック関数
     */
    async subscribeWait(service, char, callback) {
        if (!this._peripheral) {
            throw new Error('HEM_9200T is not find.');
        }
        const characteristics = this._peripheral
            .getService(service)
            .getCharacteristic(char);
        await characteristics.registerNotifyWait(async (data) => {
            if (callback) {
                callback(data);
            }
        });
    }
    _analyzeData(data) {
        const buf = Buffer.from(data);
        const flags = buf.readUInt8(0);
        let index = 1;
        const result = {};
        let scale = 1;
        if (flags & 0x01) {
            // kPa
            scale = 7.501;
        }
        result.bloodPressure = {
            systolic: this._readSFloat(buf, index) * scale,
            diastolic: this._readSFloat(buf, index + 2) * scale,
            meanArterialPressure: this._readSFloat(buf, index + 4) * scale,
            unit: 'mmHg',
        };
        index += 6;
        if (flags & 0x02) {
            // Time Stamp field present
            result.date = {
                year: buf.readUInt16LE(index),
                month: buf.readUInt8(index + 2),
                day: buf.readUInt8(index + 3),
                hour: buf.readUInt8(index + 4),
                minute: buf.readUInt8(index + 5),
                second: buf.readUInt8(index + 6),
            };
            index += 7;
        }
        if (flags & 0x04) {
            result.pulseRate = this._readSFloat(buf, index);
            index += 2;
        }
        if (flags & 0x08) {
            result.userId = buf.readUInt8(index);
            index += 1;
        }
        if (flags & 0x10) {
            const statusFlag = {
                0x01: 'BodyMovementDetection',
                0x02: 'CuffFitDetection',
                0x04: 'IrregularPulseDetection',
                0x08: 'PulseRateRangeDetection',
                0x10: 'MeasurementPositionDetection',
            };
            const mesurementStatus = buf.readUInt16LE(index);
            index++;
            result.measurementStatus = [];
            for (const f in statusFlag) {
                if (+f & mesurementStatus) {
                    result.measurementStatus.push(statusFlag[f]);
                }
            }
        }
        return result;
    }
    _readSFloat(buffer, index) {
        const data = buffer.readUInt16LE(index);
        let mantissa = data & 0x0fff;
        if ((mantissa & 0x0800) > 0) {
            mantissa = -1 * (0x0fff + 1 - mantissa);
        }
        const exponential = data >> 12;
        return mantissa * Math.pow(10, exponential);
    }
}
exports.default = HEM_9200T;
