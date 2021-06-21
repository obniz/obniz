"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
const iBS_1 = require("../iBS");
class IBS04I extends iBS_1.BaseIBS {
    constructor() {
        super(...arguments);
        this.static = IBS04I;
    }
}
exports.default = IBS04I;
IBS04I.PartsName = 'iBS04i';
IBS04I.CompanyID = ObnizPartsBleInterface_1.iBeaconCompanyID;
IBS04I.CompanyID_ScanResponse = iBS_1.BaseIBS.CompanyID;
IBS04I.BeaconDataStruct = Object.assign(Object.assign({ battery: Object.assign(Object.assign({}, iBS_1.BaseIBS.Config.battery), { scanResponse: true }), button: Object.assign(Object.assign({}, iBS_1.BaseIBS.Config.button), { scanResponse: true }) }, iBS_1.BaseIBS.getUniqueData(4, 0x18, 0, true)), ObnizPartsBleInterface_1.iBeaconData);
