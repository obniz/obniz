/* eslint-disable max-classes-per-file */
/* eslint-disable rulesdir/non-ascii */
/**
 * @packageDocumentation
 * @module ObnizCore
 */

import { BleRemotePeripheral } from './libs/embeds/bleHci/bleRemotePeripheral';

export interface ObnizPartsBleInfo {
  name: string;
  datasheet?: any;
}

export abstract class ObnizPartsBleInterface {
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
   * Utility function for reading 4 byte to signed number.
   */
  public static signed32FromBinary(
    byte3: number,
    byte2: number,
    byte1: number,
    byte0: number
  ): number {
    let val: number =
      (byte3 << (8 * 3)) | (byte2 << (8 * 2)) | (byte1 << (8 * 1)) | byte0;
    if ((val & 0x80000000) !== 0) {
      val = val - 0x100000000;
    }
    return val;
  }

  /**
   * Utility function for reading 1byte fixed point number
   */
  public static readFraction(byte: number) {
    let result = 0;
    let mask = 0b10000000;
    let num = 0.5;
    for (let i = 0; i < 8; i++) {
      if (byte & mask) {
        result += num;
      }
      num /= 2.0;
      mask >>= 1;
    }
    return result;
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
