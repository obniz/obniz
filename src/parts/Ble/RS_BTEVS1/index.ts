/**
 * @packageDocumentation
 * @module Parts.RS_BTEVS1
 */
/* eslint rulesdir/non-ascii: 0 */

import Obniz, {
  BleRemoteCharacteristic,
  BleRemotePeripheral,
} from '../../../obniz';
import ObnizPartsInterface, {
  ObnizPartsInfo,
} from '../../../obniz/ObnizPartsInterface';

export interface RS_BTEVS1Options {}

/** RS-BTEVS1 advertising data RS-BTEVS1のアドバタイジングデータ */
export interface RS_BTEVS1_AdvData {
  /** CO2 [ppm] */
  co2: number;
  /** PM1.0 [ug/m3] */
  pm1_0: number;
  /** PM2.5 [ug/m3] */
  pm2_5: number;
  /** PM5.0 [ug/m3] */
  pm5_0: number;
  /** PM10.0 [ug/m3] */
  pm10_0: number;
  /** temperature 温度 [℃] */
  temp: number;
  /** humidity 湿度 [%] */
  humid: number;
}

const LED_DISPLAY_MODE = ['Disable', 'PM2.5', 'CO2'] as const;

const PM2_5_CONCENTRATION_MODE = ['Mass', 'Number'] as const;

/** RS-BTEVS1 config RS-BTEVS1の設定内容 */
export interface RS_BTEVS1_Config {
  /**
   * Temperature notification interval [ms] (10,000~3,600,000) (Initial value: 10,000ms)
   *
   * 温度通知間隔[ms] (10,000~3,600,000) (初期値: 10,000ms)
   */
  tempInterval: number;
  /**
   * PM2.5 notification interval [ms] (10,000~3,600,000) (Initial value: 10,000ms)
   *
   * PM2.5通知間隔[ms] (10,000~3,600,000) (初期値: 10,000ms)
   */
  pm2_5Interval: number;
  /**
   * CO2 notification interval [ms] (10,000~3,600,000) (Initial value: 10,000ms)
   *
   * CO2通知間隔[ms] (10,000~3,600,000) (初期値: 10,000ms)
   */
  co2Interval: number;
  /**
   * Temperature sensor measurement operation setting (initial value: Disable)
   *
   * 温度センサー計測動作設定 (初期値: 無効)
   */
  tempMeasureOperation: boolean;
  /**
   * PM2.5 sensor measurement operation setting (initial value: Disable)
   *
   * PM2.5センサー計測動作設定 (初期値: 無効)
   */
  pm2_5MeasureOperation: boolean;
  /**
   * CO2 sensor measurement operation setting (initial value: Disable)
   *
   * CO2センサー計測動作設定 (初期値: 無効)
   */
  co2MeasureOperation: boolean;
  /**
   * Display setting for 10 LEDs (Disable | PM2.5 | CO2) (initial value: Disable)
   *
   * 10連LEDへの表示設定 (Disable | PM2.5 | CO2) (初期値: 無効)
   */
  ledDisplay: typeof LED_DISPLAY_MODE[number];
  /**
   * Advertisement Beacon Settings (Initial Value: Disable)
   *
   * アドバタイズビーコン設定 (初期値: 無効)
   */
  advertisementBeacon: boolean;
  /** PM2.5 mass concentration / number concentration mode setting (Mass | Number) (initial value: Number)
   *
   * PM2.5質量濃度/個数濃度モード設定 (Mass | Number) (初期値: 個数濃度)
   */
  pm2_5ConcentrationMode: typeof PM2_5_CONCENTRATION_MODE[number];
}

/** RS-BTEVS1 PM2.5 data RS-BTEVS1のPM2.5のデータ */
export interface RS_BTEVS1_Pm2_5 {
  /** PM1.0 [ug/m3] */
  mass_pm1: number;
  /** PM2.5 [ug/m3] */
  mass_pm2_5: number;
  /** PM5.0 [ug/m3] */
  mass_pm5: number;
  /** PM10.0 [ug/m3] */
  mass_pm10: number;
  /** PM0.5 [#/m3] */
  number_pm0_5: number;
  /** PM1.0 [#/m3] */
  number_pm1?: number;
  /** PM2.5 [#/m3] */
  number_pm2_5?: number;
  /** PM5.0 [#/m3] */
  number_pm5?: number;
  /** PM10.0 [#/m3] */
  number_pm10?: number;
}

