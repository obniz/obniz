"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03T
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS03T management class iBS03Tを管理するクラス */
class iBS03T extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS03T;
    }
}
exports.default = iBS03T;
iBS03T.PartsName = 'iBS03T';
iBS03T.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, button: iBS_1.BaseiBS.Config.button, moving: iBS_1.BaseiBS.Config.moving, hall_sensor: iBS_1.BaseiBS.Config.event, temperature: iBS_1.BaseiBS.Config.temperature }, iBS_1.BaseiBS.getUniqueData(3, 0x15));
