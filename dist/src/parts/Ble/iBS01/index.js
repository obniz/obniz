"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../utils/abstracts/iBS");
/**
 * @deprecated
 *
 * iBS01 management class iBS01を管理するクラス
 *
 * Recommend use iBS01G, iBS01H
 *
 * Use only if you are using an old iBS01 series sensor
 *
 * iBS01G, iBS01H の使用を推奨
 *
 * 旧iBS01シリーズのセンサを使用している場合のみお使いください
 */
class iBS01 extends iBS_1.BaseiBS01 {
    constructor() {
        super(...arguments);
        this.staticClass = iBS01;
    }
}
exports.default = iBS01;
iBS01.PartsName = 'iBS01';
iBS01.BeaconDataStruct = {
    battery: iBS_1.BaseiBS01.Config.battery,
    button: iBS_1.BaseiBS01.Config.button,
    moving: iBS_1.BaseiBS01.Config.moving,
    hall_sensor: iBS_1.BaseiBS01.Config.event,
    fall: iBS_1.BaseiBS01.Config.fall,
    // subtype=0x03 older version has no subtype
    magic: iBS_1.BaseiBS01.getUniqueData(1, -1).magic,
};
