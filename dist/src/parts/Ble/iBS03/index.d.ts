/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS03Options {
}
/**
 * advertisement data from iBS03
 *
 * iBS03からのadvertisementデータ
 */
export interface iBS03_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** moving or not 動いているかどうか */
    moving: boolean;
    /** magnet nearby or not 近くに磁石があるかどうか */
    hall_sensor: boolean;
}
/** iBS03 management class iBS03を管理するクラス */
export default class iBS03 extends BaseiBS<iBS03_Data> {
    static readonly PartsName = "iBS03";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03_Data>;
    protected readonly staticClass: typeof iBS03;
}
