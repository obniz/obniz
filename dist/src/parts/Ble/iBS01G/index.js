"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS01G management class iBS01Gを管理するクラス */
class iBS01G extends iBS_1.BaseiBS01 {
    constructor() {
        super(...arguments);
        this.staticClass = iBS01G;
    }
}
exports.default = iBS01G;
iBS01G.PartsName = 'iBS01G';
iBS01G.BeaconDataLength = 0x19;
iBS01G.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseiBS01.Config.battery, button: iBS_1.BaseiBS01.Config.button, moving: iBS_1.BaseiBS01.Config.moving, fall: iBS_1.BaseiBS01.Config.fall }, iBS_1.BaseiBS01.getUniqueData(1, 0x06));
