/**
 * @packageDocumentation
 * @module Parts.UA1200BLE
 */

import BleRemoteCharacteristic from "../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
import BleBatteryService from "../abstract/services/batteryService";
import BleGenericAccess from "../abstract/services/genericAccess";

export interface UA1200BLEOptions {}

export interface UA1200BLEResult {
  SystolicPressure_mmHg?: number; // ex) 128mmHg → 0x80 = 128, 0x00
  DiastolicPressure_mmHg?: number;
  MeanArterialPressure_mmHg?: number;
  SystolicPressure_kPa?: number; // ex) 17.6Kpa → 0xB0 = 176, 0xF0
  DiastolicPressure_kPa?: number;
  MeanArterialPressure_kPa?: number;
  date?: {
    // Time Stamp ex) 2013/8/26 9:10:20 → 0xDD 0x07 0x08 0x1A 0x09 0x0A 0x14
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  PulseRate?: number;
}

export default class UA1200BLE implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "UA1200BLE",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName && peripheral.localName.startsWith("UA-1200BLE_");
  }

  public static isCooperationMode(peripheral: BleRemotePeripheral) {
    const peripheralHex = peripheral.adv_data.map((e) => e.toString(16)).join("");
    const peripheralArray: string = [
      // "2",
      // "1",
      // "6",
      // "11",
      // "7",
      "e4",
      "ab",
      "90",
      "56",
      "d",
      "0",
      "5c",
      "97",
      "6d",
      "1b",
      "34",
      "5a",
      "0",
      "f0",
      "3b",
      "23",
      // "5",
      // "ff",
      // "69",
      // "0",
      // "0",
      // "ff",
    ].join("");
    return peripheralHex.indexOf(peripheralArray) > -1;
  }

  public onNotify?: (co2: number) => void;
  public _peripheral: BleRemotePeripheral | null;
  public ondisconnect?: (reason: any) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;
  public _modeFlag?: boolean;
  private _timezoneOffsetMinute: number;

  constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number) {
    if (!peripheral || !UA1200BLE.isDevice(peripheral)) {
      throw new Error("peripheral is not UA1200BLE");
    }
    this._peripheral = peripheral;
    this._timezoneOffsetMinute = timezoneOffsetMinute;
  }

  public async pairingWait(): Promise<string | null> {
    if (!this._peripheral) {
      throw new Error("UA1200BLE not found");
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === "function") {
        this.ondisconnect(reason);
      }
    };
    let key: string | null = null;
    await this._peripheral.connectWait({
      pairingOption: {
        onPairedCallback: (pairingKey) => {
          key = pairingKey;
        },
      },
    });

    const { customServiceChar } = this._getCharsCoopMode();

    await customServiceChar.writeWait([2, 1, 3]); // disconnect req
    return key;
  }

  public async getDataWait(): Promise<UA1200BLEResult[]> {
    if (!this._peripheral) {
      throw new Error("UA1200BLE not found");
    }

    this._peripheral.ondisconnect = (reason) => {
      if (this.ondisconnect) {
        this.ondisconnect(reason);
      }
    };
    await this._peripheral.connectWait();

    return await new Promise(async (resolve, reject) => {
      if (!this._peripheral) {
        throw new Error("UA1200BLE not found");
      }
      const results: UA1200BLEResult[] = [];

      // Advertise mode (BP-00 or BP-01 in pp.7)
      // const { bloodPressureMeasurementChar, customServiceChar } = this._getCharsCoopMode();
      // await customServiceChar.writeWait([2, 0, 0xe1]);
      // bloodPressureMeasurementChar.registerNotifyWait((data: number[]) => {
      //   results.push(this._analyzeData(data));
      // });
      // await this._writeTimeChar(this._timezoneOffsetMinute);
      // await this._writeCCCDChar();

      const { bloodPressureMeasurementChar, timeChar } = this._getCharsSingleMode();
      await this._writeTimeChar(this._timezoneOffsetMinute);
      await bloodPressureMeasurementChar.registerNotifyWait((data: number[]) => {
        results.push(this._analyzeData(data));
      });
      this._peripheral.ondisconnect = (reason) => {
        resolve(results);
        if (this.ondisconnect) {
          this.ondisconnect(reason);
        }
      };
    });
  }

  private _readFLOAT_LE(buffer: Buffer, index: number) {
    const data = buffer.readUInt32LE(index);
    let mantissa = data & 0x00ffffff;
    if ((mantissa & 0x00800000) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x00ffffff);
    }
    const exponential = data >> 24;
    return mantissa * Math.pow(10, exponential);
  }

  private _readSFLOAT_LE(buffer: Buffer, index: number) {
    // convert SFLOAT Little Endian (not sfloat!) to numerical value
    const data = buffer.readUInt16LE(index);
    let mantissa = data & 0x0fff;
    if ((mantissa & 0x0800) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x0fff);
    }
    const exponential = data >> 12;
    return mantissa * Math.pow(10, exponential);
  }

  private _analyzeData(data: number[]): UA1200BLEResult {
    const buf = Buffer.from(data);
    const flags = buf.readUInt8(0);

    let index = 1;
    const result: UA1200BLEResult = {};
    if (flags & 0x01) {
      // Blood Pressure Unit Flag
      // kPa
      result.SystolicPressure_kPa = this._readSFLOAT_LE(buf, index);
      index += 2;
      result.DiastolicPressure_kPa = this._readSFLOAT_LE(buf, index);
      index += 2;
      result.MeanArterialPressure_kPa = this._readSFLOAT_LE(buf, index);
      index += 2;
    } else {
      // mmHg
      result.SystolicPressure_mmHg = this._readSFLOAT_LE(buf, index);
      index += 2;
      result.DiastolicPressure_mmHg = this._readSFLOAT_LE(buf, index);
      index += 2;
      result.MeanArterialPressure_mmHg = this._readSFLOAT_LE(buf, index);
      index += 2;
    }
    if (flags & 0x02) {
      // Time Stamp Flag
      // TODO: get Time stamp
      // result.date = {
      //   year: buf.readUInt16LE(index),
      //   month: buf.readUInt8(index + 2),
      //   day: buf.readUInt8(index + 3),
      //   hour: buf.readUInt8(index + 4),
      //   minute: buf.readUInt8(index + 5),
      //   second: buf.readUInt8(index + 6),
      // };
      index += 7;
    }
    if (flags & 0x04) {
      // Pulse Rate Flag
      result.PulseRate = this._readSFLOAT_LE(buf, index);
      index += 2;
    }

    return result;
  }

  private _getCharsCoopMode() {
    if (!this._peripheral) {
      throw new Error("UA1200BLE not found");
    }

    const bloodPressureMeasurementChar: BleRemoteCharacteristic = this._peripheral
      .getService("1810")!
      .getCharacteristic("2A35")!;
    const customServiceChar = this._peripheral
      .getService("233bf0005a341b6d975c000d5690abe4")! // Primary Service Custom Service(pp.26)
      .getCharacteristic("233bf0015a341b6d975c000d5690abe4")!; // Custom Characteristic(pp.27)

    return {
      bloodPressureMeasurementChar,
      customServiceChar,
    };
  }

  private _getCharsSingleMode() {
    if (!this._peripheral) {
      throw new Error("UA1200BLE not found");
    }

    const bloodPressureMeasurementChar: BleRemoteCharacteristic = this._peripheral
      .getService("1810")!
      .getCharacteristic("2A35")!;
    const timeChar = this._peripheral.getService("1805")!.getCharacteristic("2A2B")!;
    // const CCCDChar = this._peripheral.getService("1810")!.getCharacteristic("2902")!;

    return {
      bloodPressureMeasurementChar,
      timeChar,
      // CCCDChar,
    };
  }

  private async _writeTimeChar(timeOffsetMinute: number) {
    const { timeChar } = this._getCharsSingleMode();

    const date = new Date();
    date.setTime(Date.now() + 1000 * 60 * timeOffsetMinute);
    const buf = Buffer.alloc(9);
    // Current Time Service(pp.11)
    buf.writeUInt16LE(date.getUTCFullYear(), 0);
    buf.writeUInt8(date.getUTCMonth() + 1, 2);
    buf.writeUInt8(date.getUTCDate(), 3);
    buf.writeUInt8(date.getUTCHours(), 4);
    buf.writeUInt8(date.getUTCMinutes(), 5);
    buf.writeUInt8(date.getUTCSeconds(), 6);
    buf.writeUInt8(date.getDay(), 7);
    buf.writeUInt8(0, 8);

    const arr = Array.from(buf);
    await timeChar.writeWait(arr);
  }

  // private async _writeCCCDChar() {
  //   const { CCCDChar } = this._getCharsSingleMode();
  //   await CCCDChar.writeWait([512]);
  // }
}
