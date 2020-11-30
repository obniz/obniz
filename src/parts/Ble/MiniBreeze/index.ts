/**
 * @packageDocumentation
 * @module Parts.MiniBreeze
 */

import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizUtil from "../../../obniz/libs/utils/util";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";

export interface MiniBreeze_InfoData {
  gasType: "none" | "HCHO" | "CO" | "CO2" | "Rn" | "PM1.0" | "PM2.5" | "PM10" | "unknown";
  sensVal: number;
  temperature: number;
  humidity: number;
  version: string;
  status: "BatteryEmpty" | "BatteryLow" | "BatteryNormal" | "BatteryCharging" | "Invalid";
  devName: string;
}

export interface MiniBreezeOptions {}

export default class MiniBreeze implements ObnizPartsBleInterface {
  public static info() {
    return { name: "MiniBreeze" };
  }

  public static gasType(): any {
    return {
      0: "none",
      1: "HCHO",
      2: "CO",
      3: "CO2",
      5: "Rn",
      6: "PM1.0",
      7: "PM2.5",
      8: "PM10",
    };
  }

  public static status(): any {
    return {
      0: "BatteryEmpty",
      1: "BatteryLow",
      2: "BatteryNormal",
      3: "BatteryCharging",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (peripheral.adv_data.length !== 31 || !this._hasPrefix(peripheral)) {
      return false;
    }
    return true;
  }

  public static getData(peripheral: BleRemotePeripheral): null | MiniBreeze_InfoData {
    if (!this._hasPrefix(peripheral)) {
      return null;
    }
    if (!peripheral.adv_data || peripheral.adv_data.length !== 31 || !peripheral.localName) {
      return null;
    }
    const buf = Buffer.from(peripheral.adv_data.splice(7));
    const gasType = MiniBreeze.gasType()[buf.readUInt8(0)] || "unknown";
    const sensVal = buf.readUInt16LE(1);
    const temperature = buf.readUInt8(3);
    const humidity = buf.readUInt8(4);
    const version = buf.readUInt8(5) + "." + buf.readUInt8(6) + "." + buf.readUInt8(7);
    const status = MiniBreeze.status()[buf.readUInt8(9)] || "Invalid";

    return {
      gasType,
      sensVal,
      temperature,
      humidity,
      version,
      status,
      devName: peripheral.localName,
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
      // ManufactureData
      0x0d,
      0xff,
      0xff,
      0x02,
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
