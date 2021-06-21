/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';
export interface IBS02PIROptions {
}
export interface IBS02PIR_Data {
    battery: number;
    event: boolean;
}
export default class IBS02PIR extends BaseIBS<IBS02PIR_Data> {
    static readonly PartsName: PartsType;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS02PIR_Data>;
    protected static: typeof ObnizPartsBle;
}
