/**
 * @packageDocumentation
 * @module Parts.iBS03T
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';
export interface iBS03TOptions {
}
export interface iBS03T_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
    temperature: number;
}
export default class iBS03T extends BaseiBS<iBS03T_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03T_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
