/**
 * @packageDocumentation
 * @module Parts.EMDCB
 */
/* eslint rulesdir/non-ascii: 0 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface EMDCBOptions {}

export interface EMDCB_Data {
  address: string;
  energy_level?: number;
  light_level_solar_cell?: number;
  light_level_sensor?: number;
  occupancy_status?: boolean;
}

export default class EMDCB implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'EMDCB',
    };
  }

  /**
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (peripheral.adv_data[2] === 0xda && peripheral.adv_data[3] === 0x03) {
      return true;
    } else {
      return false;
    }
  }

  /**
   */
  public static getData(peripheral: BleRemotePeripheral): EMDCB_Data | null {
    const results = this.analyzeData(peripheral);
    const data: EMDCB_Data = {
      address: peripheral.address,
      energy_level: results.energy_level,
      light_level_solar_cell: results.light_level_solar_cell,
      light_level_sensor: results.light_level_sensor,
      occupancy_status: results.occupancy_status,
    };
    return data;
  }

  /**
   */
  public static analyzeData(peripheral: BleRemotePeripheral) {
    const sensorData = peripheral.adv_data.slice(8, -4);
    let i = 0;
    let isDescriptor = true;
    let dataLength = 0;
    let typeId = 0;
    const results: {
      backup_battery_voltage?: number;
      energy_level?: number;
      light_level_solar_cell?: number;
      light_level_sensor?: number;
      occupancy_status?: boolean;
      commissioning_info?: number | null;
    } = {};

    while (i < sensorData.length) {
      if (isDescriptor) {
        const descriptor = sensorData[i];
        switch (descriptor >> 6) {
          case 0:
            dataLength = 1;
            break;
          case 1:
            dataLength = 2;
            break;
          case 2:
            dataLength = 4;
            break;
          case 3:
            dataLength = 0; // extended
            break;
          default:
            throw new Error();
        }
        typeId = descriptor & 0b111111;
        isDescriptor = false;
        i += 1;
      } else {
        let data = 0;
        switch (dataLength) {
          case 0x01:
            data = sensorData[i];
            break;
          case 0x02:
            data = (sensorData[i + 1] << 8) + sensorData[i];
            break;
          default:
            throw new Error();
        }
        switch (typeId) {
          case 0x01:
            results.backup_battery_voltage = data / 2;
            break;
          case 0x02:
            results.energy_level = data / 2;
            break;
          case 0x04:
            results.light_level_solar_cell = data;
            break;
          case 0x05:
            results.light_level_sensor = data;
            break;
          case 0x20:
            if (data === 1) {
              results.occupancy_status = false;
            } else if (data === 2) {
              results.occupancy_status = true;
            }
            break;
          case 0x3e:
            results.commissioning_info = null;
            break;
          default:
            throw new Error();
        }
        i += dataLength;
        isDescriptor = true;
      }
    }
    return results;
  }
}
