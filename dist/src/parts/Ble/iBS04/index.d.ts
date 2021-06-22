/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';
export interface iBS04Options {
}
export interface iBS04_Data {
    battery: number;
    button: boolean;
}
export default class iBS04 extends BaseiBS<iBS04_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
