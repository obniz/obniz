"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
const iBS_1 = require("../iBS");
class iBS04I extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.static = iBS04I;
    }
}
exports.default = iBS04I;
iBS04I.PartsName = 'iBS04i';
iBS04I.CompanyID = ObnizPartsBleInterface_1.iBeaconCompanyID;
iBS04I.CompanyID_ScanResponse = iBS_1.BaseiBS.CompanyID;
iBS04I.BeaconDataStruct = Object.assign(Object.assign({ battery: Object.assign(Object.assign({}, iBS_1.BaseiBS.Config.battery), { scanResponse: true }), button: Object.assign(Object.assign({}, iBS_1.BaseiBS.Config.button), { scanResponse: true }) }, iBS_1.BaseiBS.getUniqueData(4, 0x18, 0, true)), ObnizPartsBleInterface_1.iBeaconData);
