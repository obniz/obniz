import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import Obniz from '../../../obniz';
import BleRemotePeripheral = Obniz.BleRemotePeripheral;
import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { HN_300T2Result } from '../HN_300T2';

export interface HPO_300TOptions {}

export interface HPO_300TResult {
  /**
   * weight(kg) 体重(kg)
   */
  spo2?: number;
  pulseRate?: number;
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
}

export default class HPO_300T implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'HPO_300T',
    };
  }

  public _peripheral: BleRemotePeripheral;
  public ondisconnect?: (reason: any) => void;
  _timezoneOffset: number;

  constructor(peripheral: BleRemotePeripheral, timezoneOffset: number) {
    if (!peripheral || !HPO_300T.isDevice(peripheral)) {
      throw new Error('peripheral is not HPO_300T');
    }
    this._peripheral = peripheral;
    this._timezoneOffset = timezoneOffset ? timezoneOffset : 9 * 60;
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (!peripheral.localName) return false;
    return (
      peripheral.localName.startsWith('BLEsmart_00060002') ||
      peripheral.localName.startsWith('BLESmart_00060002')
    );
  }

  public isPairingMode() {
    if (!this._peripheral) {
      throw new Error('HPO_300T not found');
    }

    // BLEsmart -> paring mode
    // BLESmart -> normal adv
    if (this._peripheral.localName?.startsWith('BLEs')) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Pair with the device
   *
   * デバイスとペアリング 電源ボタンを長押しする
   *
   * @returns pairing key ペアリングキー
   */
  public async pairingWait(): Promise<string | null> {
    if (!this._peripheral) {
      throw new Error('HPO_300T not found');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };

    await this._peripheral.connectWait({
      waitUntilPairing: true,
    });

    const keys = await this._peripheral.getPairingKeysWait();

    const currentTime = this._peripheral!.getService('1805');
    const current = await currentTime?.getCharacteristic('2a2b');
    await this.writeCurrentTimeWait(current!);

    await this._peripheral.disconnectWait();
    return keys;
  }

  /**
   * Get SpO2, PulseRate Data from Device
   *
   * デバイスから計測データをとる
   *
   * @returns 受け取ったデータ
   */
  public async getDataWait(pairingKeys: string) {
    if (!this._peripheral) {
      throw new Error('HPO_300T not found');
    }

    let result: HPO_300TResult = {};

    await this._peripheral.connectWait({
      pairingOption: { keys: pairingKeys },
    });
    const currentTime = this._peripheral!.getService('1805');
    const current = await currentTime?.getCharacteristic('2a2b');

    await this.writeCurrentTimeWait(current!);
    const service = this._peripheral!.getService(
      '6E400001B5A3F393EFA9E50E24DCCA9E'
    );
    const chara = await service?.getCharacteristic(
      '6E4000F1B5A3F393EFA9E50E24DCCA9E'
    );

    await chara?.registerNotifyWait((data) => {
      result = this._analyseData(data);
    });

    const waitDisconnect = new Promise<HPO_300TResult>((resolve, reject) => {
      if (!this._peripheral) return;
      this._peripheral.ondisconnect = (reason: any) => {
        resolve(result);
      };
    });

    return await waitDisconnect;
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

  private _analyseData(data: number[]): HPO_300TResult {
    const buf = Buffer.from(data);
    const result: HPO_300TResult = {};

    result.spo2 = (data[2] << 8) | data[1];
    result.pulseRate = (data[4] << 8) | data[3];
    result.date = {
      year: buf.readUInt16LE(5),
      month: buf.readUInt8(7),
      day: buf.readUInt8(8),
      hour: buf.readUInt8(9),
      minute: buf.readUInt8(10),
      second: buf.readUInt8(11),
    };
    return result;
  }
}
