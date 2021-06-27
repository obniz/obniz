"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class iBS01H extends iBS_1.BaseiBS01 {
    constructor() {
        super(...arguments);
        this.staticClass = iBS01H;
    }
}
exports.default = iBS01H;
iBS01H.PartsName = 'iBS01H';
iBS01H.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS01.Config.battery, button: iBS_1.BaseiBS01.Config.button, hall_sensor: iBS_1.BaseiBS01.Config.event }, iBS_1.BaseiBS01.getUniqueData(1, 0x04));
