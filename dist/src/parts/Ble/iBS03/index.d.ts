/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS03Options {
}
export interface iBS03_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
}
export default class iBS03 extends BaseiBS<iBS03_Data> {
    static readonly PartsName = "iBS03";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03_Data>;
    protected readonly staticClass: typeof iBS03;
}
