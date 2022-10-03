"use strict";
/**
 * @packageDocumentation
 * @module Parts.STM550B
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const round_to_1 = __importDefault(require("round-to"));
const dataSizeTable = {
    0b00: 1,
    0b01: 2,
    0b10: 4,
    0b11: 255,
};
const dataTypeTable = {
    0x00: { type: 'temperature', encoding: 'numLE' },
    0x01: { type: 'voltage', encoding: 'numLE' },
    0x02: { type: 'energy_level', encoding: 'unsignedNumLE' },
    0x04: { type: 'illumination_solar_cell', encoding: 'unsignedNumLE' },
    0x05: { type: 'illumination_sensor', encoding: 'unsignedNumLE' },
    0x06: { type: 'humidity', encoding: 'unsignedNumLE' },
    0x0a: { type: 'acceleration_vector', encoding: 'unsignedNumLE' },
    0x23: { type: 'magnet_contact', encoding: 'bool0001' },
};
const readData = (rawData, dataSize, encoding) => {
    switch (encoding) {
        case 'numBE':
            if (dataSize === 1) {
                return rawData.readInt8(0);
            }
            else if (dataSize === 2) {
                return rawData.readInt16BE(0);
            }
            return rawData.readInt32BE(0);
        case 'numLE':
            if (dataSize === 1) {
                return rawData.readInt8(0);
            }
            else if (dataSize === 2) {
                return rawData.readInt16LE(0);
            }
            return rawData.readInt32LE(0);
        case 'unsignedNumBE':
            if (dataSize === 1) {
                return rawData.readUInt8(0);
            }
            else if (dataSize === 2) {
                return rawData.readUInt16BE(0);
            }
            return rawData.readUInt32BE(0);
        case 'unsignedNumLE':
            if (dataSize === 1) {
                return rawData.readUInt8(0);
            }
            else if (dataSize === 2) {
                return rawData.readUInt16LE(0);
            }
            else if (dataSize === 4) {
                return readAcceleVector(rawData.readUInt32LE(0));
            }
            return rawData.readUInt32LE(0);
        case 'bool0001':
            if (rawData.readUInt8(0) & 0x01) {
                return true;
            }
            return false;
    }
};
const readAcceleVector = (data) => {
    const status = (data & 0xc0000000) >> 30;
    const z = (data & 0x3ff00000) >> 20;
    const y = (data & 0x000ffc00) >> 10;
    const x = data & 0x000003ff;
    return { x: (x - 512) / 100, y: (y - 512) / 100, z: (z - 512) / 100 };
};
const findType = (type, multiple = 1, precision = 0) => {
    return (data, peripheral) => {
        const buf = Buffer.from(data);
        for (let i = 0; i < buf.length;) {
            const descriptor = buf.readUInt8(i);
            const dataSizeType = (descriptor >> 6) & 0x03;
            const dataSize = dataSizeTable[dataSizeType];
            const dataTypeNumber = descriptor & 0x3f;
            const dataType = dataTypeTable[dataTypeNumber];
            if (!dataType || dataType.type !== type) {
                i += dataSize + 1;
                continue;
            }
            const rawData = buf.slice(i + 1, i + 1 + dataSize);
            let result = readData(rawData, dataSize, dataType.encoding);
            if (result && typeof result === 'number') {
                result = (0, round_to_1.default)(result * multiple, precision);
            }
            return result;
        }
        return undefined;
    };
};
const t = {
    index: 4,
    length: 255,
    type: 'custom',
    func: findType('temperature', 0.01),
};
class STM550B extends ObnizPartsBleAbstract_1.ObnizPartsBle {
    constructor(peripheral, mode) {
        super(peripheral, mode);
        this.staticClass = STM550B;
    }
}
exports.default = STM550B;
STM550B.PartsName = 'STM550B';
STM550B.AvailableBleMode = 'Beacon';
STM550B.BeaconDataStruct = {
    temperature: {
        index: 4,
        length: 255,
        type: 'custom',
        func: findType('temperature', 0.01),
    },
    voltage: {
        index: 4,
        length: 255,
        type: 'custom',
        func: findType('voltage', 0.5),
    },
    energy_level: {
        index: 4,
        length: 255,
        type: 'custom',
        func: findType('energy_level', 0.5),
    },
    illumination_solar_cell: {
        index: 4,
        length: 255,
        type: 'custom',
        func: findType('illumination_solar_cell'),
    },
    illumination_sensor: {
        index: 4,
        length: 255,
        type: 'custom',
        func: findType('illumination_sensor'),
    },
    humidity: {
        index: 4,
        length: 255,
        type: 'custom',
        func: findType('humidity', 0.5),
    },
    magnet_contact: {
        index: 7,
        length: 255,
        type: 'custom',
        func: findType('magnet_contact'),
    },
    acceleration_vector: {
        index: 7,
        length: 255,
        type: 'custom',
        func: findType('acceleration_vector'),
    },
};
STM550B.CompanyID = {
    Beacon: [0xda, 0x03],
};
