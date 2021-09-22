/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS02IROptions {
}
export interface iBS02IR_Data {
    battery: number;
    event: boolean;
}
export default class iBS02IR extends BaseiBS<iBS02IR_Data> {
    static readonly PartsName = "iBS02IR";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02IR_Data>;
    protected readonly staticClass: typeof iBS02IR;
}
