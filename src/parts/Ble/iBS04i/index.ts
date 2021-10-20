/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
/* eslint rulesdir/non-ascii: 0 */

import { IBeacon } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  iBeaconCompanyID,
  iBeaconData,
  ObnizBleBeaconStruct,
} from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS04iOptions {}

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
  public static readonly PartsName = 'iBS04i';

  public static readonly CompanyID = iBeaconCompanyID;

  public static readonly CompanyID_ScanResponse = BaseiBS.CompanyID;

  public static readonly BeaconDataLength = 0x1a;

  public static readonly BeaconDataLength_ScanResponse =
    BaseiBS.BeaconDataLength;

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04i_Data> = {
    battery: {
      ...BaseiBS.Config.battery,
      scanResponse: true,
    },
    button: {
      ...BaseiBS.Config.button,
      scanResponse: true,
    },
    ...BaseiBS.getUniqueData(4, 0x18, 0, true),
    ...iBeaconData,
  };

  protected readonly staticClass = iBS04i;
}
