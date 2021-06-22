/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';
export interface iBS03Options {
}
export interface iBS03_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
}
export default class iBS03 extends BaseiBS<iBS03_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
