"use strict";
/**
 * @packageDocumentation
 * @module Parts.UA651BLE
 */
Object.defineProperty(exports, "__esModule", { value: true });
class UA651BLE {
    constructor(peripheral, timezoneOffsetMinute) {
        if (!peripheral || !UA651BLE.isDevice(peripheral)) {
            throw new Error("peripheral is not UA651BLE");
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
    async pairingWait() {
        if (!this._peripheral) {
            throw new Error("UA651BLE not found");
        }
        this._peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === "function") {
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
        await this._writeTimeChar(this._timezoneOffsetMinute);
        await customServiceChar.writeWait([2, 1, 3]); // disconnect req
        return key;
    }
    async getDataWait(pairingKeys) {
        if (!this._peripheral) {
            throw new Error("UA651BLE not found");
        }
        await this._peripheral.connectWait({
            pairingOption: {
                keys: pairingKeys,
            },
        });
        return await new Promise(async (resolve, reject) => {
            if (!this._peripheral) {
                throw new Error("UA651BLE not found");
            }
            const results = [];
            const { bloodPressureMeasurementChar, timeChar, customServiceChar } = this._getChars();
            await customServiceChar.writeWait([2, 0, 0xe1]); // send all data
            await this._writeTimeChar(this._timezoneOffsetMinute);
            bloodPressureMeasurementChar.registerNotifyWait((data) => {
                results.push(this._analyzeData(data));
            });
            this._peripheral.ondisconnect = (reason) => {
                resolve(results);
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
        // if (flags & 0x01) {
        //   // Fahrenheit
        //   result.fahrenheit = this._readFloatLE(buf, index);
        //   index += 4;
        // } else {
        //   // Celsius
        //   result.celsius = this._readFloatLE(buf, index);
        //   index += 4;
        // }
        // if (flags & 0x02) {
        //   // Time Stamp field present
        //   result.date = {
        //     year: buf.readUInt16LE(index),
        //     month: buf.readUInt8(index + 2),
        //     day: buf.readUInt8(index + 3),
        //     hour: buf.readUInt8(index + 4),
        //     minute: buf.readUInt8(index + 5),
        //     second: buf.readUInt8(index + 6),
        //   };
        //   index += 7;
        // }
        // if (flags & 0x04) {
        //   const types = [
        //     "unknown",
        //     "Armpit",
        //     "Body",
        //     "Ear",
        //     "Finger",
        //     "Gastro-intestinal Tract",
        //     "Mouth",
        //     "Rectum",
        //     "Toe",
        //     "Tympanum",
        //   ];
        //   const value = buf.readUInt8(index);
        //   index++;
        //   result.temperatureType = types[value] || "unknown";
        // }
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
        return result;
    }
    _getChars() {
        if (!this._peripheral) {
            throw new Error("UA651BLE not found");
        }
        // const temperatureMeasurementChar: BleRemoteCharacteristic = this._peripheral
        //   .getService("1809")!
        //   .getCharacteristic("2A1C")!;
        // const timeChar = this._peripheral.getService("1809")!.getCharacteristic("2A08")!;
        // const customServiceChar = this._peripheral
        //   .getService("233bf0005a341b6d975c000d5690abe4")!
        //   .getCharacteristic("233bf0015a341b6d975c000d5690abe4")!;
        // return {
        //   temperatureMeasurementChar,
        //   timeChar,
        //   customServiceChar,
        // };
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
