/**
 * @packageDocumentation
 * @module Parts.Skinos
 */
/* eslint rulesdir/non-ascii: 0 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { relativeTimeThreshold } from 'moment';

export interface SkinosOptions {}

export interface Skinos_Data {
  time?: number;
  integral_sweat?: number;
  instance_sweat?: number;
  amount_alerts?: number;
  temperature_skin?: number;
  hart_rate?: number;
  temperature_basis_side?: number;
  humidity_basis_side?: number;
  temperature_skin_side?: number;
  humidity_skin_side?: number;
  hart_rate2?: number;
  hart_rate3?: number;
  accelerate_angle_x?: number;
  accelerate_angle_y?: number;
  accelerate_angle_z?: number;
  accelerate_x?: number;
  accelerate_y?: number;
  accelerate_z?: number;
  atmospheric_pressure?: number;
}

interface Page {
  block: number;
  page: number;
  timestamp: Date;
}

interface Log {
  [key: string]: Skinos_Data;
}

export default class Skinos implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  // UUID
  private serviceUuid = '01000000-0000-0000-0000-000000000087';
  private commandReadUuid = '02000000-0000-0000-0000-000000000087';
  private commandWriteUuid = '03000000-0000-0000-0000-000000000087';
  private notifyUuid = '04000000-0000-0000-0000-000000000087';
  private writeUuid = '05000000-0000-0000-0000-000000000087';

  // characteristics
  private commandReadChara?: BleRemoteCharacteristic;
  private commandWriteChara?: BleRemoteCharacteristic;
  private notifyChara?: BleRemoteCharacteristic;
  private writeNotifyChara?: BleRemoteCharacteristic;

  // flags
  public isGc = false;
  public isNotifyReadEnd = false;
  public isNotifyStart = false;

  public allData: Skinos_Data[] = [];
  public log: Log = {};

  private _timeZoneOffset = 9;

  constructor(p: BleRemotePeripheral, timeZoneOffset: number) {
    this._peripheral = p;
    this._timeZoneOffset = timeZoneOffset;
  }

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Skinos',
    };
  }

  public static isDevice(p: BleRemotePeripheral): boolean {
    return p.localName!.indexOf('SK-7-BLE') >= 0 ? true : false;
  }

  public async connectWait() {
    try {
      await this._peripheral!.connectWait({ autoDiscovery: false });
      await this._peripheral!.discoverAllServicesWait();
      const service = this._peripheral!.getService(this.serviceUuid);
      await service!.discoverAllCharacteristicsWait();
      this.commandReadChara = await service!.getCharacteristic(
        this.commandReadUuid
      )!;
      this.commandWriteChara = await service!.getCharacteristic(
        this.commandWriteUuid
      )!;
      this.notifyChara = await service!.getCharacteristic(this.notifyUuid)!;
      this.writeNotifyChara = await service!.getCharacteristic(this.writeUuid)!;
      return true;
    } catch (e) {
      console.log('connect failed');
      return false;
    }
  }

  public async disconnectWait() {
    try {
      await this._peripheral!.disconnectWait();
      this.commandReadChara = undefined;
      this.commandWriteChara = undefined;
      this.notifyChara = undefined;
      this.writeNotifyChara = undefined;
      return true;
    } catch (e) {
      console.log('disconnect failed');
      return false;
    }
  }

  // base送受信
  public async readCommandWait() {
    try {
      return await this.commandReadChara?.readWait();
    } catch (e) {
      console.log(e);
    }
  }

  public async writeCommandWait(array: number[]) {
    try {
      await this.commandWriteChara?.writeWait(array, false);
      await this.wait(500);
    } catch (e) {
      console.log(e);
    }
  }

  public async subscribeNotifyWait() {
    if (this.isNotifyStart) {
      console.log('notify has already started');
    }
    try {
      await this.notifyChara?.registerNotifyWait((data: number[]) => {
        this.analyNotifydata(data);
      });
      this.isNotifyStart = true;
    } catch (e) {
      console.log(e);
    }
  }

  public async unsubscribeNotifyWait() {
    if (!this.isNotifyStart) {
      console.log('notify has already unsubscribed');
    }
    try {
      await this.notifyChara?.unregisterNotifyWait();
      this.isNotifyStart = false;
    } catch (e) {
      console.log(e);
    }
  }

  public async writeNotifyWait(array: number[]) {
    try {
      await this.writeNotifyChara?.writeWait(array, false);
      // await this.writeNotifyChara?.writeWait(array);
    } catch (e) {
      console.log(e);
    }
  }

  private analyNotifydata(data: number[]) {
    if (data[0] === 0xff && data[1] === 0xff && data[2] === 0xff) {
      this.isNotifyReadEnd = true;
      return;
    }
    const unixTime =
      data[0] * 16777216 + data[1] * 65536 + data[2] * 256 + data[3];
    const timestamp = new Date(
      unixTime * 1000 + 1000 * 60 * 60 * this._timeZoneOffset
    );
    if (!this.log[timestamp.toString()]) {
      this.log[timestamp.toString()] = {};
    }

    let log;
    if (data[4] === 1) {
      log = {
        time: unixTime,
        integral_sweat: data[5] * 256 + data[6],
        instance_sweat: data[7] * 256 + data[8],
        amount_alert: data[9],
        temperature_skin: data[10] * 256 + data[11],
        hart_rate: data[12],
        temperature_basis_side: data[13],
        humidity_basis_side: data[14],
        temperature_skin_side: data[15],
        humidity_skin_side: data[16],
        hart_rate2: data[17],
        hart_rate3: data[18],
      };
    } else if (data[4] === 2) {
      log = {
        accelerate_angle_x: data[5] * 256 + data[6],
        accelerate_angle_y: data[7] * 256 + data[8],
        accelerate_angle_z: data[9] * 256 + data[10],
        accelerate_x: data[11] * 256 + data[12],
        accelerate_y: data[13] * 256 + data[14],
        accelerate_z: data[15] * 256 + data[16],
        atmospheric_pressure: data[17] * 256 + data[18],
      };
    } else {
      console.log(`something wrong: data [${data}]`);
    }

    if (Object.keys(this.log[timestamp.toString()]).length !== 0) {
      this.log[timestamp.toString()] = Object.assign(
        this.log[timestamp.toString()],
        log
      );
      this.allData.push(this.log[timestamp.toString()]);
    } else {
      this.log[timestamp.toString()] = log as Skinos_Data;
    }
  }

  // 現在時刻設定
  public async setNowDateWait() {
    const date = new Date();
    await this.commandVTWait(date);
  }

  public async getAllPagesWait() {
    const allPages: Page[] = [];
    for (let blockNo = 1; blockNo <= 9; blockNo++) {
      const res = await this.commandGBWait(blockNo);
      if (res) {
        for (let i = 1; i <= 7; i++) {
          const pageNo = (blockNo - 1) * 7 + i;
          if (pageNo > 60) {
            break;
          }
          const unixTime =
            res[i * 4] * 16777216 +
            res[i * 4 + 1] * 65536 +
            res[i * 4 + 2] * 256 +
            res[i * 4 + 3];
          const timestamp = new Date(
            unixTime * 1000 + 1000 * 60 * 60 * this._timeZoneOffset
          );
          const pageInfo = {
            block: blockNo,
            page: pageNo,
            timestamp,
          };
          allPages.push(pageInfo);
        }
      }
    }
    return allPages;
  }

  // 3〜10秒程度かかる。
  public async getOnePageDataWait(pageNo: number) {
    await this.commandGCWait(pageNo);
    this.isGc = true;

    // await this.commandEF();
    if (!this.isNotifyStart) {
      await this.subscribeNotifyWait();
      this.isNotifyReadEnd = false;
    }
    await this.commandGGWait();

    // 全て受け取るまで待つ。MAX=30sec
    for (let i = 0; i < 150; i++) {
      if (this.isNotifyReadEnd) {
        this.isNotifyReadEnd = false;
        break;
      }
      await this.wait(200);
    }
    const data = this.allData;
    this.allData = [];
    this.log = {};
    this.isGc = false;
    return data;
  }

  // デバイスに保存されているデータ量によって2〜10分近くかかる。
  public async getAllDataWait() {
    let allData: any = [];
    for (let blockNo = 1; blockNo <= 9; blockNo++) {
      const res = await this.commandGBWait(blockNo);
      if (res) {
        for (let i = 1; i <= 7; i++) {
          const pageNo = (blockNo - 1) * 7 + i;
          if (pageNo > 60) {
            break;
          }

          const unixTime =
            res[i * 4] * 16777216 +
            res[i * 4 + 1] * 65536 +
            res[i * 4 + 2] * 256 +
            res[i * 4 + 3];
          const timestamp = new Date(
            unixTime * 1000 + 1000 * 60 * 60 * this._timeZoneOffset
          );
          const data = await this.getOnePageDataWait(pageNo);
          if (data.length > 0) {
            allData = allData.concat(data);
          }
        }
      }
    }
    return allData;
  }

  public async getDataAfterDateWait(date: Date) {
    let allData: any = [];
    for (let blockNo = 1; blockNo <= 9; blockNo++) {
      const res = await this.commandGBWait(blockNo);
      if (res) {
        for (let i = 1; i <= 7; i++) {
          const pageNo = (blockNo - 1) * 7 + i;
          if (pageNo > 60) {
            break;
          }
          const unixTime =
            res[i * 4] * 16777216 +
            res[i * 4 + 1] * 65536 +
            res[i * 4 + 2] * 256 +
            res[i * 4 + 3];
          const timestamp = new Date(
            unixTime * 1000 + 1000 * 60 * 60 * this._timeZoneOffset
          );

          // 指定された日時以降のデータ
          if (timestamp.getTime() > date.getTime()) {
            const data = await this.getOnePageDataWait(pageNo);
            allData = allData.concat(data);
          }
        }
      }
    }
    return allData;
  }

  // カスタム時刻設定
  public async commandVTWait(date: Date) {
    const cmd = 'VT';
    const buf = new ArrayBuffer(6);
    const dv = new DataView(buf);
    dv.setUint8(0, cmd.charCodeAt(0));
    dv.setUint8(1, cmd.charCodeAt(1));
    dv.setUint32(2, Number(date.getTime() / 1000), false);
    const time = [
      dv.getUint8(0),
      dv.getUint8(1),
      dv.getUint8(2),
      dv.getUint8(3),
      dv.getUint8(4),
      dv.getUint8(5),
    ];
    await this.writeCommandWait(time);
  }

  // 製品情報取得
  public async commandGAWait() {
    const seqNo = this.randomNum(0, 255);
    const cmd = 'GA';
    const buf = [cmd.charCodeAt(0), cmd.charCodeAt(1), seqNo];
    await this.writeCommandWait(buf);
    const res = await this.readCommandWait();
    if (buf[1] !== res![1] || seqNo !== res![2]) {
      console.log(`GA[${buf}]: Inconsistency between sent and received data.`);
    }
    const prodInfo = {
      deviceName: String.fromCharCode.apply(null, res!.slice(3, 11)),
      firmwareVersion: String.fromCharCode.apply(null, res!.slice(11, 15)),
      bleVersion: String.fromCharCode.apply(null, res!.slice(15, 19)),
      serialNumber: String.fromCharCode.apply(null, res!.slice(19, 27)),
    };
    return prodInfo;
  }

  // 測定データ情報取得
  public async commandGBWait(blockNo: number) {
    const seqNo = this.randomNum(0, 255);
    const cmd = 'GB';
    const buf = [cmd.charCodeAt(0), cmd.charCodeAt(1), seqNo, blockNo];
    await this.writeCommandWait(buf);
    const res = await this.readCommandWait();
    if (res![1] !== 0x4c || seqNo !== res![2]) {
      // 0x4c=76
      console.log(`GB[${buf}]: Inconsistency between sent and received data.`);
    }
    return res;
  }

  // 測定データ取得
  public async commandGCWait(pageNo: number) {
    const seqNo = this.randomNum(0, 255);
    const cmd = 'GC';
    const buf = [cmd.charCodeAt(0), cmd.charCodeAt(1), seqNo, pageNo];
    await this.writeCommandWait(buf);
    const res = await this.readCommandWait();
    // GCを送信すると、GGが返ってくる。
    if (res![0] !== 0x47 || res![1] !== 0x47) {
      console.log(`GC[${buf}]: Inconsistency between sent and received data.`);
    }
  }

  // 動作条件取得
  public async commandGDWait() {
    const seqNo = this.randomNum(0, 255);
    const cmd = 'GD';
    const buf = [cmd.charCodeAt(0), cmd.charCodeAt(1), seqNo];
    await this.writeCommandWait(buf);
    const res = await this.readCommandWait();
    if (buf[1] !== res![1] || seqNo !== res![2]) {
      console.log(`GD[${buf}]: Inconsistency between sent and received data.`);
    }

    const sweat_gain = parseInt(
      String.fromCharCode.apply(null, res!.slice(3, 6)),
      10
    );
    const fan_volt = parseInt(
      String.fromCharCode.apply(null, res!.slice(6, 9)),
      10
    );
    const sysmReq = {
      // 補正係数値
      sweatGain: sweat_gain / 100,
      // FAN電圧値
      fanVoltage: fan_volt / 100,
      // 積和上限値
      integralMax: String.fromCharCode.apply(null, res!.slice(9, 12)),
      // 微分時間値
      differentialTime: String.fromCharCode.apply(null, res!.slice(12, 15)),
      // 移動平均回数
      averagingTime: String.fromCharCode.apply(null, res!.slice(15, 18)),
      // 通知状態
      mode: String.fromCharCode(res![18]),
      // 測定状態
      mesurmentMode: String.fromCharCode(res![19]),
      // // 開始タイムスタンプ
      // "startTimestamp":,
    };
    return sysmReq;
  }

  // コード情報取得
  public async commandGFWait() {
    const seqNo = this.randomNum(0, 255);
    const cmd = 'GF';
    const buf = [cmd.charCodeAt(0), cmd.charCodeAt(1), seqNo];
    await this.writeCommandWait(buf);
    const res = await this.readCommandWait();
    if (buf[1] !== res![1] || seqNo !== res![2]) {
      console.log(`GF[${buf}]: Inconsistency between sent and received data.`);
    }
    const codeInfo = {
      companyCode: String.fromCharCode.apply(null, res!.slice(3, 6)),
      userCode: String.fromCharCode.apply(null, res!.slice(6, 10)),
    };
    return codeInfo;
  }

  // コード情報取得
  public async commandGGWait() {
    const seqNo = this.randomNum(0, 255);
    const cmd = 'GG';
    const buf = [cmd.charCodeAt(0), cmd.charCodeAt(1), seqNo];
    await this.writeNotifyWait(buf);
  }

  // notifyをバイナリモードに設定
  public async commandEFWait() {
    const cmd = 'EF';
    const buf = [cmd.charCodeAt(0), cmd.charCodeAt(1), 0x31];
    await this.writeNotifyWait(buf);
  }

  private randomNum(min: number, max: number) {
    // make rundom No
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
  }

  private async wait(ms: number) {
    return new Promise<void>((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve();
        }, ms);
      } catch (e) {
        reject(e);
      }
    });
  }
}
