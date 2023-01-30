import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import Obniz from '../../../obniz';
import BleRemotePeripheral = Obniz.BleRemotePeripheral;
import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';

export interface MC_6810T2Options {}

export interface MC_6810T2Result {
  temperature?: number;
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
}

export default class MC_6810T2 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'MC_6810T2',
    };
  }

  public _peripheral: BleRemotePeripheral;
  public ondisconnect?: (reason: any) => void;
  _timezoneOffset: number;

  constructor(peripheral: BleRemotePeripheral, timezoneOffset: number) {
    if (!peripheral || !MC_6810T2.isDevice(peripheral)) {
      throw new Error('peripheral is not MC_6810T2');
    }
    this._peripheral = peripheral;
    this._timezoneOffset = timezoneOffset ? timezoneOffset : 9 * 60;
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (!peripheral.localName) return false;
    return peripheral.localName.startsWith('BLESmart_00130003');
  }

  public isPairingMode() {
    if (!this._peripheral) {
      throw new Error('MC_6810T2 not found');
    }

    return !!(this._peripheral.adv_data[15] & 8);
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
      throw new Error('MC_6810T2 not found');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };

    await this._peripheral.connectWait({
      waitUntilPairing: true,
    });

    console.log('paring done');
    const keys = await this._peripheral.getPairingKeysWait();

    console.log('write current time');
    const currentTime = this._peripheral!.getService('1805');
    const current = await currentTime?.getCharacteristic('2a2b');
    await this.writeCurrentTimeWait(current!);

    console.log('read last data');
    const service = this._peripheral!.getService('1809');
    const chara = await service?.getCharacteristic('2a1c');
    await chara?.registerNotifyWait((data) => {
      console.log('data');
    });

    console.log('read current time');
    await current?.readWait();

    // await this._peripheral.disconnectWait();
    const waitDisconnect = new Promise<string | null>((resolve, reject) => {
      if (!this._peripheral) return;
      this._peripheral.ondisconnect = (reason: any) => {
        resolve(keys);
      };
    });

    return await waitDisconnect;
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
      throw new Error('MC_6810T2 not found');
    }

    let result: MC_6810T2Result = {};

    await this._peripheral.connectWait({
      pairingOption: { keys: pairingKeys },
    });
    const currentTime = this._peripheral!.getService('1805');
    const current = await currentTime?.getCharacteristic('2a2b');

    await this.writeCurrentTimeWait(current!);
    const service = this._peripheral!.getService('1809');
    const chara = await service?.getCharacteristic('2a1c');

    await chara?.registerNotifyWait((data) => {
      result = this._analyseData(data);
    });

    const waitDisconnect = new Promise<MC_6810T2Result>((resolve, reject) => {
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

  private _analyseData(data: number[]): MC_6810T2Result {
    const buf = Buffer.from(data);
    const result: MC_6810T2Result = {};

    const tmpData = buf.readUInt32LE(1);
    let ul = tmpData & 0x00ffffff;
    if ((ul & 0x00800000) > 0) {
      ul = -1 * (~(ul - 0x01) & 0x00ffffff);
    }
    const exponential = tmpData >> 24;
    result.temperature = ul * Math.pow(10, exponential);
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
