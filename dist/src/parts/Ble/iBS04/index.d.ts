/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS04Options {
}
export interface iBS04_Data {
    battery: number;
    button: boolean;
}
export default class iBS04 extends BaseiBS<iBS04_Data> {
    static readonly PartsName = "iBS04";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04_Data>;
    protected readonly staticClass: typeof iBS04;
}
