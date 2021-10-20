"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS03 management class iBS03を管理するクラス */
class iBS03 extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS03;
    }
}
exports.default = iBS03;
iBS03.PartsName = 'iBS03';
iBS03.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, button: iBS_1.BaseiBS.Config.button, moving: iBS_1.BaseiBS.Config.moving, hall_sensor: iBS_1.BaseiBS.Config.event }, iBS_1.BaseiBS.getUniqueData(3, 0x10));
