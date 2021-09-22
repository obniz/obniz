"use strict";
/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const Logtta_1 = __importDefault(require("../utils/abstracts/Logtta"));
class Logtta_AD extends Logtta_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = Logtta_AD;
    }
    /** @deprecated */
    static isDevice(peripheral) {
        return this.getDeviceMode(peripheral) === 'Connectable';
    }
    static parseAmpereData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (16 / 916) * func(data);
    }
    static parseVoltData(data, func = ObnizPartsBleAbstract_1.uint) {
        return (4 / 916) * func(data);
    }
    async getAmpereWait() {
        return (await this.getDataWait()).ampere;
    }
    async getVoltWait() {
        return (await this.getDataWait()).volt;
    }
    async getCountWait() {
        return (await this.getDataWait()).count;
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
    parseData(data) {
        return {
            ampere: this.staticClass.parseAmpereData(data.slice(0, 2), ObnizPartsBleAbstract_1.uintBE),
            volt: this.staticClass.parseVoltData(data.slice(0, 2), ObnizPartsBleAbstract_1.uintBE),
            count: ObnizPartsBleAbstract_1.uintBE(data.slice(2, 4)),
        };
    }
}
exports.default = Logtta_AD;
Logtta_AD.PartsName = 'Logtta_AD';
Logtta_AD.ServiceUuids = {
    Connectable: '4e43ae20-6687-4f3c-a1c3-1c327583f29d',
    Beacon: null,
};
Logtta_AD.BeaconDataStruct = {
    Connectable: null,
    Beacon: {
        appearance: {
            index: 0,
            type: 'check',
            data: 0x04,
        },
        ampere: {
            index: 1,
            length: 2,
            type: 'custom',
            func: (data) => Logtta_AD.parseAmpereData(data, ObnizPartsBleAbstract_1.uintBE),
        },
        volt: {
            index: 1,
            length: 2,
            type: 'custom',
            func: (data) => Logtta_AD.parseVoltData(data, ObnizPartsBleAbstract_1.uintBE),
        },
        count: {
            index: 3,
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
    },
};
