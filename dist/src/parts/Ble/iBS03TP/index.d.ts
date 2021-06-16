/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';
export interface IBS03TPOptions {
}
export interface IBS03TP_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
    temperature: number;
    probe_temperature: number;
}
export default class IBS03TP extends BaseIBS<IBS03TP_Data> {
    static readonly PartsName: PartsType;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS03TP_Data>;
    protected static: typeof ObnizPartsBle;
}
