import {
  ObnizBleBeaconStruct,
  ObnizBleBeaconStructNormal,
  ObnizPartsBleCompare,
  ObnizPartsBleMode,
  ObnizPartsBlePairable,
  checkEquals,
  uint,
  uintToArray,
} from '../../../obniz/ObnizPartsBleAbstract';
import { CharUuids, ServiceUuids } from '../../../obniz/ObnizPartsBleUuids';
import { BleConnectSetting } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';

export interface MC_6810T2Options {}

export interface MC_6810T2_Adv_User_Data {
  sequence_number: number;
  saved_data_count: number;
}

export interface MC_6810T2_Adv_Data {
  user_count: number;
  time_not_set: boolean;
  service_uuid_mode: 'WLP' | 'WLP+STP';
  user1: MC_6810T2_Adv_User_Data;
  user2: MC_6810T2_Adv_User_Data;
  user3: MC_6810T2_Adv_User_Data;
  user4: MC_6810T2_Adv_User_Data;
}

export interface MC_6810T2_Data {
  temperature: number | null;
  date: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
}

const NanRawArray = new Uint8Array([0x00, 0x7f, 0xff, 0xff]);

const getBeaconDataUserStruct = (
  userNumber: number
): ObnizBleBeaconStructNormal<MC_6810T2_Adv_Data, 'user1'> => ({
  index: -1 + userNumber * 3,
  length: 3,
  type: 'custom',
  func: (data) => ({
    sequence_number: uint(data.slice(0, 2)),
    saved_data_count: data[2],
  }),
});

/** MC_6810T2 management class MC_6810T2を管理するクラス */
export default class MC_6810T2 extends ObnizPartsBlePairable<
  MC_6810T2_Adv_Data,
  MC_6810T2_Data
