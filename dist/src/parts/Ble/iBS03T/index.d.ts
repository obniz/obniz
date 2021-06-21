/**
 * @packageDocumentation
 * @module Parts.iBS03T
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';
export interface IBS03TOptions {
}
export interface IBS03T_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
    temperature: number;
}
export default class IBS03T extends BaseIBS<IBS03T_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS03T_Data>;
    protected static: typeof ObnizPartsBle;
}
