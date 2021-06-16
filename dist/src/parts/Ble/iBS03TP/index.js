"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS03TP extends iBS_1.BaseIBS {
    constructor() {
        super(...arguments);
        this.static = IBS03TP;
    }
}
exports.default = IBS03TP;
IBS03TP.PartsName = 'iBS03TP';
IBS03TP.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS.Config.battery, button: iBS_1.BaseIBS.Config.button, moving: iBS_1.BaseIBS.Config.moving, hall_sensor: iBS_1.BaseIBS.Config.event, temperature: iBS_1.BaseIBS.Config.temperature, probe_temperature: Object.assign(Object.assign({}, iBS_1.BaseIBS.Config.temperature), { index: 7 }) }, iBS_1.BaseIBS.getUniqueData(3, 0x17));
