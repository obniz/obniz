/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS03GOptions {
}
export interface iBS03G_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    fall: boolean;
}
export default class iBS03G extends BaseiBS<iBS03G_Data> {
    static readonly PartsName = "iBS03G";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03G_Data>;
    protected readonly staticClass: typeof iBS03G;
}
