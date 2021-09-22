/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';
export interface iBS01Options {
}
export interface iBS01_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
    fall: boolean;
}
/**
 * @deprecated
 * Recommend use iBS01G, iBS01H
 * Use only if you are using an old iBS01 series sensor
 */
export default class iBS01 extends BaseiBS01<iBS01_Data> {
    static readonly PartsName = "iBS01";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01_Data>;
    protected readonly staticClass: typeof iBS01;
}
