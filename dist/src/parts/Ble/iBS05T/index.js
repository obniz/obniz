"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS05T
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS05T management class iBS05Tを管理するクラス */
class iBS05T extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS05T;
    }
}
exports.default = iBS05T;
iBS05T.PartsName = 'iBS05T';
iBS05T.CompanyID = [0x2c, 0x08];
iBS05T.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, button: iBS_1.BaseiBS.Config.button, temperature: iBS_1.BaseiBS.Config.temperature }, iBS_1.BaseiBS.getUniqueData(5, 0x32));
