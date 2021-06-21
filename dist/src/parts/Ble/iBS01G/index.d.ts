/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';
export interface IBS01GOptions {
}
export interface IBS01G_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    fall: boolean;
}
export default class IBS01G extends BaseIBS01<IBS01G_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01G_Data>;
    protected static: typeof ObnizPartsBle;
}