> {
  protected staticClass = MC_6810T2;

  public static readonly AvailableBleMode: ObnizPartsBleMode[] = [
    'Pairing',
    'Connectable',
  ];

  public static readonly PartsName = 'MC_6810T2';

  // category: '0013', modelType: '0003'
  // from ScanResponse
  public static readonly LocalName = /^BLE[Ss]mart_00130003[0-9A-F]{12}$/;

  public static readonly ServiceUuids = ServiceUuids.health_thermometer;

  public static readonly CompanyID = [0x0e, 0x02];

  // Type 3
  public static readonly CommonBeaconDataStruct: ObnizBleBeaconStruct<MC_6810T2_Adv_Data> = {
    data_type: {
      index: 0,
      type: 'check',
      data: 0x01, // Each User Data
    },
    user_count: {
      index: 1,
      type: 'custom',
      func: (data) => (data[0] & 0b0011) + 1,
    },
    time_not_set: {
      index: 1,
      type: 'bool0100',
    },
    service_uuid_mode: {
      index: 1,
      type: 'custom',
      func: (data) => (data[0] & 0b00100000 ? 'WLP' : 'WLP+STP'),
    },
    user1: getBeaconDataUserStruct(1),
    user2: getBeaconDataUserStruct(2),
    user3: getBeaconDataUserStruct(3),
    user4: getBeaconDataUserStruct(4),
  };

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<MC_6810T2_Adv_Data>
  > = {
    Connectable: {
      ...this.CommonBeaconDataStruct,
      pairing_mode: {
        index: 1,
        type: 'check',
        func: (data) => Boolean((data[0] & 0b1000) === 0),
      },
    },
    Pairing: {
      ...this.CommonBeaconDataStruct,
      pairing_mode: {
        index: 1,
        type: 'check',
        func: (data) => Boolean((data[0] & 0b1000) > 0),
      },
    },
  };

  /**
   * Error when received temperature data is invalid
   *
   * 受信した体温データが無効のときのエラー
   */
  public static readonly NoDataError = new Error('There is NO data.');

  /**
   * Time zone when setting time (must be set before connection)
   *
   * 時刻設定時のタイムゾーン(接続前に設定が必要)
   */
  public timezoneOffset = 9;

  /**
   * ID of setTimeout() when setting timeout
   *
   * タイムアウト設定時のsetTimeout()のID
   */
  protected processingTimeoutId: NodeJS.Timeout | null = null;

  public async connectWait(keys?: string, setting?: BleConnectSetting) {
    await super.connectWait(keys, setting);

    // 60秒でタイムアウトするよう設定
    this.processingTimeoutId = setTimeout(() => {
      if (this.peripheral.connected) {
        return;
      }
      console.warn('Force disconnect after 60 seconds since connected.');

      try {
        this.disconnectWait();
      } catch (e) {
        console.warn(e);
      }
    }, 1000 * 60);
    // 切断時にタイムアウト設定を削除
    this.registerDisconnected(() => {
      if (this.processingTimeoutId === null) return;

      clearTimeout(this.processingTimeoutId);
      this.processingTimeoutId = null;
    });
  }

  public async disconnectWait(): Promise<void> {
    if (!this.peripheral.connected) {
      return;
    }
    await this.unsubscribeWait(
      ServiceUuids.current_time,
      CharUuids.current_time
    );
    await this.unsubscribeWait(
      ServiceUuids.health_thermometer,
      CharUuids.temperature_measurement
    );
    await super.disconnectWait();
  }

  /**
   * 切断してしまうとペアリングモードが終わらないため、向こうからの切断を待つ
   */
  protected requestDisconnectAfterPairing = false;

  /**
   * Bluetoothマークを長押しし、Pと表示されたらペアリング可能モードに
   */
  protected async afterPairingWait(): Promise<void> {
    // 現在時刻を書き込み
    await this.writeCurrentTimeWait();

    // 切断してもらうため、体温データを読み込み
    await this.getChar(
      ServiceUuids.health_thermometer,
      CharUuids.temperature_measurement
    ).registerNotifyWait(() => {
      // do nothing
    });
  }

  /**
   * Get body temperature data, throws `NoDataError` if unable to get, but always disconnects
   *
   * 体温データを取得、取得できなかった場合は`NoDataError`をスローしますが、必ず切断されます。
   *
   * @returns Instance of MC_6810T2_Data MC_6810T2_Dataのインスタンス
   */
  public async getDataWait(pairingKeys?: string): Promise<MC_6810T2_Data> {
    // TODO: only checkConnected();
    try {
      this.checkConnected();
    } catch (e) {
      if (!this.peripheral.connected) {
        if (!pairingKeys) {
          throw e;
        }
        await this.connectWait(pairingKeys);
      }
    }

    // 体温計の時刻を受信したかのフラグ
    let currentTimeReceived = false;

    // 現在時刻の通知を登録
    await this.getChar(
      ServiceUuids.current_time,
      CharUuids.current_time
    ).registerNotifyWait(async () => {
      // 一度時刻を受信したら、以降は実行しない
      if (currentTimeReceived) return;

      // フラグをtrueにすることで、何度も時刻を送信しないように
      currentTimeReceived = true;
      await this.writeCurrentTimeWait();
    });

    return new Promise<MC_6810T2_Data>((resolve, reject) => {
      let result: MC_6810T2_Data | null = null;

      // 体温測定の通知を登録
      this.getChar(
        ServiceUuids.health_thermometer,
        CharUuids.temperature_measurement
      ).registerNotifyWait((data) => {
        result = this.parseData(data);
      });
      // 切断時にresolve()を呼ぶように登録
      this.registerDisconnected(() => {
        // 体温データがあるときはそれを返す
        if (result) resolve(result);
        // 体温データがなかったときはNoDataErrorをスロー
        else reject(this.staticClass.NoDataError);
      });
      // ↓ "TM Mode" Activated
      // ↓ Receive notification from current_time
      // ↓ Send data to current_time
      // ↓ Receive notification from temperature_measurement
      // ↓ Wait disconnect from remote device
      // ↓ resolve(result)
    });
  }

  /**
   * 現在時刻を書き込み
   */
  private async writeCurrentTimeWait() {
    this.checkConnected();

    // UnixTimeにタイムゾーンの同じ現在時刻を
    const date = new Date(Date.now() + 1000 * 60 * this.timezoneOffset);

    const data = new Uint8Array([
      // 年 (0, 0は不明)
      ...uintToArray(date.getFullYear()),
      // 月 (0は不明)
      date.getUTCMonth() + 1,
      // 日 (0は不明)
      date.getUTCDate(),
      // 時
      date.getUTCHours(),
      // 分
      date.getUTCMinutes(),
      // 秒
      date.getUTCSeconds(),
      // 曜日 (0は不明) 論理和で日曜日を7に
      date.getUTCDay() || 7,
      // 1/256秒
      Math.trunc(date.getUTCMilliseconds() / (9999 / 256)),
      // 調整理由 (手動設定)
      0b0001,
    ]);

    // 送信
    await this.writeCharWait(
      ServiceUuids.current_time,
      CharUuids.current_time,
      data
    );
  }

  protected parseData(data: Uint8Array): MC_6810T2_Data {
    // Always constant value: data = [ 0b0110, ..., 0x01 ];
    // const measurementUnits = data[0] & 0b0001 ? 'fahrenheit' : 'celsius';
    // const timeStampPresent = Boolean(data[0] & 0b0010);
    // const typePresent = Boolean(data[0] & 0b0100);
    // const measurementSite = { 0x01: '脇の下', 0x06: '口腔内' }[data[12]]

    const tempRawArray = data.slice(1, 5);
    const mantissa = uint(tempRawArray);
    let ul = mantissa & 0x00ffffff;
    if ((ul & 0x00800000) > 0) {
      ul = -1 * (~(ul - 0x01) & 0x00ffffff);
    }
    const exponential = mantissa >> 24;

    return {
      temperature: checkEquals(tempRawArray, NanRawArray)
        ? null
        : ul * Math.pow(10, exponential),
      date: {
        year: uint(data.slice(5, 7)),
        month: data[7],
        day: data[8],
        hour: data[9],
        minute: data[10],
        second: data[11],
      },
    };
  }

  /**
   * @deprecated Please use MC_6810T2.getDeviceMode(this.peripheral) === 'Pairing'
   *
   * @returns Pairing mode or not ペアリングモードか否か
   */
  public isPairingMode() {
    return this.staticClass.getDeviceMode(this.peripheral) === 'Pairing';
  }
}
