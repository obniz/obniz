"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02M2
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS02M2 management class iBS02M2を管理するクラス */
class iBS02M2 extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS02M2;
    }
}
exports.default = iBS02M2;
iBS02M2.PartsName = 'iBS02M2';
iBS02M2.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, input_trigger: iBS_1.BaseiBS.Config.input_trigger }, iBS_1.BaseiBS.getUniqueData(3, 0x04));
