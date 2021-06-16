/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';
export interface IBS03Options {
}
export interface IBS03_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    hall_sensor: boolean;
}
export default class IBS03 extends BaseIBS<IBS03_Data> {
    static readonly PartsName: PartsType;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS03_Data>;
    protected static: typeof ObnizPartsBle;
}
