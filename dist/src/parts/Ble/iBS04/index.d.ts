/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';
export interface IBS04Options {
}
export interface IBS04_Data {
    battery: number;
    button: boolean;
}
export default class IBS04 extends BaseIBS<IBS04_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS04_Data>;
    protected static: typeof ObnizPartsBle;
}
