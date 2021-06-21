/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';
export interface IBS01HOptions {
}
export interface IBS01H_Data {
    battery: number;
    button: boolean;
    hall_sensor: boolean;
}
export default class IBS01H extends BaseIBS01<IBS01H_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01H_Data>;
    protected static: typeof ObnizPartsBle;
}
