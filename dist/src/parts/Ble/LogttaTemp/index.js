"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const Logtta_1 = __importDefault(require("../utils/abstracts/Logtta"));
class Logtta_TH extends Logtta_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = Logtta_TH;
    }
    static parseTemperatureData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (func(data) / 0x10000) * 175.72 - 46.85;
    }
    static parseHumidityData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (func(data) / 0x10000) * 125 - 6;
    }
    /** @deprecated */
    static isDevice(peripheral) {
        return this.getDeviceMode(peripheral) === 'Connectable';
    }
    /** @deprecated */
    static isAdvDevice(peripheral) {
        return this.getDeviceMode(peripheral) === 'Beacon';
    }
    /** @deprecated */
    async getAllWait() {
        try {
            return await this.getDataWait();
        }
        catch (_a) {
            return null;
        }
    }
    async getTemperatureWait() {
        return (await this.getDataWait()).temperature;
    }
    async getHumidityWait() {
        return (await this.getDataWait()).humidity;
    }
    /** @deprecated */
    setBeaconMode(enable) {
        return this.setBeaconModeWait(enable);
    }
    parseData(data) {
        return {
            temperature: Logtta_TH.parseTemperatureData(data.slice(0, 2)),
            humidity: Logtta_TH.parseHumidityData(data.slice(2, 4)),
        };
    }
}
exports.default = Logtta_TH;
Logtta_TH.PartsName = 'Logtta_TH';
Logtta_TH.AvailableBleMode = [
    'Connectable',
    'Beacon',
];
Logtta_TH.LocalName = {
    Connectable: undefined,
    Beacon: /null/,
};
Logtta_TH.ServiceUuids = {
    Connectable: 'f7eeaa20-276e-4165-aa69-7e3de7fc627e',
    Beacon: null,
};
Logtta_TH.BeaconDataStruct = {
    Connectable: null,
    Beacon: {
        appearance: {
            index: 0,
            type: 'check',
            data: 0x01,
        },
        temperature: {
            index: 1,
            length: 2,
            type: 'custom',
            func: (data) => Logtta_TH.parseTemperatureData(data, ObnizPartsBleAbstract_1.uintBE),
        },
        humidity: {
            index: 3,
            length: 2,
            type: 'custom',
            func: (data) => Logtta_TH.parseHumidityData(data, ObnizPartsBleAbstract_1.uintBE),
        },
        battery: {
            index: 5,
            type: 'unsignedNumBE',
        },
        interval: {
            index: 6,
            length: 2,
            type: 'unsignedNumBE',
        },
        /* alert: {
          index: 7,
          type: 'uint8',
        },
        name: {
          index: 8,
          length: 15,
          type: 'string',
        } */
        // TODO: delete
        address: {
            index: 0,
            type: 'custom',
            func: (data, peripheral) => peripheral.address,
        },
    },
};
