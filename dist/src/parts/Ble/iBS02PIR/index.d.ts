/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS02PIROptions {
}
export interface iBS02PIR_Data {
    battery: number;
    event: boolean;
}
export default class iBS02PIR extends BaseiBS<iBS02PIR_Data> {
    static readonly PartsName = "iBS02PIR";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02PIR_Data>;
    protected readonly staticClass: typeof iBS02PIR;
}
