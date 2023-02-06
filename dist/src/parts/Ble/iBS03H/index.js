"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03H
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS03H management class iBS03Hを管理するクラス */
class iBS03H extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS03H;
    }
}
exports.default = iBS03H;
iBS03H.PartsName = 'iBS03H';
iBS03H.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, button: iBS_1.BaseiBS01.Config.button, hall_sensor: iBS_1.BaseiBS.Config.event }, iBS_1.BaseiBS.getUniqueData(3, 0x10));
