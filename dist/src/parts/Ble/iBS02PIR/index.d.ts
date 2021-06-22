/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';
export interface iBS02PIROptions {
}
export interface iBS02PIR_Data {
    battery: number;
    event: boolean;
}
export default class iBS02PIR extends BaseiBS<iBS02PIR_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02PIR_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
