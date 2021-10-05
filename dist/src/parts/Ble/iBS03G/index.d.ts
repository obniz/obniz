/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS03GOptions {
}
/**
 * advertisement data from iBS03G
 *
 * iBS03Gからのadvertisementデータ
 */
export interface iBS03G_Data {
    /** battery 電池電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** moving or not 動いているかどうか */
    moving: boolean;
    /** fallen or not 落ちたかどうか */
    fall: boolean;
}
/** iBS03G management class iBS03Gを管理するクラス */
export default class iBS03G extends BaseiBS<iBS03G_Data> {
    static readonly PartsName = "iBS03G";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03G_Data>;
    protected readonly staticClass: typeof iBS03G;
}
