"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS03TP management class iBS03TPを管理するクラス */
class iBS03TP extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS03TP;
    }
}
exports.default = iBS03TP;
iBS03TP.PartsName = 'iBS03TP';
iBS03TP.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS.Config.battery, button: iBS_1.BaseiBS.Config.button, moving: iBS_1.BaseiBS.Config.moving, hall_sensor: iBS_1.BaseiBS.Config.event, temperature: iBS_1.BaseiBS.Config.temperature, probe_temperature: Object.assign(Object.assign({}, iBS_1.BaseiBS.Config.temperature), { index: 7 }) }, iBS_1.BaseiBS.getUniqueData(3, 0x17));
