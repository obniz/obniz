/**
 * @packageDocumentation
 * @module Parts.ZAICON
 */
/* eslint rulesdir/non-ascii: 0 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface ZAICONOptions {}

export interface ZAICON_Data {
  uuid: string;
  version: string;
  teperature: number;
  weight: number;
  battery: string;
}

export default class ZAICON implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'ZAICON',
    };
  }

  /**
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return peripheral.localName === 'ZAICON';
  }

  /**
   */
  public static getData(peripheral: BleRemotePeripheral) {
    const data = this.analyzeData(peripheral);
    return data;
  }

  /**
   */
  public static analyzeData(peripheral: BleRemotePeripheral) {
    const major = Number(peripheral.iBeacon?.major);
    const version = major >> 11; // bit12-16
    const temp_flag = major & 1024; // bit11
    const temp_int = (major >> 4) & 63; // bit5-10
    const temp_dec = major & 8; // bit4
    const battery_index = major & 7; // bit1-3
    let temp;
    if (temp_flag) {
      temp = Number(`-${temp_int}.${temp_dec ? '5' : '0'}`);
    } else {
      temp = Number(`${temp_int}.${temp_dec ? '5' : '0'}`);
    }

    const battery_list = [
      '9%以下',
      '10%',
      '25%',
      '40%',
      '55%',
      '70%',
      '85%',
      '100%',
    ];

    const data = {
      uuid: peripheral.iBeacon?.uuid,
      version: version === 1 ? '10Kg' : '50Kg',
      teperature: temp,
      weight: Number(peripheral.iBeacon?.minor),
      battery: battery_list[battery_index],
    };
    return data;
  }
}
