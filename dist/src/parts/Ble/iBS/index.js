"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
const magic = {
    1: [0x80, 0xbc],
    1.1: [0x81, 0xbc],
    2: [0x82, 0xbc],
    3: [0x83, 0xbc],
    4: [0x83, 0xbc],
};
class BaseIBS extends ObnizPartsBleInterface_1.ObnizPartsBle {
    static getUniqueData(series, subtype, addLength, scanResponse) {
        return {
            magic: {
                index: 0,
                length: 2,
                type: 'check',
                data: magic[series],
                scanResponse,
            },
            subtype: {
                index: 11 + ((addLength !== null && addLength !== void 0 ? addLength : 0)),
                type: 'check',
                data: subtype,
                scanResponse,
            },
        };
    }
    /**
     * @deprecated
     */
    static getData(peripheral) {
        if (!this.isDevice(peripheral)) {
            return null;
        }
        const lib = new this(peripheral, 'Beacon');
        return lib.getData();
    }
}
exports.BaseIBS = BaseIBS;
BaseIBS.AvailableBleMode = 'Beacon';
BaseIBS.Address = undefined;
BaseIBS.LocalName = undefined;
BaseIBS.CompanyID = [0x0d, 0x00];
BaseIBS.Config = {
    battery: {
        index: 2,
        length: 2,
        type: 'unsignedNumLE',
        multiple: 0.01,
    },
    button: {
        index: 4,
        type: 'bool0001',
    },
    moving: {
        index: 4,
        type: 'bool0010',
    },
    /** HallSensor / Reed / Event */
    event: {
        index: 4,
        type: 'bool0100',
    },
    fall: {
        index: 4,
        type: 'bool1000',
    },
    acceleration: {
        index: 4,
        length: 18,
        type: 'xyz',
    },
    temperature: {
        index: 5,
        length: 2,
        type: 'numLE',
        multiple: 0.01,
    },
    humidity: {
        index: 7,
        length: 2,
        type: 'numLE',
    },
};
class BaseIBS01 extends BaseIBS {
}
exports.BaseIBS01 = BaseIBS01;
BaseIBS01.CompanyID = [0x59, 0x00];
exports.default = BaseIBS;
