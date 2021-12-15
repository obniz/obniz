/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
import { IBeacon } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS04iOptions {
}
/**
 * advertisement data from iBS04i
 *
 * iBS04iからのadvertisementデータ
 */
export interface iBS04i_Data extends IBeacon {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
}
/** iBS04i management class iBS04iを管理するクラス */
export default class iBS04i extends BaseiBS<iBS04i_Data> {
    static readonly PartsName = "iBS04i";
    static readonly CompanyID: number[];
    static readonly CompanyID_ScanResponse: number[];
    static readonly BeaconDataLength = 26;
    static readonly BeaconDataLength_ScanResponse: number;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04i_Data>;
    protected readonly staticClass: typeof iBS04i;
}
