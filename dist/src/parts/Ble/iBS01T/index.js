"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = require("../iBS");
class IBS01T extends iBS_1.BaseIBS01 {
    constructor() {
        super(...arguments);
        this.static = IBS01T;
    }
}
exports.default = IBS01T;
IBS01T.PartsName = 'iBS01T';
IBS01T.BeaconDataStruct = Object.assign({ battery: iBS_1.BaseIBS01.Config.battery, button: iBS_1.BaseIBS01.Config.button, moving: iBS_1.BaseIBS01.Config.moving, reed: iBS_1.BaseIBS01.Config.event, temperature: iBS_1.BaseIBS01.Config.temperature, humidity: iBS_1.BaseIBS01.Config.humidity }, iBS_1.BaseIBS01.getUniqueData(1, 0x05));
