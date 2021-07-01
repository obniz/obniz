/**
 * @packageDocumentation
 * @module Parts.Logtta_Accel
 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { Triaxial } from '../../../obniz/ObnizParts';
import {
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  uint,
} from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';

export interface Logtta_AccelOptions {}

export interface Logtta_Accel_Data {
  revision: number;
  sequence: number;
  battery: number;
  name: string;
  setting: {
    temp_cycle: number;
    accel_sampling: number;
    hpf: boolean;
    accel_range: number;
    accel_axis: Logtta_Accel_Axis;
    accel_resolution: number;
  };
  temperature: number;
  humidity: number;
  alert: number[];
  accel_peak: Triaxial;
  accel_rms: Triaxial;
}

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

export type Logtta_Accel_Axis = (keyof Triaxial)[];

/** Only support in beacon mode */
export default class Logtta_Accel extends Logtta<Logtta_Accel_Data, unknown> {
  public static readonly PartsName = 'Logtta_Accel';

  public static readonly AvailableBleMode = 'Beacon';

  public static readonly ServiceUuids = {
    Connectable: 'c2de0000-a6c7-437f-8538-54e07f7845df',
    Beacon: null,
  };

  public static readonly BeaconDataLength = {
    Connectable: undefined,
    Beacon: 0x1e,
  };

  public static readonly BeaconDataLength_ScanResponse = {
    Connectable: undefined,
    Beacon: 0x1e,
  };

  public static readonly CompanyID = {
    Connectable: undefined,
    Beacon: [0x10, 0x05],
  };

  public static readonly CompanyID_ScanResponse = {
    Connectable: undefined,
    Beacon: [0x10, 0x05],
  };

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_Accel_Data> | null> = {
    Connectable: null,
    Beacon: {
      appearance: {
        index: 0,
        type: 'check',
        data: 0x05,
      },
      revision: {
        index: 1,
        type: 'unsignedNumLE',
      },
      sequence: {
        index: 2,
        type: 'unsignedNumLE',
      },
      battery: {
        index: 3,
        type: 'unsignedNumLE',
      },
      name: {
        index: 4,
        length: 8,
        type: 'string',
      },
      setting: {
        index: 12,
        length: 6,
        type: 'custom',
        func: (data) => ({
          temp_cycle: uint(data.slice(0, 2)),
          accel_sampling: Logtta_Accel.parseAccelSamplingData(data[2]),
          hpf: (data[3] & 0b00010000) > 0,
          accel_range: Logtta_Accel.parseAccelRangeData(data[3]),
          accel_axis: Logtta_Accel.parseAccelAxis(data[4]),
          accel_resolution: data[5],
        }),
      },
      temperature: {
        index: 18,
        length: 2,
        type: 'custom',
        func: (data) => (uint(data) / 0x10000) * 175 - 45,
      },
      humidity: {
        index: 20,
        length: 2,
        type: 'custom',
        func: (data) => (uint(data) / 0x10000) * 100,
      },
      alert: {
        index: 22,
        length: 2,
        type: 'custom',
        func: (data) => [
          (data[0] & 0b11110000) >> 4,
          data[0] & 0b00001111,
          (data[1] & 0b11110000) >> 4,
          data[1] & 0b00001111,
        ],
      },
      appearance_sr: {
        index: 0,
        type: 'check',
        data: 0x05,
        scanResponse: true,
      },
      accel_peak: {
        index: 0,
        length: 24,
        type: 'custom',
        func: (data, peripheral) => {
          if (!peripheral.manufacturerSpecificData)
            throw new Error('Manufacturer specific data is null.');

          const range = Logtta_Accel.parseAccelRangeData(
            peripheral.manufacturerSpecificData[17]
          );
          const resolution = peripheral.manufacturerSpecificData[19];

          return (Object.fromEntries(
            ['x', 'y', 'z'].map((key, i) => [
              key,
              (uint(data.slice(i * 8, i * 8 + 2)) / (2 ** resolution - 1)) *
                range,
            ])
          ) as unknown) as Triaxial;
        },
        scanResponse: true,
      },
      accel_rms: {
        index: 0,
        length: 24,
        type: 'custom',
        func: (data, peripheral) => {
          if (!peripheral.manufacturerSpecificData)
            throw new Error('Manufacturer specific data is null.');

          const range = Logtta_Accel.parseAccelRangeData(
            peripheral.manufacturerSpecificData[17]
          );
          const resolution = peripheral.manufacturerSpecificData[19];
          const n =
            Logtta_Accel.parseAccelSamplingData(
              peripheral.manufacturerSpecificData[16]
            ) * uint(peripheral.manufacturerSpecificData.slice(14, 16));

          return (Object.fromEntries(
            ['x', 'y', 'z'].map((key, i) => [
              key,
              (range / (2 ** resolution - 1)) *
                Math.sqrt(uint(data.slice(i * 8 + 2, i * 8 + 8)) / n),
            ])
          ) as unknown) as Triaxial;
        },
        scanResponse: true,
      },
    },
  };

  protected static parseAccelSamplingData(data: number): number {
    return 50 * 2 ** (4 - data);
  }

  protected static parseAccelRangeData(data: number): number {
    return 2 ** ((data & 0b00000011) + 1) * 1000 * 1000;
  }

  protected static parseAccelAxis(data: number): Logtta_Accel_Axis {
    return ['z', 'y', 'x'].filter(
      (key, i) => (data & (2 ** i)) > 0
    ) as Logtta_Accel_Axis;
  }

  protected readonly staticClass = Logtta_Accel;

  protected parseData(data: number[]): unknown {
    return data;
  }

  /** @deprecated */
  public static getScanData(
    peripheral: BleRemotePeripheral
  ): Logtta_Accel_ScanData | null {
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
        temperature:
          Math.floor((((d[22] | (d[23] << 8)) / 65535) * 175 - 45) * 100) / 100,
        humidity:
          Math.floor(((d[24] | (d[25] << 8)) / 65535) * 100 * 100) / 100,
        alert: alertArray,
      };
    }
    return null;
  }

  /** @deprecated */
  public static getAccelData(
    peripheral: BleRemotePeripheral
  ): Logtta_Accel_AccelData | null {
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
          rms:
            d[7] |
            (d[8] << 8) |
            (d[9] << 16) |
            (d[10] << 24) |
            (d[11] << 32) |
            (d[12] << 40),
        },
        y: {
          peak: d[13] | (d[14] << 8),
          rms:
            d[15] |
            (d[16] << 8) |
            (d[17] << 16) |
            (d[18] << 24) |
            (d[19] << 32) |
            (d[20] << 40),
        },
        z: {
          peak: d[21] | (d[22] << 8),
          rms:
            d[23] |
            (d[24] << 8) |
            (d[25] << 16) |
            (d[26] << 24) |
            (d[27] << 32) |
            (d[28] << 40),
        },
      };
    }
    return null;
  }
}
