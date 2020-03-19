/**
 * @packageDocumentation
 * @module Parts.uPRISM
 */

import Obniz from "../../../obniz";
import bleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { accelUnit } from "../../i2cImu6";

export interface uPRISMOptions {}

export type AccelRangeType = "2g" | "4g" | "8g" | "16g";

export interface uPRISM_Data {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  geomagnetic: {
    x: number;
    y: number;
    z: number;
  };
  time: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    micro_second: number;
  };
  index: number;
  temperature: number;
  humidity: number;
  ambient_light: number;
  uvi: number;
  pressure: number;
}

export default class uPRISM implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "uPRISM",
    };
  }

  private static signed16FromBinary(val1: number, val2: number): number {
    let val: number = val1 + val2 * 256;
    if ((val & 0x8000) !== 0) {
      val = val - 0x10000;
    }
    return val;
  }

  public onNotify?: (data: uPRISM_Data) => void;
  public keys: string[];
  public requiredKeys: string[];
  public periperal: bleRemotePeripheral | null;
  public obniz!: Obniz;
  public params: any;
  private readData: uPRISM_Data;
  private readIndex: number = -1;
  private target: any = {
    localName: "uPrism_00210D",
  };
  private accelRange: number = 1024;
  constructor() {
    this.keys = [];
    this.requiredKeys = [];
    this.periperal = null;
    this.readData = {
      acceleration: { x: 0, y: 0, z: 0 },
      geomagnetic: { x: 0, y: 0, z: 0 },
      time: {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        micro_second: 0,
      },
      index: 0,
      temperature: 0,
      humidity: 0,
      ambient_light: 0,
      uvi: 0,
      pressure: 0,
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
  }

  public async findWait(): Promise<any> {
    await this.obniz.ble!.initWait();
    this.periperal = await this.obniz.ble!.scan.startOneWait(this.target);
    return this.periperal;
  }

  public async findListWait(): Promise<bleRemotePeripheral[]> {
    await this.obniz.ble!.initWait();
    return await this.obniz.ble!.scan.startAllWait(this.target);
  }

  public async directConnectWait(address: string): Promise<boolean> {
    try {
      this.periperal = await this.obniz.ble!.scan.directConnectWait(address, "public");
    } catch (e) {
      return false;
    }
    return true;
  }

  public async connectWait(): Promise<boolean> {
    if (!this.periperal) {
      await this.findWait();
    }
    if (!this.periperal) {
      throw new Error("uPrism not found");
    }
    if (!this.periperal.connected) {
      try {
        await this.periperal.connectWait();
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  public async disconnectWait() {
    if (this.periperal && this.periperal.connected) {
      await this.periperal.disconnectWait();
    }
  }

  public setAccelRange(range: AccelRangeType) {
    switch (range) {
      case "2g":
        this.accelRange = 1024;
        break;
      case "4g":
        this.accelRange = 512;
        break;
      case "8g":
        this.accelRange = 256;
        break;
      case "16g":
        this.accelRange = 128;
        break;
    }
  }

  public async startNotifyWait() {
    if (!(await this.connectWait())) {
      return;
    }

    const rc = this.periperal!.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic(
      "51bc99bd-b22e-4ff5-807e-b641d21af060",
    );

    await rc.writeWait([0x04, 0x03, 0x01]);

    const c = this.periperal!.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic(
      "0d6fcf18-d935-49d1-836d-384c7b857b83",
    );

    await c.registerNotifyWait((data: number[]) => {
      if (data[1] !== 0x14) {
        return;
      }

      if (data[0] === 0xb1) {
        this.readIndex = data[19];
        this.readData = {
          acceleration: {
            x: uPRISM.signed16FromBinary(data[2], data[3]) / this.accelRange,
            y: uPRISM.signed16FromBinary(data[4], data[5]) / this.accelRange,
            z: uPRISM.signed16FromBinary(data[6], data[7]) / this.accelRange,
          },
          geomagnetic: {
            x: uPRISM.signed16FromBinary(data[8], data[9]) / 16,
            y: uPRISM.signed16FromBinary(data[10], data[11]) / 16,
            z: uPRISM.signed16FromBinary(data[12], data[13]) / 16,
          },
          time: {
            year: 0,
            month: 0,
            day: 0,
            hour: data[18],
            minute: data[17],
            second: data[16],
            micro_second: (data[15] << 8) | data[14],
          },
          index: data[19],
          temperature: 0,
          humidity: 0,
          ambient_light: 0,
          uvi: 0,
          pressure: 0,
        };
      } else if (data[0] === 0xb2) {
        if (this.readIndex === data[19]) {
          this.readData.temperature = uPRISM.signed16FromBinary(data[2], data[3]) / 100;
          this.readData.humidity = ((data[5] << 8) | data[4]) / 100;
          this.readData.ambient_light = ((data[8] << 16) | (data[7] << 8) | data[6]) / 128;
          this.readData.uvi = data[9] / 16;
          this.readData.pressure = (data[13] << 16) | (data[12] << 8) | data[11];
          this.readData.time.day = data[16];
          this.readData.time.month = data[17];
          this.readData.time.year = data[18];
          if (this.onNotify) {
            this.onNotify(this.readData);
          }
          // const r = this.readData;
          // console.log(
          //   `accel x:${r.acceleration.x} y:${r.acceleration.y} z:${r.acceleration.z}\n` +
          //     `geo x:${r.geomagnetic.x} y:${r.geomagnetic.y} z:${r.geomagnetic.z}\n` +
          //     `temp:${r.temperature}℃ humid:${r.humidity}% light:${r.ambient_light}lx pressure:${r.pressure}Pa UV index:${r.uvi} index:${r.index}\n` +
          //     `date ${r.time.year}/${r.time.month}/${r.time.day} ${r.time.hour}:${r.time.minute}:${r.time.second}:${r.time.micro_second}`,
          // );
        }
      }
    });
  }

  public async stopNotifyWait() {
    if (!(await this.connectWait())) {
      return;
    }

    const rc = this.periperal!.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic(
      "51bc99bd-b22e-4ff5-807e-b641d21af060",
    );

    await rc.writeWait([0x04, 0x03, 0x00]);

    const c = this.periperal!.getService("a587905b-ac98-4cb1-8b1d-5e22ae747d17").getCharacteristic(
      "0d6fcf18-d935-49d1-836d-384c7b857b83",
    );
    await c.unregisterNotifyWait();
  }
}
