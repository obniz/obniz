/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';
export interface iBS02IROptions {
}
export interface iBS02IR_Data {
    battery: number;
    event: boolean;
}
export default class iBS02IR extends BaseiBS<iBS02IR_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02IR_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
