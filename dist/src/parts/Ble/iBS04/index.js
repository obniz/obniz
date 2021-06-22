"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class iBS04 extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.static = iBS04;
    }
}
exports.default = iBS04;
iBS04.PartsName = 'iBS04';
iBS04.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, button: iBS_1.BaseiBS.Config.button }, iBS_1.BaseiBS.getUniqueData(4, 0x19));
