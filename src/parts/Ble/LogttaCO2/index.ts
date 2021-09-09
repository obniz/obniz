/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';

export interface Logtta_CO2Options {}

/**
 * advertisement data from Logtta_CO2
 *
 * Logtta_CO2からのadvertisementデータ
 */
export interface Logtta_CO2_Adv_Data {
  /**
   * CO2 concentration CO2濃度
   *
   * Range 範囲: 0~65535 (Unit 単位: 1 ppm)
   *
   * (supported value カタログ値: 0~2000)
   */
  co2: number;
  /**
   * remaining battery 電池残量
   *
   * Range 範囲: 0~100 (Unit 単位: 1 %)
   *
   * 254: USB power supply USB給電
   */
  battery: number;
  /**
   * measurement interval 測定周期
   *
   * Range 範囲: 1~2100 (Unit 単位: 1 s)
   */
  interval: number;
  /** BLE address BLEアドレス */
  address: string;
}

/** Logtta_CO2 management class Logtta_CO2を管理するクラス */
export default class Logtta_CO2 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Logtta_CO2',
    };
  }

  /**
   * Verify that the received peripheral is from the Logtta_CO2
   *
   * 受け取ったPeripheralがLogtta_CO2のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Logtta_CO2
   *
   * Logtta_CO2かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    return peripheral.localName === 'CO2 Sensor';
  }

  /**
   * Verify that the received advertisement is from the Logtta_CO2
   *
   * 受け取ったAdvertisementがLogtta_CO2のものかどうか確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Logtta_CO2
   *
   * Logtta_CO2かどうか
   */
  public static isAdvDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.adv_data.length !== 31) {
      return false;
    }
    const data = peripheral.adv_data;
    if (
      data[5] !== 0x10 ||
      data[6] !== 0x05 ||
      data[7] !== 0x02 ||
      data[16] !== 0x43 ||
      data[17] !== 0x4f ||
      data[18] !== 0x32
    ) {
      // CompanyID, Appearance, "C" "O" "2"
      return false;
    }
    return true;
  }

  /**
   * Get a data from the Logtta_CO2 advertisement
   *
   * Logtta_CO2のadvertisementからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Logtta_CO2 advertisement
   *
   * Logtta_CO2のadvertisementからのデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): Logtta_CO2_Adv_Data | null {
    if (!this.isAdvDevice(peripheral)) {
      return null;
    }
    const data = peripheral.adv_data;
    const alert: number = data[15];
    const interval: number = (data[13] << 8) | data[14];
    const advData: Logtta_CO2_Adv_Data = {
      battery: data[12],
      co2: (data[8] << 8) | data[9],
      interval,
      address: peripheral.address,
    };
    return advData;
  }

  private static getName(data: number[]) {
    let name = '';
    for (let i = 16; i < data.length; i++) {
      if (data[i] === 0) {
        break;
      }
      name += String.fromCharCode(data[i]);
    }
    return name;
  }

  private static get_uuid(uuid: string): string {
    return `31f3${uuid}-bd1c-46b1-91e4-f57abcf7d449`;
  }

  public onNotify?: (co2: number) => void;
  public _peripheral: BleRemotePeripheral | null;
  public ondisconnect?: (reason: any) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !Logtta_CO2.isDevice(peripheral)) {
      throw new Error('peripheral is not Logtta CO2');
    }
    this._peripheral = peripheral;
  }

  /**
   * Connect the sensor
   *
   * センサへ接続
   */
  public async connectWait() {
    if (!this._peripheral) {
      throw new Error('Logtta CO2 not found');
    }
    if (!this._peripheral.connected) {
      this._peripheral.ondisconnect = (reason: any) => {
        if (typeof this.ondisconnect === 'function') {
          this.ondisconnect(reason);
        }
      };
      await this._peripheral.connectWait();

      const service1800 = this._peripheral.getService('1800');
      if (service1800) {
        this.genericAccess = new BleGenericAccess(service1800);
      }
      const service180F = this._peripheral.getService('180F');
      if (service180F) {
        this.batteryService = new BleBatteryService(service180F);
      }
    }
  }

  /**
   * Disconnect from the sensor
   *
   * センサとの接続を切断
   */
  public async disconnectWait() {
    if (this._peripheral && this._peripheral.connected) {
      await this._peripheral.disconnectWait();
    }
  }

  /**
   * Get CO2 concentration data with connected state
   *
   * 接続している状態でCO2濃度データを取得
   *
   * @returns CO2 concentration data from the Logtta_CO2
   *
   * Logtta_CO2から受け取ったCO2濃度データ
   */
  public async getWait(): Promise<number | null> {
    if (!(this._peripheral && this._peripheral.connected)) {
      return null;
    }

    const c = this._peripheral
      .getService(Logtta_CO2.get_uuid('AB20'))!
      .getCharacteristic(Logtta_CO2.get_uuid('AB21'));
    const data: number[] = await c!.readWait();
    return data[0] * 256 + data[1];
  }

  /**
   * Notify when the CO2 concentration data have got from the Logtta_CO2 with connected state
   *
   * 接続している状態でLogtta_CO2からCO2濃度データを取得したとき通知
   *
   * @returns
   */
  public async startNotifyWait() {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    const c = this._peripheral
      .getService(Logtta_CO2.get_uuid('AB20'))!
      .getCharacteristic(Logtta_CO2.get_uuid('AB21'));

    await c!.registerNotifyWait((data: number[]) => {
      if (this.onNotify) {
        this.onNotify(data[0] * 256 + data[1]);
      }
    });
  }

  /**
   * Authenticate with the sensor using pin code
   *
   * ピンコードによってセンサと認証
   *
   * @param code pin code (default: "0000")
   *
   * ピンコード (デフォルト: "0000")
   *
   * @returns
   */
  public async authPinCodeWait(code: string) {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    if (code.length !== 4) {
      throw new Error('Invalid length auth code');
    }

    const data: [number] = [0];
    for (let i = 0; i < code.length; i += 2) {
      data.push(
        (this.checkNumber(code.charAt(i)) << 4) |
          this.checkNumber(code.charAt(i + 1))
      );
    }
    const c = this._peripheral
      .getService(Logtta_CO2.get_uuid('AB20'))!
      .getCharacteristic(Logtta_CO2.get_uuid('AB30'));
    await c!.writeWait(data);
  }

  /**
   * @deprecated Please use {@linkplain setBeaconModeWait}
   *
   * {@linkplain setBeaconModeWait} の使用を推奨
   *
   * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
   *
   */
  public setBeaconMode(enable: boolean) {
    return this.setBeaconModeWait(enable);
  }

  /**
   * Set enable / disable for beacon mode (periodic beacon transmission)
   *
   * Call this function after authenticating with the sensor
   *
   * After setting, disconnect once to enable it
   *
   * To stop beacon mode, you need to hold the button on the sensor for more than 2 seconds
   *
   * (For more detail, please see http://www.uni-elec.co.jp/logtta_page.html )
   *
   * ビーコンモード(定期的なビーコン発信)の有効/無効の設定
   *
   * センサとの認証を済ませた状態で実行してください
   *
   * 設定後に切断した後から有効になります
   *
   * ビーコンモードの終了は、デバイスのボタンを2秒以上長押しする操作が必要です(詳しくは http://www.uni-elec.co.jp/logtta_page.html )
   *
   * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
   *
   * @returns
   */
  public async setBeaconModeWait(enable: boolean) {
    if (!(this._peripheral && this._peripheral.connected)) {
      return;
    }

    const c = this._peripheral
      .getService(Logtta_CO2.get_uuid('AB20'))!
      .getCharacteristic(Logtta_CO2.get_uuid('AB2D'));
    if (enable) {
      await c!.writeWait([1]);
    } else {
      await c!.writeWait([0]);
    }
  }

  private checkNumber(data: string) {
    if (data >= '0' && data <= '9') {
      return parseInt(data, 10);
    } else {
      throw new Error(
        `authorization code can only be entered from 0-9.input word : ${data}`
      );
    }
  }
}
