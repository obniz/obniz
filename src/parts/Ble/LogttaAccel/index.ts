/**
 * @packageDocumentation
 * @module Parts.Logtta_Accel
 */

import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface Logtta_AccelOptions {}

export interface Logtta_Accel_ScanData {
  revision: number;
  sequence: number;
  battery: number;
  name: string;
  setting: {
    temp_cycle: number;
    accel_sampling: number;
    hpf: boolean;
    accel_range: number;
    accel_axis: number;
    accel_resolution: number;
  };
  temperature: number;
  humidity: number;
  alert: number[];
}

export interface Logtta_Accel_AccelData {
  x: {
    peak: number;
    rms: number;
  };
  y: {
    peak: number;
    rms: number;
  };
  z: {
    peak: number;
    rms: number;
  };
}

export default class Logtta_Accel implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "Logtta_Accel",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    const advertise = peripheral.advertise_data_rows.filter((adv: number[]) => {
      let find = false;
      if (this.deviceAdv.length > adv.length) {
        return find;
      }
      for (let index = 0; index < this.deviceAdv.length; index++) {
        if (this.deviceAdv[index] === -1) {
          continue;
        }
        if (adv[index] === this.deviceAdv[index]) {
          find = true;
          continue;
        }
        find = false;
        break;
      }
      return find;
    });
    return advertise.length !== 0;
  }

  public static getScanData(peripheral: BleRemotePeripheral): Logtta_Accel_ScanData | null {
    if (!Logtta_Accel.isDevice(peripheral)) {
      return null;
    }

    if (peripheral.adv_data && peripheral.adv_data.length === 31) {
      const d = peripheral.adv_data;

      let sampling = 0;
      switch (d[18]) {
        case 0x00:
          sampling = 800;
          break;
        case 0x01:
          sampling = 400;
          break;
        case 0x02:
          sampling = 200;
          break;
        case 0x03:
          sampling = 100;
          break;
        case 0x04:
          sampling = 50;
          break;
      }

      const alertArray: number[] = [];
      alertArray.push((d[26] & 0b11110000) >> 4);
      alertArray.push(d[26] & 0b00001111);
      alertArray.push((d[27] & 0b11110000) >> 4);
      alertArray.push(d[27] & 0b00001111);

      return {
        revision: d[5],
        sequence: d[6],
        battery: d[7],
        name: new TextDecoder().decode(new Uint8Array(d.slice(8, 16))),
        setting: {
          temp_cycle: d[16] | (d[17] << 8),
          accel_sampling: sampling,
          hpf: !!(d[19] & 0b00010000),
          accel_range: 2 * ((d[19] & 0b00000011) + 1),
          accel_axis: d[20] & 0b00000111,
          accel_resolution: d[21],
        },
        temperature: Math.floor((((d[22] | (d[23] << 8)) / 65535) * 175 - 45) * 100) / 100,
        humidity: Math.floor(((d[24] | (d[25] << 8)) / 65535) * 100 * 100) / 100,
        alert: alertArray,
      };
    }
    return null;
  }

  public static getAccelData(peripheral: BleRemotePeripheral): Logtta_Accel_AccelData | null {
    if (!Logtta_Accel.isDevice(peripheral)) {
      return null;
    }

    if (peripheral.scan_resp && peripheral.scan_resp.length === 31) {
      const d = peripheral.scan_resp;

      // console.log(
      //   `x peak ${data.x.peak} rms ${data.x.rms} y peak ${data.y.peak} rms ${data.y.rms} z peak ${data.z.peak} rms ${data.z.rms} address ${data.address}`,
      // );
      return {
        x: {
          peak: d[5] | (d[6] << 8),
          rms: d[7] | (d[8] << 8) | (d[9] << 16) | (d[10] << 24) | (d[11] << 32) | (d[12] << 40),
        },
        y: {
          peak: d[13] | (d[14] << 8),
          rms: d[15] | (d[16] << 8) | (d[17] << 16) | (d[18] << 24) | (d[19] << 32) | (d[20] << 40),
        },
        z: {
          peak: d[21] | (d[22] << 8),
          rms: d[23] | (d[24] << 8) | (d[25] << 16) | (d[26] << 24) | (d[27] << 32) | (d[28] << 40),
        },
      };
    }
    return null;
  }

  private static deviceAdv: number[] = [
    0xff, // Manufacturer vendor code
    0x10, // Manufacturer vendor code
    0x05, // Magic code
    0x05, // Magic code
  ];

  public _peripheral: BleRemotePeripheral | null = null;

  constructor() {}
}
