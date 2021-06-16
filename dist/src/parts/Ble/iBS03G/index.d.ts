/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';
export interface IBS03GOptions {
}
export interface IBS03G_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    fall: boolean;
}
export default class IBS03G extends BaseIBS<IBS03G_Data> {
    static readonly PartsName: PartsType;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS03G_Data>;
    protected static: typeof ObnizPartsBle;
}
