"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS01 extends iBS_1.BaseIBS01 {
    constructor() {
        super(...arguments);
        this.static = IBS01;
    }
    /**
     * @deprecated
     */
    static isDevice(peripheral, strictCheck = false) {
        if (!strictCheck)
            delete this.BeaconDataStruct.magic;
        return this.getDeviceMode(peripheral) !== null;
    }
}
exports.default = IBS01;
IBS01.PartsName = 'iBS01';
IBS01.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS01.Config.battery, button: iBS_1.BaseIBS01.Config.button, moving: iBS_1.BaseIBS01.Config.moving, hall_sensor: iBS_1.BaseIBS01.Config.event, fall: iBS_1.BaseIBS01.Config.fall }, iBS_1.BaseIBS01.getUniqueData(1, 0x03));
