"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS01H extends iBS_1.BaseIBS01 {
    constructor() {
        super(...arguments);
        this.static = IBS01H;
    }
}
exports.default = IBS01H;
IBS01H.PartsName = 'iBS01H';
IBS01H.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS01.Config.battery, button: iBS_1.BaseIBS01.Config.button, hall_sensor: iBS_1.BaseIBS01.Config.event }, iBS_1.BaseIBS01.getUniqueData(1, 0x04));
