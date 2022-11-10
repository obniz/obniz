/**
 * @packageDocumentation
 * @module Parts.SCBTGAAAC
 */
import { ObnizBleBeaconStruct, ObnizPartsBle } from '../../../obniz/ObnizPartsBleAbstract';
export interface SCBTGAAAC_Options {
}
export declare type SCBTGAAAC_Data = string;
/** SCBTGAAAC management class SCBTGAAACを管理するクラス */
export default class SCBTGAAAC extends ObnizPartsBle<SCBTGAAAC_Data> {
    static readonly PartsName = "SCBTGAAAC";
    static readonly AvailableBleMode = "Beacon";
    static readonly BeaconDataLength = 26;
    static readonly CompanyID: number[];
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<{
        minor: number;
    }>;
    getData(): string;
    protected readonly staticClass: typeof SCBTGAAAC;
}
