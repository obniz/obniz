"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS02IR management class iBS02IRを管理するクラス */
class iBS02IR_Ingics extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS02IR_Ingics;
    }
}
exports.default = iBS02IR_Ingics;
iBS02IR_Ingics.PartsName = 'iBS02IR_Ingics';
iBS02IR_Ingics.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, event: iBS_1.BaseiBS.Config.proximity }, iBS_1.BaseiBS.getUniqueData(3, 0x02));
