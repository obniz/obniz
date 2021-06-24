"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
const iBS_1 = require("../iBS");
class iBS04i extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.static = iBS04i;
    }
}
exports.default = iBS04i;
iBS04i.PartsName = 'iBS04i';
iBS04i.CompanyID = ObnizPartsBleInterface_1.iBeaconCompanyID;
iBS04i.CompanyID_ScanResponse = iBS_1.BaseiBS.CompanyID;
iBS04i.BeaconDataLength = 0x1a;
iBS04i.BeaconDataLength_ScanResponse = 0x12;
iBS04i.BeaconDataStruct = Object.assign(Object.assign({ battery: Object.assign(Object.assign({}, iBS_1.BaseiBS.Config.battery), { scanResponse: true }), button: Object.assign(Object.assign({}, iBS_1.BaseiBS.Config.button), { scanResponse: true }) }, iBS_1.BaseiBS.getUniqueData(4, 0x18, 0, true)), ObnizPartsBleInterface_1.iBeaconData);
