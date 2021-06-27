/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../iBS';
export interface iBS01TOptions {
}
export interface iBS01T_Data {
    button: boolean;
    moving: boolean;
    reed: boolean;
    battery: number;
    temperature: number;
    humidity: number;
}
export default class iBS01T extends BaseiBS01<iBS01T_Data> {
    static readonly PartsName = "iBS01T";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01T_Data>;
    protected readonly staticClass: typeof iBS01T;
}
