"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const Logtta_1 = __importDefault(require("../utils/abstracts/Logtta"));
class Logtta_CO2 extends Logtta_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = Logtta_CO2;
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
    async getWait() {
        try {
            return await this.getDataWait();
        }
        catch (_a) {
            return null;
        }
    }
    /** @deprecated */
    setBeaconMode(enable) {
        return this.setBeaconModeWait(enable);
    }
    parseData(data) {
        return ObnizPartsBleAbstract_1.uintBE(data);
    }
}
exports.default = Logtta_CO2;
Logtta_CO2.PartsName = 'Logtta_CO2';
Logtta_CO2.ServiceUuids = {
    Connectable: '31f3ab20-bd1c-46b1-91e4-f57abcf7d449',
    Beacon: null,
};
Logtta_CO2.BeaconDataStruct = {
    Connectable: null,
    Beacon: {
        appearance: {
            index: 0,
            type: 'check',
            data: 0x02,
        },
        co2: {
            index: 1,
            length: 2,
            type: 'unsignedNumBE',
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
          index: 8,
          type: 'uint8',
        },
        name: {
          index: 9,
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
