"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class iBS02PIR extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.static = iBS02PIR;
    }
}
exports.default = iBS02PIR;
iBS02PIR.PartsName = 'iBS02PIR';
iBS02PIR.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, event: iBS_1.BaseiBS.Config.event }, iBS_1.BaseiBS.getUniqueData(2, 0x01));
