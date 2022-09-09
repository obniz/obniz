/**
 * @packageDocumentation
 * @module Parts.GT_7510
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemoteCharacteristic from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

import crypto from 'crypto';

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

  private key = '';

  constructor(peripheral: BleRemotePeripheral) {
    if (!peripheral || !GT_7510.isDevice(peripheral)) {
      throw new Error('peripheral is not GT_7510');
    }
    this._peripheral = peripheral;
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName && peripheral.localName.indexOf('GT-7510') >= 0;
  }

  public async pairingWait(passkeyCallback: () => Promise<number>) {
    await this._peripheral.connectWait({
      pairingOption: {
        passkeyCallback,
        onPairedCallback: (keys) => {
          this.key = keys;
          console.log('paired', keys);
        },
        onPairingFailed: () => {
          console.log(`pairing failed`);
        },
      },
    });

    const customService = this._peripheral.getService(
      '7ae4000153f646288894b231f30a81d7'
    );
    const meterChara = customService!.getCharacteristic(
      '7ae4200253f646288894b231f30a81d7'
    );
    await meterChara!.registerNotifyWait((data) => {
      return;
    });
    await meterChara!.writeWait([0xa2, 0x6f, 0x62, 0x6e, 0x69, 0x7a]); // obniz
  }

  public async getDataWait(key: string) {
    const results: GT_7510Result[] = [];
    await this._peripheral.connectWait({
      pairingOption: {
        keys: key ? key : this.key,
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
    let mode = 0;
    await commandChara!.registerNotifyWait(async (data) => {
      if (data[0] === 68 || mode === 1) {
        mode = 1;
        meterInfoData = meterInfoData.concat(data);
      }

      if (data.slice(-3).toString() === '13,10,6') {
        const a = meterInfoData;
        const result = this.analyzeData(a);
        meterInfoData = [];
        mode = 0;
        results.push(result);
        await this._peripheral.disconnectWait();
      }
    });

    await commandChara!.writeWait([0x16]);

    const waitDisconnect = new Promise<GT_7510Result[]>((resolve, reject) => {
      if (!this._peripheral) return;
      this._peripheral.ondisconnect = (reason: any) => {
        resolve(results);
      };
    });

    return await waitDisconnect;
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
