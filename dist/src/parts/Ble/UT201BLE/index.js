"use strict";
/**
 * @packageDocumentation
 * @module Parts.UT201BLE
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** UT201BLE management class UT201BLEを管理するクラス */
class UT201BLE {
    constructor(peripheral, timezoneOffsetMinute) {
        if (!peripheral || !UT201BLE.isDevice(peripheral)) {
            throw new Error('peripheral is not UT201BLE');
        }
        this._peripheral = peripheral;
        this._timezoneOffsetMinute = timezoneOffsetMinute;
    }
    static info() {
        return {
            name: 'UT201BLE',
        };
    }
    /**
     * Verify that the received peripheral is from the UT201BLE
     *
     * 受け取ったPeripheralがUT201BLEのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is UT201BLE
     *
     * UT201BLEかどうか
     */
    static isDevice(peripheral) {
        return (peripheral.localName && peripheral.localName.startsWith('A&D_UT201BLE_'));
    }
    isPairingMode() {
        if (!this._peripheral) {
            throw new Error('UT201BLE not found');
        }
        // adv_data[2]はFlagsで、bit0が1の場合Pairng Mode(Limited Discoverable Mode)
        if (this._peripheral.adv_data[2] === 5) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Pair with the device
     *
     * デバイスとペアリング
     *
     * @returns pairing key ペアリングキー
     */
    async pairingWait() {
        if (!this._peripheral) {
            throw new Error('UT201BLE not found');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        let key = null;
        await this._peripheral.connectWait({
            pairingOption: {
                onPairedCallback: (pairingKey) => {
                    key = pairingKey;
                },
            },
        });
        const { timeChar, customServiceChar } = this._getChars();
        await this._writeTimeCharWait(this._timezoneOffsetMinute);
        // await customServiceChar.writeWait([2, 1, 3]); // disconnect req
        return key;
    }
    /**
     * Get data from the UT201BLE
     *
     * UT201BLEからデータを取得
     *
     * @param pairingKeys pairing key ペアリングキー
     *
     * @returns data from the UT201BLE UT201BLEから受け取ったデータ
     */
    async getDataWait(pairingKeys) {
        if (!this._peripheral) {
            throw new Error('UT201BLE not found');
        }
        await this._peripheral.connectWait({
            pairingOption: {
                keys: pairingKeys,
            },
        });
        if (!this._peripheral) {
            throw new Error('UT201BLE not found');
        }
        const results = [];
        const { temperatureMeasurementChar, timeChar, customServiceChar, batteryChar, } = this._getChars();
        const waitDisconnect = new Promise((resolve, reject) => {
            if (!this._peripheral)
                return;
            this._peripheral.ondisconnect = (reason) => {
                resolve(results);
            };
        });
        const battery = await batteryChar.readWait();
        await customServiceChar.writeWait([2, 0, 0xe1]); // send all data
        await this._writeTimeCharWait(this._timezoneOffsetMinute);
        await temperatureMeasurementChar.registerNotifyWait((data) => {
            results.push(this._analyzeData(data, battery));
        });
        return await waitDisconnect;
    }
    _readFloatLE(buffer, index) {
        const data = buffer.readUInt32LE(index);
        let mantissa = data & 0x00ffffff;
        if ((mantissa & 0x00800000) > 0) {
            mantissa = -1 * (~(mantissa - 0x01) & 0x00ffffff);
        }
        const exponential = data >> 24;
        return mantissa * Math.pow(10, exponential);
    }
    _analyzeData(data, battery) {
        const buf = Buffer.from(data);
        const flags = buf.readUInt8(0);
        let index = 1;
        const result = {};
        if (flags & 0x01) {
            // Fahrenheit
            result.fahrenheit = this._readFloatLE(buf, index);
            index += 4;
        }
        else {
            // Celsius
            result.celsius = this._readFloatLE(buf, index);
            index += 4;
        }
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
            const types = [
                'unknown',
                'Armpit',
                'Body',
                'Ear',
                'Finger',
                'Gastro-intestinal Tract',
                'Mouth',
                'Rectum',
                'Toe',
                'Tympanum',
            ];
            const value = buf.readUInt8(index);
            index++;
            result.temperatureType = types[value] || 'unknown';
            result.battery = battery[0];
        }
        return result;
    }
    _getChars() {
        if (!this._peripheral) {
            throw new Error('UT201BLE not found');
        }
        const temperatureMeasurementChar = this._peripheral
            .getService('1809')
            .getCharacteristic('2A1C');
        const timeChar = this._peripheral
            .getService('1809')
            .getCharacteristic('2A08');
        const customServiceChar = this._peripheral
            .getService('233bf0005a341b6d975c000d5690abe4')
            .getCharacteristic('233bf0015a341b6d975c000d5690abe4');
        const batteryChar = this._peripheral
            .getService('180F')
            .getCharacteristic('2A19');
        return {
            temperatureMeasurementChar,
            timeChar,
            customServiceChar,
            batteryChar,
        };
    }
    async _writeTimeCharWait(timeOffsetMinute) {
        const { timeChar } = this._getChars();
        const date = new Date();
        date.setTime(Date.now() + 1000 * 60 * timeOffsetMinute);
        const buf = Buffer.alloc(7);
        buf.writeUInt16LE(date.getUTCFullYear(), 0);
        buf.writeUInt8(date.getUTCMonth() + 1, 2);
        buf.writeUInt8(date.getUTCDate(), 3);
        buf.writeUInt8(date.getUTCHours(), 4);
        buf.writeUInt8(date.getUTCMinutes(), 5);
        buf.writeUInt8(date.getUTCSeconds(), 6);
        const arr = Array.from(buf);
        await timeChar.writeWait(arr);
    }
}
exports.default = UT201BLE;
