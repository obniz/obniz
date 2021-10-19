/**
 * @packageDocumentation
 * @module Parts.iBS03T_RH
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS03T_RHOptions {
}
export interface iBS03T_RH_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
    temperature: number;
    humidity: number;
}
export default class iBS03T_RH extends BaseiBS<iBS03T_RH_Data> {
    static readonly PartsName = "iBS03T_RH";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03T_RH_Data>;
    protected readonly staticClass: typeof iBS03T_RH;
}
