"use strict";
/**
 * @packageDocumentation
 * @module Parts.UA651BLE
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** UA651BLE management class UA651BLEを管理するクラス */
class UA651BLE {
    constructor(peripheral, timezoneOffsetMinute) {
        if (!peripheral) {
            throw new Error('no peripheral');
        }
        this._peripheral = peripheral;
        this._timezoneOffsetMinute = timezoneOffsetMinute;
    }
    static info() {
        return {
            name: 'UA651BLE',
        };
    }
    /**
     * Verify that the received peripheral is from the UA651BLE
     *
     * 受け取ったPeripheralがUA651BLEのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is UA651BLE
     *
     * UA651BLEかどうか
     */
    static isDevice(peripheral) {
        return (peripheral.localName && peripheral.localName.startsWith('A&D_UA-651BLE_'));
    }
    isPairingMode() {
        if (!this._peripheral) {
            throw new Error('UA651BLE not found');
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
            throw new Error('UA651BLE not found');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
                this.ondisconnect(reason);
            }
        };
        // let key: string | null = null;
        await this._peripheral.connectWait({
            pairingOption: {
                onPairedCallback: (pairingKey) => {
                    // console.log('pairied ' + pairingKey);
                },
            },
            waitUntilPairing: true,
            retry: 3,
        });
        const keys = await this._peripheral.getPairingKeysWait();
        if (!keys) {
            throw new Error('UA651BLE pairing failed');
        }
        const { bloodPressureMeasurementChar, timeChar, customServiceChar, } = this._getChars();
        try {
            // 自動切断されてるかもしれない
            await this._writeTimeCharWait(this._timezoneOffsetMinute);
            await customServiceChar.writeWait([2, 1, 3]); // disconnect req
        }
        catch (e) {
            // do nothing
        }
        try {
            if (this._peripheral.connected) {
                await this._peripheral.disconnectWait();
            }
        }
        catch (e) {
            // do nothing
        }
        return keys;
    }
    /**
     * Get data from the UA651BLE
     *
     * UA651BLEからデータを取得
     *
     * @returns data from the UA651BLE UA651BLEから受け取ったデータ
     */
    async getDataWait(pairingKeys) {
        if (!this._peripheral) {
            throw new Error('UA651BLE not found');
        }
        await this._peripheral.connectWait({
            pairingOption: {
                keys: pairingKeys,
            },
        });
        if (!this._peripheral) {
            throw new Error('UA651BLE not found');
        }
        const results = [];
        const { bloodPressureMeasurementChar, timeChar, customServiceChar, batteryChar, } = this._getChars();
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
        await bloodPressureMeasurementChar.registerNotifyWait((data) => {
            results.push(this._analyzeData(data, battery));
        });
        return waitDisconnect;
    }
    _readSFLOAT_LE(buffer, index) {
        const data = buffer.readUInt16LE(index);
        let mantissa = data & 0x0fff;
        if ((mantissa & 0x0800) > 0) {
            mantissa = -1 * (~(mantissa - 0x01) & 0x0fff);
        }
        const exponential = data >> 12;
        return mantissa * Math.pow(10, exponential);
    }
    _analyzeData(data, battery) {
        const buf = Buffer.from(data);
        const flags = buf.readUInt8(0);
        let index = 1;
        const result = {};
        if (flags & 0x01) {
            // Blood Pressure Unit Flag
            // kPa
            result.SystolicPressure_kPa = this._readSFLOAT_LE(buf, index);
            index += 2;
            result.DiastolicPressure_kPa = this._readSFLOAT_LE(buf, index);
            index += 2;
            result.MeanArterialPressure_kPa = this._readSFLOAT_LE(buf, index);
            index += 2;
        }
        else {
            // mmHg
            result.SystolicPressure_mmHg = this._readSFLOAT_LE(buf, index);
            index += 2;
            result.DiastolicPressure_mmHg = this._readSFLOAT_LE(buf, index);
            index += 2;
            result.MeanArterialPressure_mmHg = this._readSFLOAT_LE(buf, index);
            index += 2;
        }
        if (flags & 0x02) {
            // // Time Stamp Flag
            // TODO: get Time Stamp
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
            // Pulse Rate Flag
            result.PulseRate = this._readSFLOAT_LE(buf, index);
            index += 2;
        }
        if (flags & 0x08) {
            // UserIdFlag
            index += 1;
        }
        if (flags & 0x10) {
            // UserIdFlag
            const ms = buf[index];
            result.bodyMoved = (ms & 0b1) !== 0;
            result.cuffFitLoose = (ms & 0b10) !== 0;
            result.irregularPulseDetected = (ms & 0b100) !== 0;
            result.improperMeasurement = (ms & 0b100000) !== 0;
            index += 1;
        }
        result.battery = battery[0];
        return result;
    }
    _getChars() {
        if (!this._peripheral) {
            throw new Error('UA651BLE not found');
        }
        const bloodPressureMeasurementChar = this._peripheral
            .getService('1810')
            .getCharacteristic('2A35');
        const timeChar = this._peripheral
            .getService('1810')
            .getCharacteristic('2A08');
        const customServiceChar = this._peripheral
            .getService('233bf0005a341b6d975c000d5690abe4') // Primary Service Custom Service(pp.14)
            .getCharacteristic('233bf0015a341b6d975c000d5690abe4'); // Custom Characteristic(pp.14)
        const batteryChar = this._peripheral
            .getService('180F')
            .getCharacteristic('2A19');
        return {
            bloodPressureMeasurementChar,
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
exports.default = UA651BLE;
