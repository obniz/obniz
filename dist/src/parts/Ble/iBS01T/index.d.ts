/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';
export interface IBS01TOptions {
}
export interface IBS01T_Data {
    button: boolean;
    moving: boolean;
    reed: boolean;
    battery: number;
    temperature: number;
    humidity: number;
}
export default class IBS01T extends BaseIBS01<IBS01T_Data> {
    static readonly PartsName: PartsType;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01T_Data>;
    protected static: typeof ObnizPartsBle;
}
