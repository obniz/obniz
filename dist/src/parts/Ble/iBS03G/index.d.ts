/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';
export interface iBS03GOptions {
}
export interface iBS03G_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    fall: boolean;
}
export default class iBS03G extends BaseiBS<iBS03G_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03G_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
