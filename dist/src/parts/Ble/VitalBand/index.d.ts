/**
 * @packageDocumentation
 * @module Parts.VitalBand
 */
import { ObnizBleBeaconStruct, ObnizBleBeaconStructNormal, ObnizPartsBle } from '../../../obniz/ObnizPartsBleAbstract';
export interface VitalBandOptions {
}
declare type PresetConfigName = 'SN' | 'heart_rate' | 'body_temp' | 'blood_pleasure_high' | 'blood_pleasure_low' | 'Sp02' | 'battery' | 'steps';
export interface VitalBand_Data {
    SN: number;
    heart_rate: number;
    body_temp: number;
    blood_pleasure_high: number;
    blood_pleasure_low: number;
    Sp02: number;
    battery: number;
    steps: number;
}
export default class VitalBand extends ObnizPartsBle<VitalBand_Data> {
    static readonly AvailableBleMode = "Beacon";
    static readonly PartsName = "VitalBand";
    static readonly CompanyID: number[];
    protected readonly staticClass: typeof VitalBand;
    static readonly Config: {
        [key in PresetConfigName]: ObnizBleBeaconStructNormal<unknown, never>;
    };
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<VitalBand_Data>;
}
export {};
