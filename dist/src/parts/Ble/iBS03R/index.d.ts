/**
 * @packageDocumentation
 * @module Parts.iBS03R
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import BaseiBS from '../utils/abstracts/iBS';
export interface iBS03ROptions {
}
/**
 * advertisement data from iBS03R
 *
 * iBS03Rからのadvertisementデータ
 */
export interface iBS03R_Data {
    /** battery 電池電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** distance 距離 (Unit 単位: 1 mm) */
    distance: number;
    /** MAC address MACアドレス */
    address: string;
}
/** iBS03R management class iBS03Rを管理するクラス */
export default class iBS03R extends BaseiBS<iBS03R_Data> {
    static readonly PartsName = "iBS03R";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03R_Data>;
    protected readonly staticClass: typeof iBS03R;
}
