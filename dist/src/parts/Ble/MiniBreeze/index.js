"use strict";
/**
 * @packageDocumentation
 * @module Parts.MiniBreeze
 */
Object.defineProperty(exports, "__esModule", { value: true });
class MiniBreeze {
    constructor() {
        this._peripheral = null;
        // non-wired device
        this.keys = [];
        this.requiredKeys = [];
        this.params = {};
    }
    static info() {
        return { name: "MiniBreeze" };
    }
    static gasType() {
        return {
            0: "none",
            1: "HCHO",
            2: "CO",
            3: "CO2",
            5: "Rn",
            6: "PM1.0",
            7: "PM2.5",
            8: "PM10",
        };
    }
    static status() {
        return {
            0: "BatteryEmpty",
            1: "BatteryLow",
            2: "BatteryNormal",
            3: "BatteryCharging",
        };
    }
    static isDevice(peripheral) {
        if (peripheral.adv_data.length !== 31 || !this._hasPrefix(peripheral)) {
            return false;
        }
        return true;
    }
    static getData(peripheral) {
        if (!this._hasPrefix(peripheral)) {
            return null;
        }
        if (!peripheral.adv_data || peripheral.adv_data.length !== 31 || !peripheral.localName) {
            return null;
        }
        const buf = Buffer.from(peripheral.adv_data.splice(7));
        const gasType = MiniBreeze.gasType()[buf.readUInt8(0)] || "unknown";
        const sensVal = buf.readUInt16LE(1);
        const temperature = buf.readUInt8(3);
        const humidity = buf.readUInt8(4);
        const version = buf.readUInt8(5) + "." + buf.readUInt8(6) + "." + buf.readUInt8(7);
        const status = MiniBreeze.status()[buf.readUInt8(9)] || "Invalid";
        return {
            gasType,
            sensVal,
            temperature,
            humidity,
            version,
            status,
            devName: peripheral.localName,
        };
    }
    static _hasPrefix(peripheral) {
        if (!peripheral.adv_data || peripheral.adv_data.length < 10) {
            return false;
        }
        const target = [
            // flag
            0x02,
            0x01,
            0x06,
            // ManufactureData
            0x0d,
            0xff,
            0xff,
            0x02,
        ];
        for (const index in target) {
            if (target[index] >= 0 && target[index] !== peripheral.adv_data[index]) {
                return false;
            }
        }
        return true;
    }
    wired(obniz) { }
}
exports.default = MiniBreeze;
