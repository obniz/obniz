"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS03G extends iBS_1.BaseIBS {
    constructor() {
        super(...arguments);
        this.static = IBS03G;
    }
}
exports.default = IBS03G;
IBS03G.PartsName = 'iBS03G';
IBS03G.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS.Config.battery, button: iBS_1.BaseIBS.Config.button, moving: iBS_1.BaseIBS.Config.moving, fall: iBS_1.BaseIBS.Config.fall }, iBS_1.BaseIBS.getUniqueData(3, 0x16));
