/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
import { IBeacon } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';
export interface IBS04IOptions {
}
export interface IBS04I_Data extends IBeacon {
    battery: number;
    button: boolean;
    user: number;
}
export default class IBS04I extends BaseIBS<IBS04I_Data> {
    static readonly PartsName: PartsType;
    protected static readonly CompanyID: number[];
    protected static readonly CompanyID_ScanResponse: number[];
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS04I_Data>;
    protected static: typeof ObnizPartsBle;
}
