/**
 * @packageDocumentation
 * @module Parts.MINEW_S1
 */
/* eslint rulesdir/non-ascii: 0 */

import MINEW from '../utils/abstracts/MINEW';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizUtil } from '../../../obniz/libs/utils/util';
import {
  ObnizPartsBleCompare,
  ObnizBleBeaconStruct,
  ObnizPartsBleMode,
} from '../../../obniz/ObnizPartsBleAbstract';

/**
 * temperature and humidity data from MINEW_S1 advertisement
 *
 * MINEW_S1のadvertisementからの温湿度データ
 */
export interface MINEW_S1_Data {
  frameType: number;
  versionNumber: number;
  batteryLevel: number;
  /**
   * temperature 温度
   *
   * Range 範囲: -40~70 (Unit 単位: 0.05 degC)
   */
  temperature: number;
  /**
   * relative humidity 湿度
   *
   * Range 範囲: 0~100 (Unit 単位: 0.05%RH)
   */
  humidity: number;
  /** MAC address MACアドレス */
  macAddress: string;
}

/**
 * device data from MINEW_S1 advertisement
 *
 * MINEW_S1のadvertisementからのデバイスデータ
 */
export interface MINEW_S1_InfoData {
  frameType: number;
  versionNumber: number;
  batteryLevel: number;
  /** MAC address MACアドレス */
  macAddress: string;
  name: string;
}

export interface MINEW_S1Options {}

/** MINEW_S1 management class MINEW_S1を管理するクラス */
export default class MINEW_S1 extends MINEW<MINEW_S1_Data> {
  protected staticClass = MINEW_S1;
  public static readonly PartsName = 'MINEW_S1';

  // TODO: restore by disable info slot
  // public static readonly ServiceDataLength = 16;

  public static readonly ServiceDataStruct: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<MINEW_S1_Data>
  > = MINEW.getServiceDataStruct<MINEW_S1_Data>(7, 1, {
    // TODO: delete
    frameType: {
      index: 0,
      type: 'unsignedNumLE',
    },
    // TODO: delete
    versionNumber: {
      index: 1,
      type: 'unsignedNumLE',
    },
    // TODO: change key name
    batteryLevel: {
      index: 2,
      type: 'unsignedNumLE',
    },
    temperature: {
      index: 3,
      length: 2,
      type: 'numLE',
      fixedIntegerBytes: 1,
      round: 2,
    },
    humidity: {
      index: 5,
      length: 2,
      type: 'numLE',
      fixedIntegerBytes: 1,
      round: 2,
    },
    // TODO: delete
    macAddress: {
      index: 7,
      length: 6,
      type: 'custom',
      func: (data, peripheral) => peripheral.address,
    },
    // TODO: delete by disable info slot
    versionNumber_: {
      index: 1,
      type: 'check',
      data: 1,
      scanResponse: true, // for ignored by check
    },
  });

  // TODO: delete by disable info slot
  public static isDeviceWithMode(
    peripheral: BleRemotePeripheral,
    mode: ObnizPartsBleMode
  ): boolean {
    return (
      peripheral.serviceData !== null &&
      (peripheral.serviceData[3] === 1 || peripheral.serviceData[3] === 8) &&
      MINEW.isDeviceWithMode(peripheral, mode)
    );
  }

  /**
   * Get device information data from the MINEW_S1
   *
   * MINEW_S1からのデバイス情報データを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received device information data from the MINEW_S1
   *
   * MINEW_S1から受け取ったデバイス情報データ
   */
  public static getInfoData(
    peripheral: BleRemotePeripheral
  ): null | MINEW_S1_InfoData {
    if (
      MINEW_S1.getDeviceMode(peripheral) !== 'Beacon' ||
      !peripheral.serviceData ||
      peripheral.serviceData[3] !== 0x08
    ) {
      return null;
    }
    const frameType = peripheral.adv_data[11];
    const versionNumber = peripheral.adv_data[12];
    if (frameType !== 0xa1 || versionNumber !== 0x08) {
      return null;
    }

    const batteryLevel = peripheral.adv_data[13];
    const macAddress = (
      peripheral.adv_data
        .slice(14, 20)
        .map((e: number) => ('0' + e.toString(16)).slice(-2))
        .join('')
        .match(/.{1,2}/g) ?? []
    )
      .reverse()
      .join('');

    const name = ObnizUtil.dataArray2string(
      peripheral.adv_data.slice(20)
    ) as string;

    return {
      frameType,
      versionNumber,
      batteryLevel,
      name,
      macAddress,
    };
  }

  /**
   * @deprecated
   * Use MINEW_S1.getData();
   *
   * Get temperature and humidity data from the MINEW_S1
   *
   * MINEW_S1からの温湿度データを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received temperature and humidity data from the MINEW_S1
   *
   * MINEW_S1から受け取った温湿度データ
   */
  public static getHTData(
    peripheral: BleRemotePeripheral
  ): null | MINEW_S1_Data {
    if (
      MINEW_S1.getDeviceMode(peripheral) !== 'Beacon' ||
      !peripheral.serviceData ||
      peripheral.serviceData[3] !== 0x01
    ) {
      return null;
    }
    const device = new MINEW_S1(peripheral, 'Beacon');
    return device.getData();
  }
}
