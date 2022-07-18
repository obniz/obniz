"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module Parts.MINEW
 */
/* eslint rulesdir/non-ascii: 0 */
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
/** abstract class common to the MINEW devices MINEWデバイス共通の抽象クラス */
class MINEW extends ObnizPartsBleAbstract_1.ObnizPartsBle {
}
exports.default = MINEW;
/**
 * Only beacon mode support at the moment
 * 現時点ではビーコンモードのみサポート
 */
MINEW.AvailableBleMode = 'Beacon';
MINEW.ServiceUuids = 'ffe1';
MINEW.ServiceDataUUID = [0xe1, 0xff];
MINEW.getServiceDataStruct = (macAddressIndex, versionNumber, additonalData) => (Object.assign({ 
    // TODO: delete underscore
    frameType_: {
        index: 0,
        type: 'check',
        data: 0xa1,
    }, 
    // TODO: delete underscore
    versionNumber_: {
        index: 1,
        type: 'check',
        data: versionNumber,
    }, 
    // TODO: only 'battery'
    [Object.keys(additonalData).includes('batteryLevel')
        ? 'batteryLevel'
        : 'battery']: {
        index: 2,
        type: 'unsignedNumBE',
    }, 
    // TODO: delete underscore
    macAddress_: {
        index: macAddressIndex,
        length: 6,
        type: 'check',
    } }, additonalData));