export default class RS_BTEVS1 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'RS_BTEVS1',
    };
  }

  /**
   * Determine if it is RS-BTEVS1
   *
   * RS-BTEVS1かどうか判定
   *
   * @param peripheral Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   * @returns Whether it is RS-BTEVS1 RS-BTEVS1かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return (
      peripheral.localName !== null &&
      peripheral.localName.indexOf('BTEVS') === 0
    );
  }

  /**
   * Get advertising data
   *
   * アドバタイジングデータを取得
   *
   * @param peripheral Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   * @returns RS-BTEVS1 advertising data RS-BTEVS1のアドバタイジングデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): RS_BTEVS1_AdvData | null {
    if (!RS_BTEVS1.isDevice(peripheral)) {
      return null;
    }
    const buf = Buffer.from(peripheral.adv_data);
    const data: RS_BTEVS1_AdvData = {
      co2: buf.readUInt16LE(11),
      pm1_0: buf.readUInt8(13),
      pm2_5: buf.readUInt8(14),
      pm5_0: buf.readUInt8(15),
      pm10_0: buf.readUInt8(16),
      temp: buf.readUInt8(17),
      humid: buf.readUInt8(18),
    };
    return data;
  }

  /** RS-BTEVS1 sample advertising data RS-BTEVS1のサンプルのアドバタイジングデータ */
  private static deviceAdv: number[] = [
    /* LEN TYPE VALUE */
    0x03,
    0x19,
    0x40,
    0x05,
    0x02,
    0x01,
    0x05,
    0x0b,
    0xff,
    0x00,
    0xff,
    -1,
    -1, // CO2
    -1,
    -1,
    -1,
    -1, // PM2.5
    -1,
    -1, // Temp
    0x0b,
    0x08,
    0x42,
    0x54,
    0x45,
    0x56,
    0x53,
    0x2d,
    -1,
    -1,
    -1,
    -1, // localName
  ];

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;

  /** Event handler for button ボタンのイベントハンドラー */
  public onButtonPressed: ((pressed: boolean) => void) | null = null;
  /** Event handler for temperature sensor 温度センサーのイベントハンドラー */
  public onTempMeasured:
    | ((temp: number, humidity: number) => void)
    | null = null;
  /** Event handler for co2 sensor CO2センサーのイベントハンドラー */
  public onCo2Measured: ((co2: number) => void) | null = null;
  /** Event handler for PM2.5 sensor PM2.5センサーのイベントハンドラー */
  public onPm2_5Measured: ((pm2_5: RS_BTEVS1_Pm2_5) => void) | null = null;

  /** Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス */
  public _peripheral: BleRemotePeripheral | null = null;
  /** Event handler for disconnect 切断のイベントハンドラー */
  public ondisconnect?: (reason: any) => void;

  private _uuids = {
    service: 'F9CC15234E0A49E58CF30007E819EA1E',
    buttonChar: 'F9CC15244E0A49E58CF30007E819EA1E',
    configChar: 'F9CC15254E0A49E58CF30007E819EA1E',
    tempChar: 'F9CC15264E0A49E58CF30007E819EA1E',
    co2Char: 'F9CC15274E0A49E58CF30007E819EA1E',
    pm2_5Char: 'F9CC15284E0A49E58CF30007E819EA1E',
  };
  private _buttonCharacteristic: BleRemoteCharacteristic | null = null;
  private _configCharacteristic: BleRemoteCharacteristic | null = null;
  private _tempCharacteristic: BleRemoteCharacteristic | null = null;
  private _co2Characteristic: BleRemoteCharacteristic | null = null;
  private _pm2_5Characteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !RS_BTEVS1.isDevice(peripheral)) {
      throw new Error('peripheral is not RS_BTEVS1');
    }
    this._peripheral = peripheral;
  }

  public wired(obniz: Obniz): void {
    // do nothing.
  }

  /**
   * Connect to device デバイスに接続
   */
  public async connectWait() {
    if (!this._peripheral) {
      throw new Error('RS_BTEVS1 is not find.');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };
    await this._peripheral.connectWait();
    this._buttonCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.buttonChar);
    this._configCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.configChar);
    this._tempCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.tempChar);
    this._co2Characteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.co2Char);
    this._pm2_5Characteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.pm2_5Char);

    if (this._buttonCharacteristic) {
      await this._buttonCharacteristic.registerNotifyWait((data: number[]) => {
        if (typeof this.onButtonPressed === 'function') {
          this.onButtonPressed(data[0] === 1);
        }
      });
    }
  }

  /**
   * Disconnect from device デバイスから切断
   */
  public async disconnectWait() {
    if (this._buttonCharacteristic)
      await this._buttonCharacteristic?.unregisterNotifyWait();
    await this._peripheral!.disconnectWait();
  }

  /**
   * Get device settings デバイスの設定を取得
   *
   * @returns Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
   */
  public async getConfigWait(): Promise<RS_BTEVS1_Config> {
    if (!this._configCharacteristic) {
      throw new Error('device is not connected');
    }
    const data = await this._configCharacteristic.readWait();
    const buf = Buffer.from(data);
    const measureOperation = buf.readUInt8(3);
    return {
      pm2_5ConcentrationMode: PM2_5_CONCENTRATION_MODE[buf.readUInt8(0)],
      advertisementBeacon: buf.readUInt8(1) === 1,
      ledDisplay: LED_DISPLAY_MODE[buf.readUInt8(2)],
      co2MeasureOperation: (measureOperation & 0b001) > 0,
      pm2_5MeasureOperation: (measureOperation & 0b010) > 0,
      tempMeasureOperation: (measureOperation & 0b100) > 0,
      co2Interval: buf.readUInt32LE(4),
      pm2_5Interval: buf.readUInt32LE(8),
      tempInterval: buf.readUInt32LE(12),
    };
  }

  /**
   * Write device settings, blanks write initial values
   *
   * デバイス設定の書き込み、空欄は初期値を書き込み
   *
   * @param config Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
   * @returns Write result 書き込み結果
   */
  public async setConfigWait(
    config: Partial<RS_BTEVS1_Config>
  ): Promise<boolean> {
    if (!this._configCharacteristic) {
      throw new Error('device is not connected');
    }
    const buf = Buffer.alloc(16);
    buf.writeUInt8(
      PM2_5_CONCENTRATION_MODE.indexOf(
        config.pm2_5ConcentrationMode &&
          PM2_5_CONCENTRATION_MODE.indexOf(config.pm2_5ConcentrationMode) >= 0
          ? config.pm2_5ConcentrationMode
          : 'Number'
      ),
      0
    );
    buf.writeUInt8(config.advertisementBeacon ? 1 : 0, 1);
    buf.writeUInt8(
      LED_DISPLAY_MODE.indexOf(
        config.ledDisplay && LED_DISPLAY_MODE.indexOf(config.ledDisplay) >= 0
          ? config.ledDisplay
          : 'Disable'
      ),
      2
    );
    buf.writeUInt8(
      0 +
        (config.co2MeasureOperation ? 0b001 : 0) +
        (config.pm2_5MeasureOperation ? 0b010 : 0) +
        (config.tempMeasureOperation ? 0b100 : 0),
      3
    );
    buf.writeUInt32LE(config.co2Interval ?? 10000, 4);
    buf.writeUInt32LE(config.pm2_5Interval ?? 10000, 8);
    buf.writeUInt32LE(config.tempInterval ?? 10000, 12);
    return await this._configCharacteristic.writeWait(buf);
  }

  /**
   * Start reading the temperature sensor
   *
   * 温度センサーの読み取りを開始
   */
  public async tempMeasureStartWait() {
    // await this._measureStartWait(this._tempCharacteristic);
    if (!this._tempCharacteristic) {
      throw new Error('device is not connected');
    }
    await this._tempCharacteristic.registerNotifyWait((data: number[]) => {
      if (typeof this.onTempMeasured !== 'function') return;
      const buf = Buffer.from(data);
      this.onTempMeasured(buf.readInt8(0), buf.readUInt8(1));
    });
  }

  /**
   * Start reading the co2 sensor
   *
   * CO2センサーの読み取りを開始
   */
  public async co2MeasureStartWait() {
    // await this._measureStartWait(this._co2Characteristic);
    if (!this._co2Characteristic) {
      throw new Error('device is not connected');
    }
    await this._co2Characteristic.registerNotifyWait((data: number[]) => {
      if (typeof this.onCo2Measured !== 'function') return;
      const buf = Buffer.from(data);
      this.onCo2Measured(buf.readUInt16LE(0));
    });
  }

  /**
   * Start reading the PM2.5 sensor
   *
   * PM2.5センサーの読み取りを開始
   */
  public async pm2_5MeasureStartWait() {
    // await this._measureStartWait(this._pm2_5Characteristic);
    if (!this._pm2_5Characteristic) {
      throw new Error('device is not connected');
    }
    await this._pm2_5Characteristic.registerNotifyWait((data: number[]) => {
      if (typeof this.onPm2_5Measured !== 'function') return;
      const buf = Buffer.from(data);
      this.onPm2_5Measured({
        mass_pm1: buf.readFloatLE(0),
        mass_pm2_5: buf.readFloatLE(4),
        mass_pm5: buf.readFloatLE(8),
        mass_pm10: buf.readFloatLE(12),
        number_pm0_5: buf.readFloatLE(16), // 1パケット=20バイトしか来ない
        // number_pm1: buf.readFloatLE(20),
        // number_pm2_5: buf.readFloatLE(24),
        // number_pm5: buf.readFloatLE(28),
        // number_pm10: buf.readFloatLE(32),
      });
    });
  }

  /**
   * Send 1 to Descriptor of Characteristic argument
   *
   * 引数のCharacteristicのDescriptorに1を送信
   *
   * @param char Instance of BleRemoteCharacteristic BleRemoteCharacteristicのインスタンス
   */
  private async _measureStartWait(char: BleRemoteCharacteristic | null) {
    if (!char) {
      throw new Error('device is not connected');
    }
    const descriptor = char.getDescriptor('2902');
    if (!descriptor) {
      throw new Error('device is not connected');
    }
    await descriptor.writeWait([1]);
  }
}
