/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  ObnizPartsBleMode,
} from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
import { iBS02IR_Data } from './base';
import {
  ObnizPartsInfo,
  ObnizPartsInterface,
} from '../../../obniz/ObnizPartsInterface';
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import iBS02IR_Ingics from './ingics';
import iBS02IR_Ranger from './ranger';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';

/** iBS02IR management class iBS02IRを管理するクラス */
export default class iBS02IR extends ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'iBS02IR',
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return (
      iBS02IR_Ingics.isDevice(peripheral) || iBS02IR_Ranger.isDevice(peripheral)
    );
  }

  public static isDeviceWithMode(
    peripheral: BleRemotePeripheral,
    mode: ObnizPartsBleMode
  ) {
    return (
      iBS02IR_Ingics.isDeviceWithMode(peripheral, mode) ||
      iBS02IR_Ranger.isDeviceWithMode(peripheral, mode)
    );
  }

  public static getData(peripheral: BleRemotePeripheral): iBS02IR_Data | null {
    return ((iBS02IR_Ingics.getData(peripheral) ??
      iBS02IR_Ranger.getData(peripheral) ??
      null) as unknown) as iBS02IR_Data | null;
  }

  public static getManufacturer(
    peripheral: BleRemotePeripheral
  ): 'ranger' | 'ingics' | null {
    if (iBS02IR_Ingics.getData(peripheral)) {
      return 'ingics';
    }
    if (iBS02IR_Ranger.getData(peripheral)) {
      return 'ranger';
    }
    return null;
  }
}
