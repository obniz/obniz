"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
class iBS02IR extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS02IR;
    }
}
exports.default = iBS02IR;
iBS02IR.PartsName = 'iBS02IR';
iBS02IR.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, event: iBS_1.BaseiBS.Config.event }, iBS_1.BaseiBS.getUniqueData(2, 0x02));
