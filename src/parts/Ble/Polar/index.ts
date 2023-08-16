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

export interface PolarOptions { }

export interface PolarData {
  batteryStatus: boolean,
  sensorContact: boolean,
  advFrameCounter: number,
  broadcastBit: boolean,
  sensorDataType: boolean,
  statusFlags: boolean,
  khzCode: number,
  fastAverageHr: number,
  slowAverageHr?: number
}

export default class Polar implements ObnizPartsBleInterface {

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Polar',
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    if (!peripheral.localName || peripheral.localName.indexOf('Polar') < 0) {
      return false;
    }
    const manufacturerSpecificData = peripheral.manufacturerSpecificData;
    if (!manufacturerSpecificData) {
      return;
    }
    if (manufacturerSpecificData.length < 2) {
      return false;
    }
    let offset = 0;
    if (manufacturerSpecificData[offset] !== 0x6B || manufacturerSpecificData[offset + 1] !== 0x00) {
      return false;
    }
    return true;
  }

  public static getData(peripheral: BleRemotePeripheral): PolarData | null {
    if (!this.isDevice(peripheral)) {
      return null;
    }
    const manufacturerSpecificData = peripheral.manufacturerSpecificData!;
    let offset = 5 + 2;
    const payload = manufacturerSpecificData.slice(7);
    // found manufacturer
    if (payload.length === offset + 3 || payload.length === offset + 4) {
      return this.buildFromPayload(payload.slice(offset));
    }
    let lastData: PolarData | null = null;
    while (offset < payload.length) {
      const gpbDataBit = payload[offset] & 0x40;
      console.log('gpbDataBit', gpbDataBit);
      if (gpbDataBit === 0) {
        if ((offset + 3) <= payload.length) {
          lastData = this.buildFromPayload(payload.slice(offset));
        }
        offset += 3;
      } else {
        if (offset + 1 <= payload.length) {
          offset += payload[offset + 1] + 1;
        }
        offset += 1;
      }
    }
    return lastData;
  }

  private static buildFromPayload(payload: number[]): PolarData | null {
    console.log('build', payload);
    if (payload.length < 3) {

      return null
    }
    let result: PolarData;

    // 3byte mode
    // 0byte 0bit batteryStatus
    // 0byte 1bit sensorContact
    // 0byte 2-4bit advFrameCounter
    // 0byte 5bit broadcastBit
    // 0byte 6bit sensorDataType
    // 0byte 7bit statusFlags
    // 1byte khzCode
    // 2byte fastAverageHr
    // (3byte not exist. But SDK treat 2byte as slowAverageHr)

    // 4byte mode
    // 0byte same as 3byte mode
    // 1byte khzCode
    // 2byte fastAverageHr
    // 3byte slowAverageHr

    result = {
      batteryStatus: ((payload[0] >> 0) & 0b1) ? true : false,
      sensorContact: ((payload[0] >> 1) & 0b1) ? true : false,
      advFrameCounter: (payload[0] >> 2) & 0b111,
      broadcastBit: ((payload[0] >> 5) & 0b1) ? true : false,
      sensorDataType: ((payload[0] >> 6) & 0b1) ? true : false,
      statusFlags: ((payload[0] >> 7) & 0b1) ? true : false,
      khzCode: payload[1],
      fastAverageHr: payload[2],
    }

    if (payload.length > 3) {
      result.slowAverageHr = payload[3];
    }

    return result;
  }
}
