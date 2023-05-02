/**
 * @packageDocumentation
 * @module Parts.TM2101_SR
 */
/* eslint rulesdir/non-ascii: 0 */

import roundTo from 'round-to';
import {
  checkEquals,
  fixByRange,
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  ObnizPartsBleConnectable,
  uint,
  uintToArray,
} from '../../../obniz/ObnizPartsBleAbstract';

export interface TM2101_SROptions {}

const te = new TextEncoder();

const RESULT_OK_DATA = te.encode('OK\n');
const RESULT_NG_DATA = te.encode('NG\n');
const RESULT_EN_DATA = te.encode('EN');

const TM2101_SR_Command = ['HIBERNATE', 'GETDATA', 'SETTING'] as const;

const RESET_REASON = [
  'UNKNOWN',
  'Power ON',
  'Software',
  'Watchdog Timer',
] as const;

/**
 * The minimum value of the battery voltage (only 1.35 indicates under 1.4V)
 *
 * 電池電圧の最小値 (1.35のみ1.4V未満を示す)
 */
const BATTERY_VOLTAGE = [1.5, 1.45, 1.4, 1.35] as const;

/**
 * Method of determining the measurement interval
 *
 * 測定間隔の決定方法
 */
const INTERVAL_DETERMINING_METHOD = [
  'First',
  'Second',
  '1m (Fixed)',
  '1m (Diff)',
] as const;

/** TM2101-SR advertising data TM2101-SRのアドバタイジングデータ */
export interface TM2101_SR_Adv_Data {
  /** serial no. シリアル番号 */
  serial: string;
  /** measurement interval 測定間隔 [min] */
  interval: number;
  /** measured body temperature 測定済み体温 [℃] */
  temperature: number;
  /** elapsed time from startup 起動からの経過時間 [sec] */
  elapsed_time: number;
  /** due to last reset 最後のリセット起因 */
  reset_reason: typeof RESET_REASON[number];
  /** battery voltage (only 1.35 indicates under 1.4) 電池電圧 (1.35のみ1.4V未満を示す) */
  battery: typeof BATTERY_VOLTAGE[number];
  /** data space availability データ領域の空き状況 */
  full: boolean;
  /** method of determining the measurement interval 測定間隔の決定方法 */
  interval_determining_method: typeof INTERVAL_DETERMINING_METHOD[number];
}

/** TM2101-SR measurement data TM2101-SRの測定データ */
export interface TM2101_SR_Data {
  /** measured body temperature at unix time (sec) UNIX時間(秒)における測定済み体温 [℃] */
  data: Record<number, number>;
  /** elapsed time from startup to final measurement 起動から最終測定までの経過時間 [sec] */
  elapsed_time: number;
}

/** TM2101-SR config TM2101-SRの設定内容 */
export interface TM2101_SR_Config {
  /**
   * First measurement interval [min] (1~60) (Initial value: 1)
   *
   * 第1の測定間隔[分] (1~60) (初期値: 1)
   */
  first_interval: number;
  /**
   * Transition time to the second measurement interval [hour] (0~24) (Initial value: 24)
   *
   * 第2の測定間隔への移行時間[時間] (0~24) (初期値: 24)
   */
  transition_time_to_second: number;
  /**
   * Second measurement interval [min] (1~60) (Initial value: 5)
   *
   * 第2の測定間隔[分] (1~60) (初期値: 5)
   */
  second_interval: number;
  /**
   * Body temperature changing to 1 minute interval [℃] (25.000~41.000) (Initial value: 37.5)
   *
   * 1分間隔へ移行する体温(Ts)[℃] (25.000~41.000) (初期値: 37.5)
   */
  temperature: number | null;
  /**
   * Body temperature difference moving to 1 minute interval [℃] (0.125~2.000) (Initial value: 0.5)
   *
   * 1分間隔へ移行する体温の差分(Td)[℃] (0.125~2.000) (初期値: 0.5)
   */
  temperature_difference: number | null;
}

/** TM2101_SR management class TM2101_SRを管理するクラス */
export default class TM2101_SR extends ObnizPartsBleConnectable<
  TM2101_SR_Adv_Data,
  TM2101_SR_Data
