"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS05H
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS05H management class iBS05Hを管理するクラス */
class iBS05H extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS05H;
    }
}
exports.default = iBS05H;
iBS05H.PartsName = 'iBS05H';
iBS05H.CompanyID = [0x2c, 0x08];
iBS05H.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, hall_sensor: iBS_1.BaseiBS.Config.event, count: iBS_1.BaseiBS.Config.count }, iBS_1.BaseiBS.getUniqueData(5, 0x31));
