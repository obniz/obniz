"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
const iBS_1 = require("../iBS");
class iBS01RG extends iBS_1.BaseiBS01 {
    constructor() {
        super(...arguments);
        this.static = iBS01RG;
    }
}
exports.default = iBS01RG;
iBS01RG.PartsName = 'iBS01RG';
iBS01RG.BeaconDataStruct = {
    battery: Object.assign(Object.assign({}, iBS_1.BaseiBS01.Config.battery), { type: 'custom', func: (data) => ObnizPartsBleInterface_1.uint([data[0], data[1] & 0x0f]) * 0.01 }),
    active: Object.assign(Object.assign({}, iBS_1.BaseiBS01.Config.event), { type: 'bool00010000' }),
    button: Object.assign(Object.assign({}, iBS_1.BaseiBS01.Config.button), { type: 'bool00100000' }),
    acceleration: iBS_1.BaseiBS01.Config.acceleration,
    magic: iBS_1.BaseiBS01.getUniqueData(1.1, -1).magic,
};
