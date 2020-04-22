/**
 * @packageDocumentation
 * @module Parts.MINEW_S1_HT
 */

import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizUtil from "../../../obniz/libs/utils/util";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface MINEW_S1_HTData {
  frameType: number;
  versionNumber: number;
  batteryLevel: number;
  temperature: number;
  humidity: number;
  macAddress: string;
}

export interface MINEW_S1_InfoData {
  frameType: number;
  versionNumber: number;
  batteryLevel: number;
  macAddress: string;
  name: string;
}

export interface MINEW_S1Options {}

export default class MINEW_S1 implements ObnizPartsBleInterface {
  public static info() {
    return { name: "MINEW_S1" };
  }

  public static isDevice(peripheral: BleRemotePeripheral, macAddress: string | null = null): boolean {
    if (!this._hasPrefix(peripheral)) {
      return false;
    }
    if (macAddress) {
      const data = this.getInfoData(peripheral) || this.getHTData(peripheral);
      if (data && data.macAddress === macAddress) {
        return true;
      }
      return false;
    }
    return true;
  }

  public static getInfoData(peripheral: BleRemotePeripheral): null | MINEW_S1_InfoData {
    if (!this._hasPrefix(peripheral)) {
      return null;
    }
    if (!peripheral.adv_data || peripheral.adv_data.length < 20) {
      return null;
    }
    const frameType = peripheral.adv_data[11];
    const versionNumber = peripheral.adv_data[12];
    if (frameType !== 0xa1 || versionNumber !== 0x08) {
      return null;
    }

    const batteryLevel = peripheral.adv_data[13];
    const macAddress = peripheral.adv_data
      .slice(14, 20)
      .map((e: number) => ("0" + e.toString(16)).slice(-2))
      .join("")
      .match(/.{1,2}/g)!
      .reverse()
      .join("");

    const name = ObnizUtil.dataArray2string(peripheral.adv_data.slice(20)) as string;

    return {
      frameType,
      versionNumber,
      batteryLevel,
      name,
      macAddress,
    };
  }

  public static getHTData(peripheral: BleRemotePeripheral): null | MINEW_S1_HTData {
    if (!this._hasPrefix(peripheral)) {
      return null;
    }
    if (!peripheral.adv_data || peripheral.adv_data.length !== 24) {
      return null;
    }
    const frameType = peripheral.adv_data[11];
    const versionNumber = peripheral.adv_data[12];
    if (frameType !== 0xa1 || versionNumber !== 0x01) {
      return null;
    }

    const batteryLevel = peripheral.adv_data[13];
    const temperatureH = peripheral.adv_data[14];
    const temperatureL = peripheral.adv_data[15];
    const temperature = temperatureH + (temperatureL * 1) / (1 << 8);
    const humidityH = peripheral.adv_data[16];
    const humidityL = peripheral.adv_data[17];
    const humidity = humidityH + (humidityL * 1) / (1 << 8);

    const macAddress = peripheral.adv_data
      .splice(18)
      .map((e: number) => ("0" + e.toString(16)).slice(-2))
      .join("")
      .match(/.{1,2}/g)!
      .reverse()
      .join("");

    return {
      frameType,
      versionNumber,
      batteryLevel,
      temperature,
      humidity,
      macAddress,
    };
  }

  private static _hasPrefix(peripheral: BleRemotePeripheral): boolean {
    if (!peripheral.adv_data || peripheral.adv_data.length < 10) {
      return false;
    }
    const target = [
      // flag
      0x02,
      0x01,
      0x06,
      // 16bit uuid
      0x03,
      0x03,
      0xe1,
      0xff,
      // service data
      -1,
      0x16,
      0xe1,
      0xff,
    ];
    for (const index in target) {
      if (target[index] >= 0 && target[index] !== peripheral.adv_data[index]) {
        return false;
      }
    }
    return true;
  }

  public _peripheral: null | BleRemotePeripheral = null;

  // non-wired device
  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any = {};

  public wired(obniz: Obniz): void {}
}
