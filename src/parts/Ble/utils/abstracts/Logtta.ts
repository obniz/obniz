/**
 * @packageDocumentation
 * @module Parts.Logtta
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleCompare,
  ObnizPartsBleConnectable,
  ObnizPartsBleMode,
} from '../../../../obniz/ObnizPartsBleAbstract';
import { BleBatteryService } from '../services/batteryService';
import { BleGenericAccess } from '../services/genericAccess';
import { UUID16 } from '../../../../obniz/libs/embeds/bleHci/bleTypes';

type PinCodeType = 'Authentication' | 'Rewrite';

const PinCodeFlag: { [type in PinCodeType]: number } = {
  Authentication: 0x00,
  Rewrite: 0x01,
};

/** abstract class common to the Logtta series Logttaシリーズ共通の抽象クラス */
export default abstract class Logtta<S, T> extends ObnizPartsBleConnectable<
  S,
  T
> {
  public static readonly AvailableBleMode:
    | ObnizPartsBleMode
    | ObnizPartsBleMode[] = ['Connectable', 'Beacon'];

  public static readonly LocalName = {
    Connectable: undefined,
    Beacon: /null/,
  };

  public static readonly BeaconDataLength: ObnizPartsBleCompare<
    number | null
  > = {
    Connectable: null,
    Beacon: 0x1b,
  };

  public static readonly CompanyID: ObnizPartsBleCompare<number[] | null> = {
    Connectable: null,
    Beacon: [0x10, 0x05],
  };

  protected serviceUuid: any = '';
  protected authenticated = false;
  public onNotify?: (data: T) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;

  constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode) {
    super(peripheral, mode);
  }

  /**
   * Connect to the services of a device
   *
   * デバイスのサービスに接続
   *
   * @param keys Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
   */
  public async connectWait(keys?: string): Promise<void> {
    this.serviceUuid = (this.staticClass.getServiceUuids('Connectable') ?? [
      '',
    ])[0];
    await super.connectWait(keys);

    const service1800 = this.peripheral.getService('1800' as UUID16);
    if (service1800) {
      this.genericAccess = new BleGenericAccess(service1800);
    }
    const service180F = this.peripheral.getService('180F' as UUID16);
    if (service180F) {
      this.batteryService = new BleBatteryService(service180F);
    }
  }

  protected async beforeOnDisconnectWait(): Promise<void> {
    this.authenticated = false;
    this.genericAccess = undefined;
    this.batteryService = undefined;
  }

  /**
   * Get data with connected state
   *
   * 接続状態でデータを取得
   *
   * @returns received value from each sensor それぞれのセンサから取得した値
   */
  public async getDataWait(): Promise<T> {
    this.checkConnected();

    const data = await this.readCharWait(
      this.serviceUuid,
      this.getCharUuid(0x21)
    );
    return this.parseData(data);
  }

  /**
   * Notify when the data have got from the device with connected state
   *
   * 接続状態でデータを取得したとき通知
   *
   * @param callback callback function コールバック関数
   *
   * @returns
   */
  public async startNotifyWait(callback: (data: T) => void): Promise<void> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
    } catch (e) {
      console.error(e);
      return;
    }

    // TODO: delete if
    if (callback) this.onNotify = callback;
    return await this.subscribeWait(
      this.serviceUuid,
      this.getCharUuid(0x21),
      (data: number[]) => {
        if (this.onNotify) {
          this.onNotify(this.parseData(data));
        }
      }
    );
  }

  /**
   * Authorize PIN code
   *
   * ピンコードを認証
   *
   * @param code PIN code ピンコード
   *
   * @returns Whether authentication was/is passed 認証が通った/通っているかどうか
   */
  public async authPinCodeWait(code: string | number): Promise<boolean> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
    } catch (e) {
      console.error(e);
      return false;
    }
    if (this.authenticated) return true;

    if (typeof code === 'string') code = parseInt(code); // TODO: delete string type
    this.authenticated = await this.sendPinCodeWait('Authentication', code);
    return this.authenticated;
  }

  protected async sendPinCodeWait(
    type: PinCodeType,
    code: number
  ): Promise<boolean> {
    if (code < 0 || code > 9999)
      throw new Error(
        `Authorization code can only be entered from 0000~9999. input: ${code}`
      );

    return await this.writeCharWait(this.serviceUuid, this.getCharUuid(0x30), [
      PinCodeFlag[type],
      Math.floor(code / 1000) % 10 | Math.floor(code / 100) % 10,
      Math.floor(code / 10) % 10 | Math.floor(code / 1) % 10,
    ]);
  }

  protected checkAuthenticated(): void {
    if (!this.authenticated)
      throw new Error(
        'Certification is required, execute authPinCodeWait() in advance.'
      );
  }

  /**
   * Set / unset to Beacon Mode
   *
   * ビーコンモードに設定/解除
   *
   * @param enable enable / disable 有効 / 無効
   *
   * @returns data write result
   */
  public async setBeaconModeWait(enable: boolean): Promise<boolean> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
      this.checkAuthenticated();
    } catch (e) {
      console.error(e);
      return false;
    }

    return this.writeCharWait(this.serviceUuid, this.getCharUuid(0x2d), [
      enable ? 1 : 0,
    ]);
  }

  protected getName(): string {
    const array = this.peripheral.adv_data.slice(16);
    return array
      .slice(0, array.indexOf(0) + 1)
      .map((d) => String.fromCharCode(d))
      .join('');
  }

  protected getCharUuid(code: number): any {
    return `${this.serviceUuid.slice(0, 6)}${code.toString(
      16
    )}${this.serviceUuid.slice(8)}`;
  }

  protected abstract parseData(data: number[]): T;
}
