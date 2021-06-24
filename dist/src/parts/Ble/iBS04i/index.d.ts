/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
import { IBeacon } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBle, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';
export interface iBS04iOptions {
}
export interface iBS04i_Data extends IBeacon {
    battery: number;
    button: boolean;
}
export default class iBS04i extends BaseiBS<iBS04i_Data> {
    static readonly PartsName: PartsType;
    protected static readonly CompanyID: number[];
    protected static readonly CompanyID_ScanResponse: number[];
    protected static readonly BeaconDataLength = 26;
    protected static readonly BeaconDataLength_ScanResponse = 18;
    protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04i_Data>;
    protected readonly static: typeof ObnizPartsBle;
}
