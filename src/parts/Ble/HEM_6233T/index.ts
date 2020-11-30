/**
 * @packageDocumentation
 * @module Parts.HEM_6233T
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface HEM_6233TOptions {}

export type HEM_6233TMesurementStatus =
  | "BodyMovementDetection"
  | "CuffFitDetection"
  | "IrregularPulseDetection"
  | "PulseRateRangeDetection"
  | "MeasurementPositionDetection";

export interface HEM_6233TResult {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    meanArterialPressure: number;
    unit: "mmHg";
  };
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  pulseRate?: number;
  userId?: number;
  measurementStatus?: HEM_6233TMesurementStatus[];
}

export default class HEM_6233T implements ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "HEM_6233T",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName && peripheral.localName.startsWith("BLESmart_")) {
      return true;
    }
    return false;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  public _peripheral: BleRemotePeripheral | null = null;
  private _timezoneOffsetMinute: number;

  constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number) {
    // if (peripheral && !HEM_6233T.isDevice(peripheral)) {
    //   throw new Error("peripheral is not HEM_6233T");
    // }
    this._peripheral = peripheral;
    this._timezoneOffsetMinute = timezoneOffsetMinute;
  }

  public async getDataWait(pairingKeys?: string): Promise<HEM_6233TResult[]> {
    if (!this._peripheral) {
      throw new Error("HEM_6233T is not find.");
    }
    await this._peripheral.connectWait({
      autoDiscovery: true,
      pairingOption: {
        keys: pairingKeys,
      },
    });

    const results: any[] = [];
    return await new Promise(async (resolve, reject) => {
      this._peripheral!.ondisconnect = (reason: any) => {
        resolve(results);
      };
      await this.subscribeWait("1805", "2A2B"); // current time
      await this.subscribeWait("180F", "2A19", async () => {
        // send command (unknown meaning)
        this._peripheral!.obnizBle.hci.write([
          0x02,
          0x00,
          0x00,
          0x09,
          0x00,
          0x05,
          0x00,
          0x04,
          0x00,
          0x01,
          0x06,
          0x01,
          0x00,
          0x0a,
        ]);

        this._writeTimeCharWait(this._timezoneOffsetMinute);
      }); // battery Level
      await this.subscribeWait("1810", "2A35", async (data: number[]) => {
        console.error("SUCCESS", data);
        results.push(this._analyzeData(data));
      }); // blood pressure
    });
  }

  public async subscribeWait(service: string, char: string, callback?: any) {
    if (!this._peripheral) {
      throw new Error("HEM_6233T is not find.");
    }
    const characteristics = this._peripheral.getService(service)!.getCharacteristic(char)!;
    await characteristics.registerNotifyWait(async (data) => {
      if (callback) {
        callback(data);
      }
    });
  }

  public async _writeTimeCharWait(timeOffsetMinute: number) {
    if (!this._peripheral) {
      throw new Error("HEM_6233T is not find.");
    }

    const timeChar = this._peripheral.getService("1805")!.getCharacteristic("2A2B")!;
    const date = new Date();
    date.setTime(Date.now() + 1000 * 60 * timeOffsetMinute);

    const buf = Buffer.alloc(7);
    buf.writeUInt16LE(date.getUTCFullYear(), 0);
    buf.writeUInt8(date.getUTCMonth() + 1, 2);
    buf.writeUInt8(date.getUTCDate(), 3);
    buf.writeUInt8(date.getUTCHours(), 4);
    buf.writeUInt8(date.getUTCMinutes(), 5);
    buf.writeUInt8(date.getUTCSeconds(), 6);

    const arr = Array.from(buf);
    await timeChar.writeWait(arr);
  }

  private _readFloatLE(buffer: Buffer, index: number) {
    const data = buffer.readUInt16LE(index);
    let mantissa = data & 0x0fff;
    if ((mantissa & 0x0800) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x0fff);
    }
    const exponential = data >> 12;
    return mantissa * Math.pow(10, exponential);
  }

  private _readSFloatLE(buffer: Buffer, index: number) {
    const data = buffer.readUInt32LE(index);
    let mantissa = data & 0x00ffffff;
    if ((mantissa & 0x00800000) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x00ffffff);
    }
    const exponential = data >> 24;
    return mantissa * Math.pow(10, exponential);
  }

  private _analyzeData(data: number[]): HEM_6233TResult {
    const buf = Buffer.from(data);
    const flags = buf.readUInt8(0);

    let index = 1;
    const result: HEM_6233TResult = {};
    let scale = 1;
    if (flags & 0x01) {
      // kPa
      scale = 7.501;
    }
    result.bloodPressure = {
      systolic: this._readFloatLE(buf, index) * scale,
      diastolic: this._readFloatLE(buf, index + 2) * scale,
      meanArterialPressure: this._readFloatLE(buf, index + 4) * scale,
      unit: "mmHg",
    };
    index += 6;

    if (flags & 0x02) {
      // Time Stamp field present
      result.date = {
        year: buf.readUInt16LE(index),
        month: buf.readUInt8(index + 2),
        day: buf.readUInt8(index + 3),
        hour: buf.readUInt8(index + 4),
        minute: buf.readUInt8(index + 5),
        second: buf.readUInt8(index + 6),
      };
      index += 7;
    }
    if (flags & 0x04) {
      result.pulseRate = buf.readUInt16LE(index);
      index += 2;
    }

    if (flags & 0x08) {
      result.userId = buf.readUInt8(index);
      index += 1;
    }
    if (flags & 0x10) {
      const statusFlag: { [_: number]: HEM_6233TMesurementStatus } = {
        0x01: "BodyMovementDetection",
        0x02: "CuffFitDetection",
        0x04: "IrregularPulseDetection",
        0x08: "PulseRateRangeDetection",
        0x10: "MeasurementPositionDetection",
      };
      const mesurementStatus = buf.readUInt16LE(index);
      index++;
      result.measurementStatus = [];

      for (const f in statusFlag) {
        if (+f & mesurementStatus) {
          result.measurementStatus.push(statusFlag[f]);
        }
      }
    }
    return result;
  }
}
