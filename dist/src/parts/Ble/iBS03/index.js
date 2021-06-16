"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS03 extends iBS_1.BaseIBS {
    constructor() {
        super(...arguments);
        this.static = IBS03;
    }
}
exports.default = IBS03;
IBS03.PartsName = 'iBS03';
IBS03.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS.Config.battery, button: iBS_1.BaseIBS.Config.button, moving: iBS_1.BaseIBS.Config.moving, hall_sensor: iBS_1.BaseIBS.Config.event }, iBS_1.BaseIBS.getUniqueData(3, 0x10));
