"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS05G
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS05G management class iBS05Gを管理するクラス */
class iBS05G extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS05G;
    }
}
exports.default = iBS05G;
iBS05G.PartsName = 'iBS05G';
iBS05G.CompanyID = [0x2c, 0x08];
iBS05G.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, moving: iBS_1.BaseiBS.Config.moving }, iBS_1.BaseiBS.getUniqueData(5, 0x33));
