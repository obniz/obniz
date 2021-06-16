"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS02PIR extends iBS_1.BaseIBS {
    constructor() {
        super(...arguments);
        this.static = IBS02PIR;
    }
}
exports.default = IBS02PIR;
IBS02PIR.PartsName = 'iBS02PIR';
IBS02PIR.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS.Config.battery, event: iBS_1.BaseIBS.Config.event }, iBS_1.BaseIBS.getUniqueData(2, 0x01));
