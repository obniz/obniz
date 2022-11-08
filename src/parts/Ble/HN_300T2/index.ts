/**
 * @packageDocumentation
 * @module Parts.HN_300T2
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface HN_300T2Options {}

export interface HN_300T2Result {
  /**
   * weight(kg) 体重(kg)
   */
  weight?: number;

  /** timestamp タイムスタンプ */
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
}

export default class HN_300T2 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'HN_300T2',
    };
  }

  public _peripheral: BleRemotePeripheral;
  private _timezoneOffset: number;
  public onNotify?: (co2: number) => void;
  public ondisconnect?: (reason: any) => void;

  /**
   *
   * @param timeOffsetMinute difference from UTC (Unit: minutes) 協定世界時との差(単位: 分)
   */
  constructor(peripheral: BleRemotePeripheral, timezoneOffset: number) {
    if (!peripheral || !HN_300T2.isDevice(peripheral)) {
      throw new Error('peripheral is not HN_300TN');
    }
    this._peripheral = peripheral;
    this._timezoneOffset = timezoneOffset ? timezoneOffset : 9 * 60;
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return (
      peripheral.localName && peripheral.localName.startsWith('BLESmart_0001')
    );
  }

  public isPairingMode() {
    if (!this._peripheral) {
      throw new Error('HN_300TN not found');
    }

    if ((this._peripheral.adv_data[15] & 8) === 8) {
      return true;
    } else {
      return false;
    }
  }

  public async pairingWait({ disconnect } = { disconnect: true }) {
    if (!this.isPairingMode()) {
      throw new Error('HN_300TN is not pairing mode.');
    }

    await this._peripheral.connectWait({
      waitUntilPairing: true,
    });

    const keys = await this._peripheral.getPairingKeysWait();
    if (!keys) {
      throw new Error('HN_300TN pairing failed');
    }
    if (disconnect) {
      await this._peripheral.disconnectWait();
    }
    return keys;
  }

  public async getDataWait(pairingKeys: string): Promise<HN_300T2Result[]> {
    if (!this._peripheral) {
      throw new Error('HN_300T2 not found');
    }

    await this._peripheral.connectWait({
      pairingOption: { keys: pairingKeys },
    });

    const results: HN_300T2Result[] = [];

    const deviceInfoService = this._peripheral.getService('1805');
    const currentTimeChara = deviceInfoService!.getCharacteristic('2A2B');

    await this.writeCurrentTimeWait(currentTimeChara!);

    const service = this._peripheral.getService('181D');

    const waitDisconnect = new Promise<HN_300T2Result[]>((resolve, reject) => {
      if (!this._peripheral) return;
      this._peripheral.ondisconnect = (reason: any) => {
        resolve(results);
      };
    });

    const WeightMeasurementChara = service!.getCharacteristic('2A9D');

    await WeightMeasurementChara!.registerNotifyWait(async (data) => {
      results.push(this._analyseWeightMesureData(data));
      return;
    });

    return await waitDisconnect;
  }

  private _analyseWeightMesureData(data: number[]): HN_300T2Result {
    const buf = Buffer.from(data);
    const result: HN_300T2Result = {};

    result.weight = ((data[2] << 8) | data[1]) * 0.005;
    result.date = {
      year: buf.readUInt16LE(3),
      month: buf.readUInt8(5),
      day: buf.readUInt8(6),
      hour: buf.readUInt8(7),
      minute: buf.readUInt8(8),
      second: buf.readUInt8(9),
    };

    const user = buf.readUInt8(10);

    return result;
  }

  private async writeCurrentTimeWait(chara: BleRemoteCharacteristic) {
    const dayFormat: number[] = [7, 1, 2, 3, 4, 5, 6];
    const date = new Date();
    date.setTime(Date.now() + 1000 * 60 * this._timezoneOffset);

    const buf = Buffer.alloc(10);
    buf.writeUInt16LE(date.getUTCFullYear(), 0);
    buf.writeUInt8(date.getUTCMonth() + 1, 2);
    buf.writeUInt8(date.getUTCDate(), 3);
    buf.writeUInt8(date.getUTCHours(), 4);
    buf.writeUInt8(date.getUTCMinutes(), 5);
    buf.writeUInt8(date.getUTCSeconds(), 6);
    buf.writeUInt8(dayFormat[date.getUTCDay()], 7);
    buf.writeUInt8(Math.trunc(date.getUTCMilliseconds() / (9999 / 256)), 8);
    buf.writeUInt8(1, 9);
    const arr = Array.from(buf);
    await chara!.writeWait(arr);
  }
}
