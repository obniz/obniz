/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS04Options {
}
/**
 * advertisement data from iBS04
 *
 * iBS04からのadvertisementデータ
 */
export interface iBS04_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
}
/** iBS04 management class iBS04を管理するクラス */
export default class iBS04 extends BaseiBS<iBS04_Data> {
    static readonly PartsName = "iBS04";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04_Data>;
    protected readonly staticClass: typeof iBS04;
}
