/**
 * @packageDocumentation
 * @module Parts.RS_BTEVS1
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz';
import {
  int,
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  ObnizPartsBleConnectable,
  ObnizPartsBleMode,
  uint,
} from '../../../obniz/ObnizPartsBleAbstract';
import semver from 'semver';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';

export interface RS_BTEVS1Options {}

/** RS-BTEVS1 advertising data RS-BTEVS1のアドバタイジングデータ */
export interface RS_BTEVS1_Data {
  /** CO2 [ppm] */
  co2: number;
  /** PM1.0 [ug/m3] */
  pm1_0: number;
  /** PM2.5 [ug/m3] */
  pm2_5: number;
  /** PM4.0 [ug/m3] */
  pm4_0: number;
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
  /**
   * @deprecated Rev. ~1.0.2
   * PM2.5 mass concentration / number concentration mode setting (Mass | Number) (initial value: Number)
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
  /** PM4.0 [ug/m3] */
  mass_pm4: number;
  /** PM10.0 [ug/m3] */
  mass_pm10: number;
  /** PM0.5 [#/m3] */
  number_pm0_5?: number;
  /** PM1.0 [#/m3] */
  number_pm1?: number;
  /** PM2.5 [#/m3] */
  number_pm2_5?: number;
  /** PM4.0 [#/m3] */
  number_pm4?: number;
  /** PM10.0 [#/m3] */
  number_pm10?: number;
}

/** RS_BTEVS1 management class RS_BTEVS1を管理するクラス */
export default class RS_BTEVS1 extends ObnizPartsBleConnectable<
  RS_BTEVS1_Data,
  RS_BTEVS1_Data
