"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS04 extends iBS_1.BaseIBS {
    constructor() {
        super(...arguments);
        this.static = IBS04;
    }
}
exports.default = IBS04;
IBS04.PartsName = 'iBS04';
IBS04.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS.Config.battery, button: iBS_1.BaseIBS.Config.button }, iBS_1.BaseIBS.getUniqueData(4, 0x19));