> {
  public static readonly AvailableBleMode = 'Connectable';

  public static readonly PartsName = 'TM2101_SR';

  public static readonly LocalName = /TM2101-SR/;

  public static readonly BeaconDataLength = 0x19;

  public static readonly CompanyID = [0x19, 0x0a];

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<TM2101_SR_Adv_Data> | null> = {
    serial: {
      // 後ろの6バイトがHal-Share IDと一致
      index: 0,
      length: 16,
      type: 'custom',
      func: (data) =>
        data
          .reverse()
          .map((v) => ('0' + v.toString(16)).slice(-2))
          .join(''),
    },
    interval: {
      index: 16,
      type: 'unsignedNumLE',
    },
    temperature: {
      index: 17,
      type: 'unsignedNumLE',
      base: 25,
      multiple: 0.0625,
      round: 1,
    },
    elapsed_time: {
      index: 18,
      length: 3,
      type: 'unsignedNumLE',
    },
    reset_reason: {
      index: 21,
      type: 'custom',
      func: (data) => RESET_REASON[(data[0] & 0b11000000) >> 6],
    },
    battery: {
      index: 21,
      type: 'custom',
      func: (data) => BATTERY_VOLTAGE[(data[0] & 0b00110000) >> 4],
    },
    full: {
      index: 21,
      type: 'bool1000',
    },
    interval_determining_method: {
      index: 21,
      type: 'custom',
      func: (data) => INTERVAL_DETERMINING_METHOD[data[0] & 0b00000011],
    },
  };

  protected staticClass = TM2101_SR;

  /** Currently running command 現在実行中のコマンド */
  protected processingCommand: typeof TM2101_SR_Command[number] | null = null;

  /** Event handler for command execution result コマンド実行結果のイベントハンドラー */
  public onResultReceived: ((result: boolean) => void) | null = null;

  /** Event handler for frame data フレームデータのイベントハンドラー */
  public onFrameDataReceived: ((data: Uint8Array) => boolean) | null = null;

  protected readonly commandDataServiceUuid =
    '61830845-385d-41E8-9EE5-A30B150B49E9';

  protected readonly sendCommandCharacteristicUuid =
    '804CDB50-BAC9-448B-8AE2-41E9750EF93A';

  protected readonly receiveDataCharacteristicUuid =
    '169BB1BB-AE80-4650-BF4B-AFB79F38422A';

  /**
   * Connect to the services of a device
   *
   * デバイスのサービスに接続
   */
  public async connectWait(): Promise<void> {
    await super.connectWait();

    this.processingCommand = null;
    this.onResultReceived = null;

    // Always receive data
    await this.subscribeWait(
      this.commandDataServiceUuid,
      this.receiveDataCharacteristicUuid,
      (baseData: number[]): void => {
        // TODO: delete
        const data = new Uint8Array(baseData);

        switch (this.processingCommand) {
          case 'GETDATA':
            if (!this.onFrameDataReceived) break;
            // If data continues, it will be called again and not reset.
            // この後もデータが続くとき、再度呼び出されるためリセットをしない
            if (!this.onFrameDataReceived(data)) return;
            break;
          case 'HIBERNATE':
          case 'SETTING':
          default:
            this.analyzeBooleanData(data);
            break;
        }

        this.processingCommand = null;
        this.onResultReceived = null;
        this.onFrameDataReceived = null;
      }
    );
  }

  /**
   * Analyze received data when the command being executed is not "GETDATA" and executes the event if correct data.
   *
   * 実行中のコマンドが「GETDATA」以外の時の受信したデータを解析し、正しいデータならばイベントを実行
   *
   * @param data Received data
   * @returns Command execution result
   */
  protected analyzeBooleanData(data: Uint8Array): boolean {
    if (data.length !== RESULT_OK_DATA.length) {
      throw new Error(`Unknown data (${data}).`);
    }

    // data === RESULT_OK_DATA
    if (checkEquals(RESULT_OK_DATA, data)) {
      if (
        !this.processingCommand ||
        !TM2101_SR_Command.includes(this.processingCommand)
      ) {
        throw new Error(
          `Success with unknown command (${this.processingCommand}).`
        );
      }
      if (this.onResultReceived) this.onResultReceived(true);
      return true;
    }

    // data === RESULT_NG_DATA
    if (checkEquals(RESULT_NG_DATA, data)) {
      if (
        !this.processingCommand ||
        !TM2101_SR_Command.includes(this.processingCommand)
      ) {
        console.warn('An invalid command has been detected.');
      }
      if (this.onResultReceived) this.onResultReceived(false);
      return false;
    }

    throw new Error(`Unknown data (${data})`);
  }

  protected async beforeOnDisconnectWait(): Promise<void> {
    await this.unsubscribeWait(
      this.commandDataServiceUuid,
      this.receiveDataCharacteristicUuid
    );
  }

  /**
   * Retrieve currently all recorded temperature measurement data
   *
   * Warning: All recorded data will be deleted if an error occurs during the process.
   *
   * 現在記録されている体温測定データを全て取得
   *
   * 警告: 途中でエラーが発生しても記録されているデータは全て削除されます。
   *
   * @returns Instance of TM2101_SR_Data TM2101_SR_Dataのインスタンス
   */
  public async getDataWait(): Promise<TM2101_SR_Data> {
    this.checkConnected();

    // Prevent parallel execution of commands
    // コマンドの並列実行を防止
    if (this.processingCommand) {
      throw new Error(
        `The command cannot be executed because "${this.processingCommand}" is currently being executed.`
      );
    }
    this.processingCommand = 'GETDATA';

    // [elapsed time since last temperature measurement (sec), body temperature (°C)]
    // [前回の体温測定からの経過時間(秒), 体温(℃)]
    const results: [number, number][] = [];

    const promise = new Promise<TM2101_SR_Data>((resolve) => {
      this.onFrameDataReceived = (data) => {
        if (data.length % 2 === 1) {
          // Final frame 最終フレーム
          if (data.length === 9 && checkEquals(RESULT_EN_DATA, data)) {
            const diff = uint(data.slice(2, 5));
            const elapsed_time = uint(data.slice(5, 8));
            // First, store the UNIX time of the last measurement of body temperature
            // 初めに体温の最終計測時のUNIX時間を格納
            let time = roundTo(Date.now() / 1000 - diff, 0);
            const result: TM2101_SR_Data = {
              data: {},
              elapsed_time,
            };
            for (let i = results.length - 1; i >= 0; i--) {
              const [prevDiff, temp] = results[i];
              // Save body temperature in UNIX time UNIX時間で体温を保存
              result.data[time] = temp;
              // Subtract relative time at each measurement 測定時の相対時間を毎回減算
              time -= prevDiff;
            }
            resolve(result);
            // Since the final frame came 最終フレームが来たため
            return true;
          }
          throw new Error(`Unknown Data (${data})`);
        }
        const newData: typeof results = new Array(data.length / 2)
          .fill(0)
          .map((_val, i) => {
            i *= 2;
            return [data[i] * 60, roundTo(25 + data[i + 1] * 0.0625, 1)];
          });
        results.push(...newData);
        // Since the data will continue after this この後もデータが続くため
        return false;
      };
    });

    await this.writeCharWait(
      this.commandDataServiceUuid,
      this.sendCommandCharacteristicUuid,
      Array.from(te.encode(`${this.processingCommand}\n`))
    );

    return await promise;
  }

  /**
   * Switch to the hibernation mode (BLE connection will be disconnected)
   *
   * Warning: All recorded data will be deleted.
   *
   * 出荷モードに移行する(BLE接続が切断されます)
   *
   * 警告: 記録されているデータは全て削除されます。
   *
   * @returns Write result 書き込み結果
   */
  public async hibernateWait(): Promise<boolean> {
    this.checkConnected();

    // Prevent parallel execution of commands
    // コマンドの並列実行を防止
    if (this.processingCommand) {
      throw new Error(
        `The command cannot be executed because "${this.processingCommand}" is currently being executed.`
      );
    }
    this.processingCommand = 'HIBERNATE';

    // NOTE: Since the result is not returned, do not register the event handler of the command execution result.
    // NOTE: 結果は返さないため、コマンド実行結果のイベントハンドラは登録しない
    return await this.writeCharWait(
      this.commandDataServiceUuid,
      this.sendCommandCharacteristicUuid,
      Array.from(te.encode(`${this.processingCommand}\n`))
    );
  }

  /**
   * Write device settings, blanks write initial values
   *
   * Warning: If successful, all recorded data will be deleted.
   *
   * デバイス設定の書き込み、空欄は初期値を書き込み
   *
   * 警告: 成功した場合、記録されているデータはすべて削除されます。
   *
   * @param config Instance of TM2101_SR_Config TM2101_SR_Configのインスタンス
   * @returns Write result 書き込み結果
   */
  public async setConfigWait(
    config: Partial<TM2101_SR_Config>
  ): Promise<boolean> {
    this.checkConnected();

    // Prevent parallel execution of commands
    if (this.processingCommand) {
      throw new Error(
        `The command cannot be executed because "${this.processingCommand}" is currently being executed.`
      );
    }
    this.processingCommand = 'SETTING';

    const promise = new Promise<boolean>((resolve) => {
      this.onResultReceived = (result) => resolve(result);
    });

    await this.writeCharWait(
      this.commandDataServiceUuid,
      this.sendCommandCharacteristicUuid,
      [
        ...te.encode(this.processingCommand),
        config.first_interval ?? 1,
        config.transition_time_to_second ?? 24,
        config.second_interval ?? 1,
        ...(config.temperature === null
          ? [0xff, 0xff]
          : uintToArray(
              fixByRange('temperature', config.temperature ?? 37.5, 25, 41) *
                1000
            )),
        ...(config.temperature_difference === null
          ? [0xff, 0xff]
          : uintToArray(
              fixByRange(
                'temperature_difference',
                config.temperature_difference ?? 0.5,
                0.125,
                2.0
              ) * 1000
            )),
        ...te.encode('\n'),
      ],
      true
    );

    return await promise;
  }
}
