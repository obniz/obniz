/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS01 } from '../iBS';
export interface iBS01HOptions {
}
export interface iBS01H_Data {
    battery: number;
    button: boolean;
    hall_sensor: boolean;
}
export default class iBS01H extends BaseiBS01<iBS01H_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01H_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
