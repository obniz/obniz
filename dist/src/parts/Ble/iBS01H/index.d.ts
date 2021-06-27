/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../iBS';
export interface iBS01HOptions {
}
export interface iBS01H_Data {
    battery: number;
    button: boolean;
    hall_sensor: boolean;
}
export default class iBS01H extends BaseiBS01<iBS01H_Data> {
    static readonly PartsName = "iBS01H";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01H_Data>;
    protected readonly staticClass: typeof iBS01H;
}
