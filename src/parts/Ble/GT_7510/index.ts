/**
 * @packageDocumentation
 * @module Parts.GT_7510
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

import crypto from 'crypto';
import EventEmitter from 'eventemitter3';

export interface GT_7510Options {}

export interface GT_7510Result {
  /**
   * Blood glucose level(mg/dL) 血糖値(mg/dL)
   */
  glucose: number;

  /**
   * 計測日時 (年/月/日 時:分)
   */
  date: string;

  /**
   * blood glucose range, 血糖値範囲 (通常、高値、低値)
   */
  range: string;

  /**
   * measurement timing, 測定タイミング
   */
  timing: string;
}

export default class GT_7510 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'GT_7510',
    };
  }

  public _peripheral: BleRemotePeripheral;
  public onNotify?: (co2: number) => void;
  public ondisconnect?: (reason: any) => void;

  private _emitter = new EventEmitter();
  private _buffer: Buffer[] = [];

  private STX = 0x02;
  private ETX = 0x03;
  private EOT = 0x04;
  private ENQ = 0x05;
  private ACK = 0x06;
  private NAK = 0x15;
  private ETB = 0x17;
  private SYN = 0x16;

  constructor(peripheral: BleRemotePeripheral) {
    if (!peripheral || !GT_7510.isDevice(peripheral)) {
      throw new Error('peripheral is not GT_7510');
    }
    this._peripheral = peripheral;
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName && peripheral.localName.indexOf('GT-7510') >= 0;
  }

  public isPairingMode() {
    if (!this._peripheral) {
      throw new Error('GT_7510 not found');
    }

    if (this._peripheral.adv_data[13] === 3) {
      return true;
    } else {
      return false;
    }
  }

  public async pairingWait(
    passkeyCallback: () => Promise<number>,
    option: { name?: string } = {}
  ) {
    const name = option.name ?? `obniz${this._peripheral.obnizBle.Obniz.id}`;
    if (!this.isPairingMode()) {
      throw new Error('GT_7510 is not pairing mode.');
    }

    await new Promise((resolve, reject) => {
      this._peripheral
        .connectWait({
          pairingOption: {
            passkeyCallback,
            onPairingFailed: (e) => {
              reject(e);
            },
          },
          waitUntilPairing: true,
        })
        .then(resolve)
        .catch(reject);
    });
    const key = await this._peripheral.getPairingKeysWait();
    if (!key) {
      throw new Error('GT_7510 pairing failed');
    }
    const customService = this._peripheral.getService(
      '7ae4000153f646288894b231f30a81d7'
    );
    const meterChara = customService!.getCharacteristic(
      '7ae4200253f646288894b231f30a81d7'
    );
    await meterChara!.registerNotifyWait(async (data) => {
      try {
        // 向こうから切断される
        await meterChara!.writeWait([0x90]);
        return;
      } catch (e) {
        // do nothing
      }
    });
    await meterChara!.writeWait([
      0xa2,
      ...Array.from(Buffer.from(name.slice(0, 16), 'utf8')),
    ]);
    return key;
  }

  public async connectWait(key: string) {
    await this._peripheral.connectWait({
      pairingOption: {
        keys: key,
      },
    });
  }

  public async getDataWait(key: string) {
    const results: GT_7510Result[] = [];
    await this._peripheral.connectWait({
      pairingOption: {
        keys: key,
      },
    });

    const customService = this._peripheral.getService(
      '7ae4000153f646288894b231f30a81d7'
    );

    const commandChara = customService!.getCharacteristic(
      '7ae4100153f646288894b231f30a81d7'
    );
    const securityChara = customService!.getCharacteristic(
      '7ae4200153f646288894b231f30a81d7'
    );

    let charengeArr: number[];
    await securityChara!.registerNotifyWait((data) => {
      charengeArr = data.slice(2);
      if (data[1] === 82) {
        if (data[2] !== 0) {
          throw new Error('Authentication error');
        }
      }
    });
    await securityChara!.writeWait([0x50]);

    const deviceName = '373531302D';
    const serialHex = this.toHex(this._peripheral.scan_resp!.slice(10, 17));
    const masterKey =
      '7AFCE720C798F4F46C98B0B8D87D242E13CD2056B3458D4EC58F4455DA2C89A0';
    const str = deviceName + serialHex + masterKey;

    const deviceKey = await this.digestMessageWait(str);
    const charengeCode = this.toHex(charengeArr!);
    const message = deviceName + serialHex + charengeCode;

    const deviceKeyBuf = Buffer.from(deviceKey, 'hex');
    const messageBuf = Buffer.from(message, 'hex');

    const hmac = crypto.createHmac('sha256', deviceKeyBuf);
    hmac.update(messageBuf);
    const authKey = hmac.digest('hex');
    const buf = Buffer.from(authKey, 'hex');
    const arr = [0x52];
    arr.push(...buf);
    await securityChara!.writeWait(arr);

    let meterInfoData: number[] = [];
    // let mode = 0;
    await commandChara!.registerNotifyWait(async (data) => {
      // console.log(`${new Date()} receive ${Buffer.from(data).toString('hex')}`);
      this._buffer.push(Buffer.from(data));
      this._emitter.emit('data');
    });

    await commandChara!.writeWait([this.SYN]);
    let mode = 0;
    for (let i = 0; i < 100; i++) {
      // 無限ループ対策
      const data = await this._getCommandDataWait();
      if (data.readUInt8(0) === 68 || mode === 1) {
        mode = 1;
        meterInfoData = [...meterInfoData, ...Array.from(data)];
      }
      const last3Data = data.slice(-3);
      if (last3Data.toString('hex') === '0d0a06' /* '13,10,6'*/) {
        mode = 0;
        break;
      }
    }
    const result = this.analyzeData(meterInfoData);

    const d1 = await this._sendCommandDataReplyWait(
      commandChara!,
      // Buffer.from([this.SYN])
      // Buffer.from([this.ACK])
      // Buffer.from([this.NAK])
      Buffer.from([0xa1])
    );
    try {
      const d2 = await this._sendCommandDataReplyWait(
        commandChara!,
        Buffer.from([0xa1])
      );
    } catch (e) {
      // d1で既にdisconnectされてるかもしれない。ただ、05 = ENQ がきてるので再送も入れとく。
    }
    return [result];
  }

  private _sendCommandDataReplyWait(
    commandChara: BleRemoteCharacteristic,
    sendData: Buffer
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (this._buffer.length > 0) {
        throw new Error('Not empty buffer');
      }
      this._getCommandDataWait().then(resolve).catch(reject);
      commandChara.writeWait(Array.from(sendData)).catch(reject);
    });
  }

  private _getCommandDataWait(): Promise<Buffer> {
    if (this._buffer.length > 0) {
      const b = this._buffer.shift()!;
      return Promise.resolve(b);
    }
    return new Promise((resolve) => {
      this._emitter.once('data', () => {
        if (this._buffer.length > 0) {
          resolve(this._buffer.shift()!);
        }
      });
    });
  }

  private async digestMessageWait(message: string) {
    const buffer = Buffer.from(message, 'hex');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  private toHex(arr: number[]) {
    return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  private analyzeData(data: number[]) {
    const _data = [];
    let pos = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] === 124) {
        _data.push(data.slice(pos, i));
        pos = i + 1;
      }
    }

    data = _data[4];
    const r = String.fromCharCode(data[4], data[5]);
    const l = String.fromCharCode(data[6], data[7]);

    const min = String.fromCharCode(data[8], data[9]);
    const hour = String.fromCharCode(data[10], data[11]);
    const day = String.fromCharCode(data[12], data[13]);
    const month = String.fromCharCode(data[14], data[15]);
    const year = String.fromCharCode(data[16], data[17]);
    let range = String.fromCharCode(data[18], data[19]);
    let timing = String.fromCharCode(data[20]);
    let _range = parseInt(range, 16);
    _range = _range & 96; // 96 = flag up(bit5,bit6)

    if (_range === 0) {
      // 00
      range = '通常';
    } else if (_range === 64) {
      // 10
      range = '高値';
    } else if (_range === 32) {
      // 01
      range = '低値';
    }

    const timngArr = [
      '未指定',
      '朝食前',
      '朝食後',
      '昼食前',
      '昼食後',
      '夕食前',
      '夕食後',
      '就寝前',
      '夜間',
      '食後マーク',
    ];
    timing = timngArr[parseInt(timing, 16)];

    const result = {
      glucose: (parseInt(l, 16) << 8) | parseInt(r, 16),
      date: `${year}/${month}/${day} ${hour}:${min}`,
      range,
      timing,
    };

    return result;
  }
}
