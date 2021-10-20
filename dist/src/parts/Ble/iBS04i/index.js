"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
const iBS_1 = require("../utils/abstracts/iBS");
/** iBS04i management class iBS04iを管理するクラス */
class iBS04i extends iBS_1.BaseiBS {
    constructor() {
        super(...arguments);
        this.staticClass = iBS04i;
    }
}
exports.default = iBS04i;
iBS04i.PartsName = 'iBS04i';
iBS04i.CompanyID = ObnizPartsBleAbstract_1.iBeaconCompanyID;
iBS04i.CompanyID_ScanResponse = iBS_1.BaseiBS.CompanyID;
iBS04i.BeaconDataLength = 0x1a;
iBS04i.BeaconDataLength_ScanResponse = iBS_1.BaseiBS.BeaconDataLength;
iBS04i.BeaconDataStruct = Object.assign(Object.assign({ battery: Object.assign(Object.assign({}, iBS_1.BaseiBS.Config.battery), { scanResponse: true }), button: Object.assign(Object.assign({}, iBS_1.BaseiBS.Config.button), { scanResponse: true }) }, iBS_1.BaseiBS.getUniqueData(4, 0x18, 0, true)), ObnizPartsBleAbstract_1.iBeaconData);
