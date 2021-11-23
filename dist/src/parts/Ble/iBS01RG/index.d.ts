/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
import { Triaxial } from '../../../obniz/ObnizParts';
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';
export interface iBS01RGOptions {
}
/**
 * advertisement data from iBS01RG
 *
 * iBS01RGからのadvertisementデータ
 */
export interface iBS01RG_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /** active or inactive アクティブか非アクティブか */
    active: boolean;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** acceleration (X, Y, Z axis) 加速度 (X, Y, Z軸)*/
    acceleration: Triaxial[];
}
export default class iBS01RG extends BaseiBS01<iBS01RG_Data> {
    static readonly PartsName = "iBS01RG";
    static readonly BeaconDataLength = 25;
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01RG_Data>;
    protected readonly staticClass: typeof iBS01RG;
}
