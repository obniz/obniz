"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS01G extends iBS_1.BaseIBS01 {
    constructor() {
        super(...arguments);
        this.static = IBS01G;
    }
}
exports.default = IBS01G;
IBS01G.PartsName = 'iBS01G';
IBS01G.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS01.Config.battery, button: iBS_1.BaseIBS01.Config.button, moving: iBS_1.BaseIBS01.Config.moving, fall: iBS_1.BaseIBS01.Config.fall }, iBS_1.BaseIBS01.getUniqueData(1, 0x06));