> {
  public static readonly AvailableBleMode:
    | ObnizPartsBleMode
    | ObnizPartsBleMode[] = ['Connectable', 'Beacon'];

  public static readonly PartsName = 'RS_BTEVS1';

  /**
   * BTEVS-1234: ~1.0.2
   * EVS-1234: 1.1.2~
   * EVS_1234 1.2~
   */
  public static readonly LocalName = /^(BT)?EVS[-_][0-9A-F]{4}/;

  // public static readonly BeaconDataLength: ObnizPartsBleCompare<
  //   number | null
  // > = 0x0c;

  public static readonly CompanyID: ObnizPartsBleCompare<number[] | null> = [
    0x00,
    0xff,
  ];

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<RS_BTEVS1_Data> | null> = {
    co2: {
      index: 0,
      length: 2,
      type: 'unsignedNumLE',
    },
    pm1_0: {
      index: 2,
      type: 'unsignedNumLE',
    },
    pm2_5: {
      index: 3,
      type: 'unsignedNumLE',
    },
    pm4_0: {
      index: 4,
      type: 'unsignedNumLE',
    },
    pm5_0: {
      // for compatibility
      index: 4,
      type: 'unsignedNumLE',
    },
    pm10_0: {
      index: 5,
      type: 'unsignedNumLE',
    },
    temp: {
      index: 6,
      length: 2,
      type: 'custom', // 'numLE',
      multiple: 0.1,
      round: 1,
      func: (data, p) =>
        (p.manufacturerSpecificData?.length ?? 0) + 1 === 0x0b &&
        (p.localName ?? '').startsWith('BT')
          ? data[0]
          : int(data) * 0.1,
    },
    humid: {
      index: 7, // 8
      length: 2, // 1
      type: 'custom', // 'unsignedNumLE',
      func: (data, p) =>
        (p.manufacturerSpecificData?.length ?? 0) + 1 === 0x0b &&
        (p.localName ?? '').startsWith('BT')
          ? data[0]
          : data[1],
    },
  };

  protected staticClass = RS_BTEVS1;
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

  protected readonly serviceUuid = 'F9CC15234E0A49E58CF30007E819EA1E';
  public firmwareRevision = '';

  private firmwareSemRevision: semver.SemVer | null = null;

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (!peripheral.localName?.match(this.LocalName)) {
      return false;
    }
    return true;
  }

  /**
   * Connect to the services of a device
   *
   * デバイスのサービスに接続
   */
  public async connectWait(): Promise<void> {
    await super.connectWait();

    this.firmwareRevision = Buffer.from(
      await this.readCharWait('180A', '2A26')
    ).toString();

    this.firmwareSemRevision = semver.parse(
      this.firmwareRevision.replace('Ver.', '')
    );
  }

  private static _deviceAdvAnalyzer = new BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x03, 0x19, 0x40, 0x05, 0x02, 0x01, 0x05])
    .groupStart('manufacture')
    .addTarget('length', [0x0c])
    .addTarget('type', [0xff])
    .addTargetByLength('companyId', 2)
    .addTargetByLength('data', 9)
    .groupEnd();

  public static getData(
    peripheral: BleRemotePeripheral
  ): RS_BTEVS1_Data | null {
    if (!RS_BTEVS1.isDevice(peripheral)) {
      return null;
    }

    const measureData = RS_BTEVS1._deviceAdvAnalyzer.getData(
      peripheral.adv_data,
      'manufacture',
      'data'
    );

    if (!measureData) return null;

    if (peripheral.localName?.startsWith('BT')) {
      return {
        co2: Buffer.from(measureData).readUInt16LE(0),
        pm1_0: Buffer.from(measureData).readUInt8(2),
        pm2_5: Buffer.from(measureData).readUInt8(3),
        pm4_0: Buffer.from(measureData).readUInt8(4),
        pm10_0: Buffer.from(measureData).readUInt8(5),
        temp: Buffer.from(measureData).readUInt8(6),
        humid: Buffer.from(measureData).readUInt8(7),
      };
    }

    return {
      co2: Buffer.from(measureData).readUInt16LE(0),
      pm1_0: Buffer.from(measureData).readUInt8(2),
      pm2_5: Buffer.from(measureData).readUInt8(3),
      pm4_0: Buffer.from(measureData).readUInt8(4),
      pm10_0: Buffer.from(measureData).readUInt8(5),
      temp: Buffer.from(measureData).readInt16LE(6) / 10,
      humid: Buffer.from(measureData).readUInt8(8),
    };
  }

  /**
   * Get device all data
   * Version 1.0.x is not supported
   * デバイスの全てのデータの取得
   * バージョン1.0.xはサポートされません
   *
   * @returns
   */
  public async getDataWait(): Promise<RS_BTEVS1_Data> {
    this.checkConnected();
    this.checkVersion('1.1.0');

    return new Promise((res, rej) => {
      this.subscribeWait(this.serviceUuid, this.getCharUuid(0x152a), (data) => {
        const buf = Buffer.from(data);
        const result = {
          temp: uint(data.slice(0, 2)) * 0.1,
          humid: data[2],
          co2: uint(data.slice(3, 5)),
          pm1_0: buf.readFloatLE(5),
          pm2_5: buf.readFloatLE(9),
          pm4_0: buf.readFloatLE(13),
          pm10_0: buf.readFloatLE(17),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore for compatibility
          pm5_0: buf.readFloatLE(13),
        };
        res(result);
      });
    });
  }

  protected async beforeOnDisconnectWait(): Promise<void> {
    if (!this.firmwareSemRevision) {
      return;
    }
    if (semver.gte(this.firmwareSemRevision!, '1.1.2')) {
      await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1524));
      // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1525));
      await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1526));
      await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1527));
      await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1528));
      // await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x1529));
      await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x152a));
      await this.unsubscribeWait(this.serviceUuid, this.getCharUuid(0x152b));
    }
  }

  /**
   * Get device settings デバイスの設定を取得
   *
   * @returns Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
   */
  public async getConfigWait(): Promise<RS_BTEVS1_Config> {
    this.checkConnected();

    const data = await this.readCharWait(
      this.serviceUuid,
      this.getCharUuid(0x1525)
    );
    const buf = Buffer.from(data);
    const measureOperation = buf.readInt8(12);

    return {
      tempInterval: buf.readUInt32LE(0),
      pm2_5Interval: buf.readUInt32LE(4),
      co2Interval: buf.readUInt32LE(8),
      tempMeasureOperation: (measureOperation & 0b100) > 0,
      pm2_5MeasureOperation: (measureOperation & 0b010) > 0,
      co2MeasureOperation: (measureOperation & 0b001) > 0,
      ledDisplay: LED_DISPLAY_MODE[buf.readInt8(13)],
      advertisementBeacon: buf.readInt8(14) === 1,
      pm2_5ConcentrationMode: PM2_5_CONCENTRATION_MODE[buf.readInt8(15)],
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
    await this.checkConnected();

    const buf = Buffer.alloc(16);
    buf.writeUInt32LE(config.tempInterval ?? 10000, 0);
    buf.writeUInt32LE(config.pm2_5Interval ?? 10000, 4);
    buf.writeUInt32LE(config.co2Interval ?? 10000, 8);
    buf.writeUInt8(
      (config.co2MeasureOperation ? 0b001 : 0) +
        (config.pm2_5MeasureOperation ? 0b010 : 0) +
        (config.tempMeasureOperation ? 0b100 : 0),
      12
    );
    buf.writeUInt8(
      LED_DISPLAY_MODE.indexOf(
        config.ledDisplay && LED_DISPLAY_MODE.indexOf(config.ledDisplay) >= 0
          ? config.ledDisplay
          : 'Disable'
      ),
      13
    );

    buf.writeUInt8(config.advertisementBeacon ? 1 : 0, 14);
    buf.writeUInt8(
      semver.lt(this.firmwareSemRevision!, '1.1.0')
        ? PM2_5_CONCENTRATION_MODE.indexOf(
            config.pm2_5ConcentrationMode &&
              PM2_5_CONCENTRATION_MODE.indexOf(config.pm2_5ConcentrationMode) >=
                0
              ? config.pm2_5ConcentrationMode
              : 'Number'
          )
        : 0,

      15
    );

    return await this.writeCharWait(
      this.serviceUuid,
      this.getCharUuid(0x1525),
      Array.from(buf)
    );
  }

  /**
   * Change pairing LED flashing status
   * Version 1.0.x is not supported
   * ペアリングLEDの点滅状態の変更
   * バージョン1.0.xはサポートされません
   *
   * @param blink Whether it blinks 点滅するかどうか
   * @returns Write result 書き込み結果
   */
  public async setModeLEDWait(blink: boolean): Promise<boolean> {
    await this.checkConnected();
    this.checkVersion('1.1.0');

    return await this.writeCharWait(
      this.serviceUuid,
      this.getCharUuid(0x1529),
      [blink ? 1 : 0]
    );
  }

  /**
   * Start reading the button state
   *
   * ボタンの状態読み取りを開始
   */
  public async buttonChangeStartWait(): Promise<void> {
    this.checkConnected();

    await this.subscribeWait(
      this.serviceUuid,
      this.getCharUuid(0x1524),
      (data) => {
        if (typeof this.onButtonPressed !== 'function') return;
        this.onButtonPressed(data[0] === 1);
      }
    );
  }

  /**
   * @deprecated
   *
   * Start reading the temperature sensor
   * Version 1.0.x is not supported
   * 温度センサーの読み取りを開始
   * バージョン1.0.xはサポートされません
   */
  public async tempMeasureStartWait(): Promise<void> {
    this.checkConnected();
    this.checkVersion('1.1.0');

    await this.subscribeWait(
      this.serviceUuid,
      this.getCharUuid(0x1526),
      (data) => {
        if (typeof this.onTempMeasured !== 'function') return;
        this.onTempMeasured(int(data.slice(0, 2)) / 10, data[2]);
      }
    );
  }

  /**
   * @deprecated
   *
   * Start reading the co2 sensor
   *
   * CO2センサーの読み取りを開始
   */
  public async co2MeasureStartWait(): Promise<void> {
    this.checkConnected();

    await this.subscribeWait(
      this.serviceUuid,
      this.getCharUuid(0x1527),
      (data) => {
        if (typeof this.onCo2Measured !== 'function') return;
        this.onCo2Measured(uint(data));
      }
    );
  }

  /**
   * @deprecated
   *
   * Start reading the PM2.5 sensor
   * Version 1.1 is not supported
   * PM2.5センサーの読み取りを開始
   * バージョン1.1より上のバージョンはサポートされません
   */
  public async pm2_5MeasureStartWait(): Promise<void> {
    this.checkConnected();
    this.checkLessVersion('1.1.0');

    await this.subscribeWait(
      this.serviceUuid,
      this.getCharUuid(0x1528),
      (data) => {
        if (typeof this.onPm2_5Measured !== 'function') return;
        const buf = Buffer.from(data);
        this.onPm2_5Measured({
          mass_pm1: buf.readFloatLE(0),
          mass_pm2_5: buf.readFloatLE(4),
          mass_pm4: buf.readFloatLE(8),
          mass_pm10: buf.readFloatLE(12),
          // number_pm0_5: buf.readFloatLE(16), // 1パケット=20バイトしか来ない // TODO
          // number_pm1: buf.readFloatLE(20),
          // number_pm2_5: buf.readFloatLE(24),
          // number_pm4: buf.readFloatLE(28),
          // number_pm10: buf.readFloatLE(32),
        });
      }
    );
  }

  protected getCharUuid(code: number): string {
    return `${this.serviceUuid.slice(0, 4)}${code.toString(
      16
    )}${this.serviceUuid.slice(8)}`;
  }

  private checkVersion(version: string) {
    if (semver.lt(this.firmwareSemRevision!, version)) {
      throw new Error(
        `This operation is not supported. required firmware v${version}, but device v${this.firmwareSemRevision?.version}`
      );
    }
  }

  private checkLessVersion(version: string) {
    if (semver.gte(this.firmwareSemRevision!, version)) {
      throw new Error(
        `This operation is not supported. required firmware less than v${version}, but device v${this.firmwareSemRevision?.version}`
      );
    }
  }
}
