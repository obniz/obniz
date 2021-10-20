"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS01T management class iBS01Tを管理するクラス */
class iBS01T extends iBS_1.BaseiBS01 {
    constructor() {
        super(...arguments);
        this.staticClass = iBS01T;
    }
}
exports.default = iBS01T;
iBS01T.PartsName = 'iBS01T';
iBS01T.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS01.Config.battery, button: iBS_1.BaseiBS01.Config.button, moving: iBS_1.BaseiBS01.Config.moving, reed: iBS_1.BaseiBS01.Config.event, temperature: iBS_1.BaseiBS01.Config.temperature, humidity: iBS_1.BaseiBS01.Config.humidity }, iBS_1.BaseiBS01.getUniqueData(1, 0x05));
