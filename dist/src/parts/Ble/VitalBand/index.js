"use strict";
/**
 * @packageDocumentation
 * @module Parts.VitalBand
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../obniz/ObnizPartsBleAbstract");
class VitalBand extends ObnizPartsBleAbstract_1.ObnizPartsBle {
    constructor() {
        super(...arguments);
        this.staticClass = VitalBand;
    }
}
exports.default = VitalBand;
VitalBand.AvailableBleMode = 'Beacon';
VitalBand.PartsName = 'VitalBand';
VitalBand.CompanyID = [0xff, 0xff];
VitalBand.Config = {
    SN: {
        type: 'numBE',
        index: 0,
        length: 3,
    },
    heart_rate: {
        type: 'numBE',
        index: 3,
    },
    body_temp: {
        type: 'numLE',
        index: 4,
        length: 2,
        multiple: 0.01,
        round: 2,
    },
    blood_pleasure_high: {
        type: 'numBE',
        index: 6,
    },
    blood_pleasure_low: {
        type: 'numBE',
        index: 7,
    },
    Sp02: {
        type: 'numBE',
        index: 8,
    },
    battery: {
        type: 'numBE',
        index: 9,
    },
    steps: {
        type: 'numLE',
        index: 10,
        length: 3,
    },
};
VitalBand.BeaconDataStruct = {
    SN: VitalBand.Config.SN,
    heart_rate: VitalBand.Config.heart_rate,
    body_temp: VitalBand.Config.body_temp,
    blood_pleasure_high: VitalBand.Config.blood_pleasure_high,
    blood_pleasure_low: VitalBand.Config.blood_pleasure_low,
    Sp02: VitalBand.Config.Sp02,
    battery: VitalBand.Config.battery,
    steps: VitalBand.Config.steps,
};
