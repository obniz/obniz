"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseiBS01 = exports.BaseiBS = void 0;
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
const magic = {
    1: [0x80, 0xbc],
    1.1: [0x81, 0xbc],
    2: [0x82, 0xbc],
    3: [0x83, 0xbc],
    4: [0x83, 0xbc],
    5: [0x83, 0xbc],
};
/** abstract class common to the iBS series iBSシリーズ共通の抽象クラス */
class BaseiBS extends ObnizPartsBleAbstract_1.ObnizPartsBle {
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
                index: 11 + (addLength !== null && addLength !== void 0 ? addLength : 0),
                type: 'check',
                data: subtype,
                scanResponse,
            },
        };
    }
}
exports.BaseiBS = BaseiBS;
BaseiBS.AvailableBleMode = 'Beacon';
BaseiBS.BeaconDataLength = 0x12;
BaseiBS.CompanyID = [0x0d, 0x00];
BaseiBS.Config = {
    battery: {
        index: 2,
        length: 2,
        type: 'unsignedNumLE',
        multiple: 0.01,
        round: 2,
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
        round: 2,
    },
    humidity: {
        index: 7,
        length: 2,
        type: 'numLE',
    },
    count: {
        index: 7,
        length: 2,
        type: 'unsignedNumLE',
    },
    user: {
        index: 9,
        length: 2,
        type: 'unsignedNumLE',
    },
};
/** abstract class for iBS iBS01のための抽象クラス */
class BaseiBS01 extends BaseiBS {
}
exports.BaseiBS01 = BaseiBS01;
BaseiBS01.CompanyID = [0x59, 0x00];
exports.default = BaseiBS;
