/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';
export interface iBS01Options {
}
/**
 * advertisement data from iBS01
 *
 * iBS01からのadvertisementデータ
 */
export interface iBS01_Data {
    /** battery 電池電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** moving or not 動いているかどうか (iBS01G only)*/
    moving: boolean;
    /** magnet nearby or not 近くに磁石があるかどうか (iBS01H only) */
    hall_sensor: boolean;
    /** fallen or not 落ちたかどうか (iBS01G only)*/
    fall: boolean;
}
/**
 * @deprecated
 *
 * iBS01 management class iBS01を管理するクラス
 *
 * Recommend use iBS01G, iBS01H
 *
 * Use only if you are using an old iBS01 series sensor
 *
 * iBS01G, iBS01H の使用を推奨
 *
 * 旧iBS01シリーズのセンサを使用している場合のみお使いください
 */
export default class iBS01 extends BaseiBS01<iBS01_Data> {
    static readonly PartsName = "iBS01";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01_Data>;
    protected readonly staticClass: typeof iBS01;
}
