"use strict";
/**
 * @packageDocumentation
 * @module Parts.UA651BLE
 */
Object.defineProperty(exports, "__esModule", { value: true });
class UA651BLE {
    constructor(peripheral, timezoneOffsetMinute) {
        if (!peripheral) {
            throw new Error("no peripheral");
        }
        this._peripheral = peripheral;
        this._timezoneOffsetMinute = timezoneOffsetMinute;
    }
    static info() {
        return {
            name: "UA651BLE",
        };
    }
    static isDevice(peripheral) {
        return peripheral.localName && peripheral.localName.startsWith("A&D_UA-651BLE_");
    }
    async getDataWait() {
        if (!this._peripheral) {
            throw new Error("UA651BLE not found");
        }
        if (!this._peripheral.connected) {
            this._peripheral.ondisconnect = (reason) => {
                if (this.ondisconnect) {
                    this.ondisconnect(reason);
                }
            };
            await this._peripheral.connectWait();
        }
        return await new Promise(async (resolve, reject) => {
            if (!this._peripheral) {
                throw new Error("UA651BLE not found");
            }
            const results = [];
            const { bloodPressureMeasurementChar, timeChar, customServiceChar } = this._getChars();
            await customServiceChar.writeWait([2, 0, 0xe1]); // send all data
            await this._writeTimeChar(this._timezoneOffsetMinute);
            await bloodPressureMeasurementChar.registerNotifyWait((data) => {
                results.push(this._analyzeData(data));
            });
            this._peripheral.ondisconnect = (reason) => {
                resolve(results);
                if (this.ondisconnect) {
                    this.ondisconnect(reason);
                }
            };
        });
    }
    _readFLOAT_LE(buffer, index) {
        const data = buffer.readUInt32LE(index);
        let mantissa = data & 0x00ffffff;
        if ((mantissa & 0x00800000) > 0) {
            mantissa = -1 * (~(mantissa - 0x01) & 0x00ffffff);
        }
        const exponential = data >> 24;
        return mantissa * Math.pow(10, exponential);
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
            // // Time Stamp Flag
            // TODO: get Time Stamp
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
        return result;
    }
    _getChars() {
        if (!this._peripheral) {
            throw new Error("UA651BLE not found");
        }
        const bloodPressureMeasurementChar = this._peripheral
            .getService("1810")
            .getCharacteristic("2A35");
        const timeChar = this._peripheral.getService("1810").getCharacteristic("2A08");
        const customServiceChar = this._peripheral
            .getService("233bf0005a341b6d975c000d5690abe4") // Primary Service Custom Service(pp.14)
            .getCharacteristic("233bf0015a341b6d975c000d5690abe4"); // Custom Characteristic(pp.14)
        return {
            bloodPressureMeasurementChar,
            timeChar,
            customServiceChar,
        };
    }
    async _writeTimeChar(timeOffsetMinute) {
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
