"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS02IR extends iBS_1.BaseIBS {
    constructor() {
        super(...arguments);
        this.static = IBS02IR;
    }
}
exports.default = IBS02IR;
IBS02IR.PartsName = 'iBS02IR';
IBS02IR.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS.Config.battery, event: iBS_1.BaseIBS.Config.event }, iBS_1.BaseIBS.getUniqueData(2, 0x02));
