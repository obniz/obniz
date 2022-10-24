"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03T_RH
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
class iBS03T_RH extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS03T_RH;
    }
}
exports.default = iBS03T_RH;
iBS03T_RH.PartsName = 'iBS03T_RH';
iBS03T_RH.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, button: iBS_1.BaseiBS.Config.button, moving: iBS_1.BaseiBS.Config.moving, hall_sensor: iBS_1.BaseiBS.Config.event, temperature: iBS_1.BaseiBS.Config.temperature, humidity: iBS_1.BaseiBS.Config.humidity }, iBS_1.BaseiBS.getUniqueData(3, 0x14));
