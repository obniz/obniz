/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';
export interface iBS01GOptions {
}
/**
 * advertisement data from iBS01G
 *
 * iBS01Gからのadvertisementデータ
 */
export interface iBS01G_Data {
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
/** iBS01G management class iBS01Gを管理するクラス */
export default class iBS01G extends BaseiBS01<iBS01G_Data> {
    static readonly PartsName = "iBS01G";
    static readonly BeaconDataLength = 25;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01G_Data>;
    protected readonly staticClass: typeof iBS01G;
}
