/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
import { IBeacon } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../iBS';
export interface iBS04iOptions {
}
export interface iBS04i_Data extends IBeacon {
    battery: number;
    button: boolean;
}
export default class iBS04i extends BaseiBS<iBS04i_Data> {
    static readonly PartsName = "iBS04i";
    static readonly CompanyID: number[];
    static readonly CompanyID_ScanResponse: number[];
    static readonly BeaconDataLength = 26;
    static readonly BeaconDataLength_ScanResponse: number;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04i_Data>;
    protected readonly staticClass: typeof iBS04i;
}
