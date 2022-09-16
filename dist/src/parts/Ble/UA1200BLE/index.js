"use strict";
/**
 * @packageDocumentation
 * @module Parts.UA1200BLE
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** UA1200BLE management class UA1200BLEを管理するクラス */
class UA1200BLE {
    constructor(peripheral, timezoneOffsetMinute) {
        if (!peripheral || !UA1200BLE.isDevice(peripheral)) {
            throw new Error('peripheral is not UA1200BLE');
        }
        this._peripheral = peripheral;
        this._timezoneOffsetMinute = timezoneOffsetMinute;
    }
    static info() {
        return {
            name: 'UA1200BLE',
        };
    }
    /**
     * Verify that the received peripheral is from the UA1200BLE
     *
     * 受け取ったPeripheralがUA1200BLEのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is UA1200BLE
     *
     * UA1200BLEかどうか
     */
    static isDevice(peripheral) {
        return (peripheral.localName && peripheral.localName.startsWith('UA-1200BLE_'));
    }
    /**
     * Judge whether it is cooperation mode
     *
     * (When in cooperation mode, no data exists even when connected)
     *
     * 連携モードかどうかの判定
     *
     * (連携モードのときは接続してもデータが存在しません)
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is cooperation mode or not
     *
     * 連携モードかどうか
     */
    static isCooperationMode(peripheral) {
        const peripheralHex = peripheral.adv_data
            .map((e) => e.toString(16))
            .join('');
        const peripheralArray = [
            // "2",
            // "1",
            // "6",
            // "11",
            // "7",
            'e4',
            'ab',
            '90',
            '56',
            'd',
            '0',
            '5c',
            '97',
            '6d',
            '1b',
            '34',
            '5a',
            '0',
            'f0',
            '3b',
            '23',
            // "5",
            // "ff",
            // "69",
            // "0",
            // "0",
            // "ff",
        ].join('');
        return peripheralHex.indexOf(peripheralArray) > -1;
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
            throw new Error('UA1200BLE not found');
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
        const { customServiceChar } = this._getCharsCoopMode();
        await customServiceChar.writeWait([2, 1, 3]); // disconnect req
        return key;
    }
    /**
     * Get data from the UA1200BLE
     *
     * UA1200BLEからデータを取得
     *
     * @returns data from the UA1200BLE UA1200BLEから受け取ったデータ
     */
    async getDataWait() {
        if (!this._peripheral) {
            throw new Error('UA1200BLE not found');
        }
        this._peripheral.ondisconnect = (reason) => {
            if (this.ondisconnect) {
                this.ondisconnect(reason);
            }
        };
        await this._peripheral.connectWait();
        if (!this._peripheral) {
            throw new Error('UA1200BLE not found');
        }
        const results = [];
        // Advertise mode (BP-00 or BP-01 in pp.7)
        // const { bloodPressureMeasurementChar, customServiceChar } = this._getCharsCoopMode();
        // await customServiceChar.writeWait([2, 0, 0xe1]);
        // bloodPressureMeasurementChar.registerNotifyWait((data: number[]) => {
        //   results.push(this._analyzeData(data));
        // });
        // await this._writeTimeCharWait(this._timezoneOffsetMinute);
        // await this._writeCCCDChar();
        const { bloodPressureMeasurementChar, timeChar, } = this._getCharsSingleMode();
        await this._writeTimeCharWait(this._timezoneOffsetMinute);
        await bloodPressureMeasurementChar.registerNotifyWait((data) => {
            results.push(this._analyzeData(data));
        });
        return await new Promise((resolve, reject) => {
            if (!this._peripheral)
                return;
            this._peripheral.ondisconnect = (reason) => {
                resolve(results);
                if (this.ondisconnect) {
                    this.ondisconnect(reason);
                }
            };
        });
    }
    _readSFLOAT_LE(buffer, index) {
        // convert SFLOAT Little Endian (not sfloat!) to numerical value
        const data = buffer.readUInt16LE(index);
        let mantissa = data & 0x0fff;
        if ((mantissa & 0x0800) > 0) {
            mantissa = -1 * (~(mantissa - 0x01) & 0x0fff);
        }
        const exponential = data >> 12;
        return mantissa * Math.pow(10, exponential);
    }
    _analyzeData(data) {
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
            // Time Stamp Flag
            // TODO: get Time stamp
            // result.date = {
            //   year: buf.readUInt16LE(index),
            //   month: buf.readUInt8(index + 2),
            //   day: buf.readUInt8(index + 3),
            //   hour: buf.readUInt8(index + 4),
            //   minute: buf.readUInt8(index + 5),
            //   second: buf.readUInt8(index + 6),
            // };
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
        return result;
    }
    _getCharsCoopMode() {
        if (!this._peripheral) {
            throw new Error('UA1200BLE not found');
        }
        const bloodPressureMeasurementChar = this._peripheral
            .getService('1810')
            .getCharacteristic('2A35');
        const customServiceChar = this._peripheral
            .getService('233bf0005a341b6d975c000d5690abe4') // Primary Service Custom Service(pp.26)
            .getCharacteristic('233bf0015a341b6d975c000d5690abe4'); // Custom Characteristic(pp.27)
        return {
            bloodPressureMeasurementChar,
            customServiceChar,
        };
    }
    _getCharsSingleMode() {
        if (!this._peripheral) {
            throw new Error('UA1200BLE not found');
        }
        const bloodPressureMeasurementChar = this._peripheral
            .getService('1810')
            .getCharacteristic('2A35');
        const timeChar = this._peripheral
            .getService('1805')
            .getCharacteristic('2A2B');
        // const CCCDChar = this._peripheral.getService("1810")!.getCharacteristic("2902")!;
        return {
            bloodPressureMeasurementChar,
            timeChar,
            // CCCDChar,
        };
    }
    async _writeTimeCharWait(timeOffsetMinute) {
        const { timeChar } = this._getCharsSingleMode();
        const date = new Date();
        date.setTime(Date.now() + 1000 * 60 * timeOffsetMinute);
        const buf = Buffer.alloc(9);
        // Current Time Service(pp.11)
        buf.writeUInt16LE(date.getUTCFullYear(), 0);
        buf.writeUInt8(date.getUTCMonth() + 1, 2);
        buf.writeUInt8(date.getUTCDate(), 3);
        buf.writeUInt8(date.getUTCHours(), 4);
        buf.writeUInt8(date.getUTCMinutes(), 5);
        buf.writeUInt8(date.getUTCSeconds(), 6);
        buf.writeUInt8(date.getDay(), 7);
        buf.writeUInt8(0, 8);
        const arr = Array.from(buf);
        await timeChar.writeWait(arr);
    }
}
exports.default = UA1200BLE;
