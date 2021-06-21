"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
/**
 * @deprecated
 * Recommend use iBS01G, iBS01H, iBS01T
 * Use only if you are using an old iBS01 series sensor
 */
class IBS01 extends iBS_1.BaseIBS01 {
    constructor() {
        super(...arguments);
        this.static = IBS01;
    }
}
exports.default = IBS01;
IBS01.PartsName = 'iBS01';
IBS01.BeaconDataStruct = {
    battery: iBS_1.BaseIBS01.Config.battery,
    button: iBS_1.BaseIBS01.Config.button,
    moving: iBS_1.BaseIBS01.Config.moving,
    hall_sensor: iBS_1.BaseIBS01.Config.event,
    fall: iBS_1.BaseIBS01.Config.fall,
    // subtype=0x03 older version has no subtype
    magic: iBS_1.BaseIBS01.getUniqueData(1, -1).magic,
};
