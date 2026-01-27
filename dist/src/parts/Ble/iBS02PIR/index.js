"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS02PIR management class iBS02PIRを管理するクラス */
class iBS02PIR extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS02PIR;
    }
}
exports.default = iBS02PIR;
iBS02PIR.PartsName = 'iBS02PIR';
iBS02PIR.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, event: iBS_1.BaseiBS.Config.pir }, iBS_1.BaseiBS.getUniqueData(3, 0x01));
