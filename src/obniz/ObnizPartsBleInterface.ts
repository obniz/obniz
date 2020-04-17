/**
 * @packageDocumentation
 * @module ObnizCore
 */

import BleRemotePeripheral from "./libs/embeds/bleHci/bleRemotePeripheral";
export interface ObnizPartsBleInfo {
  name: string;
  datasheet?: any;
}

export default abstract class ObnizPartsBleInterface {
  /**
   * Information of parts.
   * name: key name of parts
   */
  public static info: () => ObnizPartsBleInfo;

  /**
   * Check founded BleRemotePeripheral is kind of this parts or not
   */
  public static isDevice: (peripheral: BleRemotePeripheral) => boolean;

  /**
   * Utility function for reading 2 byte to signed number.
   */
  public static signed16FromBinary(high: number, low: number): number {
    let val: number = (high << 8) | low;
    if ((val & 0x8000) !== 0) {
      val = val - 0x10000;
    }
    return val;
  }

  /**
   * Internally Used function for connection required devices
   */
  public _peripheral: BleRemotePeripheral | null = null;

  /**
   * ondisconnect callback function.
   */
  public ondisconnect?: (reason: any) => void;
}
