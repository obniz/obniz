"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03T
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS03T extends iBS_1.BaseIBS {
    constructor() {
        super(...arguments);
        this.static = IBS03T;
    }
}
exports.default = IBS03T;
IBS03T.PartsName = 'iBS03T';
IBS03T.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS.Config.battery, button: iBS_1.BaseIBS.Config.button, moving: iBS_1.BaseIBS.Config.moving, hall_sensor: iBS_1.BaseIBS.Config.event, temperature: iBS_1.BaseIBS.Config.temperature }, iBS_1.BaseIBS.getUniqueData(3, 0x15));
