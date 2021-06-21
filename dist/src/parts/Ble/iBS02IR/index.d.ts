/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';
export interface IBS02IROptions {
}
export interface IBS02IR_Data {
    battery: number;
    event: boolean;
}
export default class IBS02IR extends BaseIBS<IBS02IR_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS02IR_Data>;
    protected static: typeof ObnizPartsBle;
}
