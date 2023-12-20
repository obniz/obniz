/**
 * @packageDocumentation
 * @module Parts.Talia
 */
/* eslint rulesdir/non-ascii: 0 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface TaliaOptions {}

export interface Talia_Data {
  address: string;
  primary_count: number;
  secondary_count: number;
  flow_enter: number;
  flow_exit: number;
  // battery: number; //未対応
}

export default class Talia implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Talia',
    };
  }

  /**
   * UIDフレームとTLMフレームの2種類のadがあり、UIDフレームからしかTaliaかどうか判断できない。
   * TLMフレームの判断はクライアント側でdevice addressをキャッシュして行う。
   */
  public static isDeviceFromUid(peripheral: BleRemotePeripheral): boolean {
    if (
      peripheral.adv_data
        .toString()
        .includes('69,84,65,84,65,76,73,65,82,69') ||
      peripheral.adv_data.toString().includes('69,84,65,84,65,76,76,89,82,69') // ETATALIARE or ETATALLYRE
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * UIDフレームのみ検知可能
   *
   * @param peripheral bleremoteperipheral
   * @returns boolean
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return this.isDeviceFromUid(peripheral);
  }

  /**
   * TLMフレームからデータを取得する。
   * getMode()で先にUIDかTLMか判断した方が良い。
   */
  public static getData(peripheral: BleRemotePeripheral): Talia_Data | null {
    if (this.getMode(peripheral) !== 'TLM') {
      return null;
    }
    const ad = peripheral.adv_data.slice(11);
    const data: Talia_Data = {
      address: peripheral.address,
      primary_count: ad[8],
      secondary_count: ad[9],
      flow_enter: ad[10],
      flow_exit: ad[11],
      // battery: ad[12], // 現在のファームウェアでは未対応で常に100が返ってくる
    };
    return data;
  }

  /**
   * adのモード(UID or TLM)を返す。
   */
  public static getMode(peripheral: BleRemotePeripheral): string | undefined {
    const ad = peripheral.adv_data.slice(11);
    if (ad[0] === 0) {
      return 'UID';
    } else if (ad[0] === 32) {
      return 'TLM';
    } else {
      return;
    }
  }
}
