/**
 * @packageDocumentation
 * @module ObnizCore
 */

import Obniz from "./index";
import BleRemotePeripheral from "./libs/embeds/bleHci/bleRemotePeripheral";
export interface ObnizPartsBleInfo {
  name: string;
  datasheet?: any;
}

export default abstract class ObnizPartsBleInterface {
  public static info: () => ObnizPartsBleInfo;
  public static isDevice: (peripheral: BleRemotePeripheral) => boolean;

  public static signed16FromBinary(high: number, low: number): number {
    let val: number = (high << 8) | low;
    if ((val & 0x8000) !== 0) {
      val = val - 0x10000;
    }
    return val;
  }
}
