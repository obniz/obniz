/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS01 } from '../iBS';
export interface iBS01GOptions {
}
export interface iBS01G_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    fall: boolean;
}
export default class iBS01G extends BaseiBS01<iBS01G_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01G_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
