/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';
export interface iBS03TPOptions {
}
export interface iBS03TP_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
    temperature: number;
    probe_temperature: number;
}
export default class iBS03TP extends BaseiBS<iBS03TP_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03TP_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
