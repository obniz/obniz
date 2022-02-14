/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { ObnizPartsDataPropertyBase } from '../../../obniz/ObnizPartsDataPropertyBase';
import {iBS01H_Data} from "../iBS01H";
import { BaseiBS01 } from '../utils/abstracts/iBS';

export interface iBS01Options {}

/**
 * advertisement data from iBS01
 *
 * iBS01からのadvertisementデータ
 */
export interface iBS01_Data
  extends Pick<
    ObnizPartsDataPropertyBase,
    'battery' | 'button' | 'moving' | 'hall_sensor' | 'fall'
  > {
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
export default class iBS01 extends BaseiBS01<keyof Exclude<iBS01_Data, undefined>, keyof iBS01_Data>{
  public static readonly PartsName = 'iBS01';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    moving: BaseiBS01.Config.moving,
    hall_sensor: BaseiBS01.Config.event,
    fall: BaseiBS01.Config.fall,
    // subtype=0x03 older version has no subtype
    magic: BaseiBS01.getUniqueData(1, -1).magic,
  };

  protected readonly staticClass = iBS01;
}
