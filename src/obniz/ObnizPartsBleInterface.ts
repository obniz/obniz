/* eslint-disable max-classes-per-file */
/* eslint-disable rulesdir/non-ascii */
/**
 * @packageDocumentation
 * @module ObnizCore
 */

import { BleRemoteCharacteristic, IBeacon, ObnizPartsInfo } from '.';
import BleRemotePeripheral from './libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleUnknownCharacteristicError,
  ObnizBleUnknownServiceError,
} from './ObnizError';
import { PartsList } from './ObnizPartsList';

export interface ObnizPartsBleInfo {
  name: string;
  datasheet?: any;
}

export interface Triaxial {
  x: number;
  y: number;
  z: number;
}

export default abstract class ObnizPartsBleInterface {
  /**
   * Information of parts.
   * name: key name of parts
   */
  public static info: () => ObnizPartsBleInfo;

  /**
   * Check founded BleRemotePeripheral is kind of this parts or not
   */
  public static isDevice: (peripheral: BleRemotePeripheral) => boolean;

  /**
   * Utility function for reading 2 byte to signed number.
   */
  public static signed16FromBinary(high: number, low: number): number {
    let val: number = (high << 8) | low;
    if ((val & 0x8000) !== 0) {
      val = val - 0x10000;
    }
    return val;
  }

  /**
   * Utility function for reading 4 byte to signed number.
   */
  public static signed32FromBinary(
    byte3: number,
    byte2: number,
    byte1: number,
    byte0: number
  ): number {
    let val: number =
      (byte3 << (8 * 3)) | (byte2 << (8 * 2)) | (byte1 << (8 * 1)) | byte0;
    if ((val & 0x80000000) !== 0) {
      val = val - 0x100000000;
    }
    return val;
  }

  /**
   * Utility function for reading 1byte fixed point number
   */
  public static readFraction(byte: number) {
    let result = 0;
    let mask = 0b10000000;
    let num = 0.5;
    for (let i = 0; i < 8; i++) {
      if (byte & mask) {
        result += num;
      }
      num /= 2.0;
      mask >>= 1;
    }
    return result;
  }

  /**
   * Internally Used function for connection required devices
   */
  public _peripheral: BleRemotePeripheral | null = null;

  /**
   * ondisconnect callback function.
   */
  public ondisconnect?: (reason: any) => void;
}

export type PartsType = keyof PartsList;

const ObnizPartsBleModeList = ['Beacon', 'Connectable', 'Pairing'] as const;

export type ObnizPartsBleMode = typeof ObnizPartsBleModeList[number];

export type ObnizPartsBleCompare<S> = ObnizPartsBleCompareWithMode<S> | S;

export type ObnizPartsBleCompareWithMode<S> = {
  [key in ObnizPartsBleMode]?: S;
};

export const notMatchDeviceError = new Error('Is NOT target device.');

export const uint = (value: number[]): number => {
  let val = 0;
  value.forEach((v, i) => (val += v << (i * 8)));
  return val;
};

export const int = (value: number[]): number => {
  const num = uint(value);
  return (
    num -
    ((num & (0x8 << (value.length * 8 - 4))) !== 0
      ? value.length && value.length >= 28
        ? 0x10000000 * 2 ** (value.length - 28)
        : 0x1 << (value.length * 8)
      : 0)
  );
};

export const uintBE = (value: number[]): number => uint(value.reverse());

export const intBE = (value: number[]): number => int(value.reverse());

export const unsigned16FromBinary = (high: number, low: number): number => {
  return (high << 8) | low;
};

/**
 * Utility function for reading 2 byte to signed number.
 */
export const signed16FromBinary = (high: number, low: number): number => {
  let val = unsigned16FromBinary(high, low);
  if ((val & 0x8000) !== 0) {
    val -= 0x10000;
  }
  return val;
};

/**
 * Utility function for reading 4 byte to signed number.
 */
export const signed32FromBinary = (
  byte3: number,
  byte2: number,
  byte1: number,
  byte0: number
): number => {
  let val: number =
    (byte3 << (8 * 3)) | (byte2 << (8 * 2)) | (byte1 << (8 * 1)) | byte0;
  if ((val & 0x80000000) !== 0) {
    val -= 0x100000000;
  }
  return val;
};

export class ObnizPartsBle<S> {
  /**
   * Information of parts.
   * name: PartsName
   */
  public static info(): ObnizPartsInfo {
    return { name: this.PartsName };
  }

  /**
   * NEED IMPLEMENTATION
   */
  public static readonly PartsName: PartsType;

  /**
   * Available BLE modes (Beacon | Connectable | Pairing)
   *
   * 利用可能なBLEのモード (Beacon | Connectable | Pairing)
   */
  public static readonly AvailableBleMode:
    | ObnizPartsBleMode
    | ObnizPartsBleMode[];

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  protected static readonly Address?: ObnizPartsBleCompare<RegExp> = undefined;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  protected static readonly LocalName?: ObnizPartsBleCompare<RegExp> = undefined;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  protected static readonly CompanyID?: ObnizPartsBleCompare<
    number[] | null
  > = undefined;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  protected static readonly CompanyID_ScanResponse?: ObnizPartsBleCompare<
    number[] | null
  > = undefined;

  /**
   * Used as a condition of isDevice() by default.
   * Compare with data after Company ID.
   *
   * 標準でisDevice()の条件として使用
   * CompanyID以降のデータと比較
   */
  protected static readonly BeaconDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown> | null>;

  /**
   * @deprecated
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) !== null;
  }

  /**
   * Get Peripheral Mode.
   *
   * ペリフェラルのモードを取得
   *
   * @param peripheral BleRemotePeripheral
   * @returns If the corresponding device is that mode, it must be null if not applicable 該当するデバイスならばそのモード、該当しなければnull
   */
  public static getDeviceMode(
    peripheral: BleRemotePeripheral
  ): ObnizPartsBleMode | null {
    const result = (this.AvailableBleMode instanceof Array
      ? this.AvailableBleMode
      : [this.AvailableBleMode]
    )
      .map((mode) =>
        this.isDeviceWithMode(peripheral, mode) ? mode : undefined
      )
      .find((mode) => mode);
    return result ?? null;
  }

  /**
   * Check if peripherals and modes match the library.
   *
   * ペリフェラルとモードがライブラリと合致するかチェック
   *
   * @param peripheral BleRemotePeripheral
   * @param mode Beacon | Connectable | Pairing
   * @returns Whether to match 合致するかどうか
   */
  public static isDeviceWithMode(
    peripheral: BleRemotePeripheral,
    mode: ObnizPartsBleMode
  ): boolean {
    if (
      typeof this.AvailableBleMode === 'string'
        ? this.AvailableBleMode !== mode
        : !this.AvailableBleMode.includes(mode)
    )
      return false;

    if (this.Address) {
      const defaultAddress =
        this.Address instanceof RegExp ? this.Address : this.Address[mode];
      if (
        defaultAddress === undefined ||
        !defaultAddress.test(peripheral.address)
      )
        return false;
    }
    if (this.LocalName) {
      const defaultLocalName =
        this.LocalName instanceof RegExp
          ? this.LocalName
          : this.LocalName[mode];
      if (
        defaultLocalName === undefined ||
        !defaultLocalName.test(peripheral.localName ?? 'null')
      )
        return false;
    }

    if (
      !this.checkManufacturerSpecificData(
        mode,
        peripheral.manufacturerSpecificData,
        this.CompanyID,
        false
      )
    )
      return false;

    if (
      !this.checkManufacturerSpecificData(
        mode,
        peripheral.manufacturerSpecificDataInScanResponse,
        this.CompanyID_ScanResponse,
        true
      )
    )
      return false;

    return true;
  }

  private static checkManufacturerSpecificData(
    mode: ObnizPartsBleMode,
    beaconData: number[] | null,
    companyID: ObnizPartsBleCompare<number[] | null> | undefined,
    inScanResponse: boolean
  ): boolean {
    if (companyID !== undefined) {
      const defaultCompanyID =
        companyID instanceof Array || companyID === null
          ? companyID
          : companyID[mode];
      if (
        !(defaultCompanyID === null && beaconData === null) &&
        (defaultCompanyID === undefined ||
          defaultCompanyID === null ||
          beaconData === null ||
          defaultCompanyID[0] !== beaconData[0] ||
          defaultCompanyID[1] !== beaconData[1])
      )
        return false;
    }

    if (this.BeaconDataStruct !== undefined) {
      const defaultBeaconDataStruct = (this.BeaconDataStruct !== null &&
      (this.BeaconDataStruct.Beacon ||
        this.BeaconDataStruct.Connectable ||
        this.BeaconDataStruct.Pairing)
        ? this.BeaconDataStruct[mode]
        : this.BeaconDataStruct) as ObnizBleBeaconStruct<unknown> | null;
      if (
        defaultBeaconDataStruct === undefined ||
        defaultBeaconDataStruct === null ||
        Object.values(defaultBeaconDataStruct).filter(
          (config) =>
            inScanResponse === (config.scanResponse ?? false) &&
            config.type === 'check' &&
            (beaconData ?? [])
              .slice(2 + config.index, 2 + config.index + (config.length ?? 1))
              .filter(
                (d, i) =>
                  d !==
                  (typeof config.data === 'number'
                    ? [config.data]
                    : config.data ?? [])[i]
              ).length !== 0
        ).length !== 0
      )
        return false;
    }
    return true;
  }

  /**
   * Form advertising data into an associative array.
   *
   * アドバタイジングデータを連想配列に成形
   *
   * @deprecated
   */
  public static getData(peripheral: BleRemotePeripheral): unknown | null {
    const mode = this.getDeviceMode(peripheral);
    if (!mode) return null;
    const lib = new this(peripheral, mode);
    try {
      return lib.getData();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * Utility function for reading 1byte fixed point number
   */
  public static readFraction(byte: number): number {
    let result = 0;
    let mask = 0b10000000;
    let num = 0.5;
    for (let i = 0; i < 8; i++) {
      if (byte & mask) {
        result += num;
      }
      num /= 2.0;
      mask >>= 1;
    }
    return result;
  }

  /**
   * Internally Used function for connection required devices
   */
  protected readonly peripheral: BleRemotePeripheral;

  public readonly address: string;

  public readonly beaconData: number[] | null;

  public readonly beaconDataInScanResponse: number[] | null;

  protected _mode: ObnizPartsBleMode;

  public get mode(): ObnizPartsBleMode {
    return this._mode;
  }

  /**
   * NEED IMPLEMENTATION
   */
  protected readonly static: typeof ObnizPartsBle = ObnizPartsBle;

  constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode) {
    this._mode = mode;
    this.peripheral = peripheral;
    this.address = peripheral.address;
    this.beaconData = this.peripheral.manufacturerSpecificData;
    if (this.beaconData) this.beaconData = this.beaconData.slice(2);
    this.beaconDataInScanResponse = this.peripheral.manufacturerSpecificDataInScanResponse;
    if (this.beaconDataInScanResponse)
      this.beaconDataInScanResponse = this.beaconDataInScanResponse.slice(2);
  }

  public checkMode(force = false): ObnizPartsBleMode {
    if (this.mode && !force) return this.mode;
    const mode = this.static.getDeviceMode(this.peripheral);
    if (!mode) throw notMatchDeviceError;
    return (this._mode = mode);
  }

  /**
   * アドバタイジングデータを連想配列に成形
   * 利用可能なモード: Beacon, Connectable(一部のみ)
   * Form advertising data into an associative array
   * Available modes: Beacon, Connectable(only part)
   */
  public getData(): S {
    this.checkMode();
    if (!this.static.BeaconDataStruct)
      throw new Error('Data analysis is not defined.');
    if (!this.beaconData)
      throw new Error('Manufacturer specific data is null.');

    const defaultBeaconDataStruct = (this.static.BeaconDataStruct.Beacon ||
    this.static.BeaconDataStruct.Connectable ||
    this.static.BeaconDataStruct.Pairing
      ? this.static.BeaconDataStruct[this.mode]
      : this.static.BeaconDataStruct) as ObnizBleBeaconStruct<S> | null;
    if (defaultBeaconDataStruct === null)
      throw new Error('Data analysis is not defined.');

    return (Object.fromEntries(
      Object.entries(defaultBeaconDataStruct)
        .map(([name, c]) => {
          if (c.type === 'check') return [];
          const config = c as ObnizBleBeaconStructNormal<unknown, never>;
          if (
            !(config.scanResponse
              ? this.beaconDataInScanResponse
              : this.beaconData)
          )
            throw new Error('manufacturerSpecificData is null.');
          const data = (
            (config.scanResponse
              ? this.beaconDataInScanResponse
              : this.beaconData) ?? []
          ).slice(config.index, config.index + (config.length ?? 1));
          if (config.type.indexOf('bool') === 0)
            return [name, (data[0] & parseInt(config.type.slice(4), 2)) > 0];
          else if (config.type === 'string')
            return [name, Buffer.from(data).toString()];
          else if (config.type === 'xyz') {
            if (!config.length) config.length = 6;
            if (config.length % 6 !== 0) return [];
            else if (config.length === 6) return [name, this.getTriaxial(data)];
            else
              return [
                name,
                [...Array(config.length / 6).keys()].map((v) =>
                  this.getTriaxial(data.slice(v * 6, (v + 1) * 6))
                ),
              ];
          } else if (config.type === 'custom')
            if (!config.func) return [];
            else return [name, config.func(data, this.peripheral)];
          else {
            const multi = config.multiple ?? 1;
            const num = (config.type.indexOf('u') === 0 ? uint : int)(
              config.type.indexOf('BE') >= 0 ? data.reverse() : data
            );
            return [name, num * multi];
          }
        })
        .filter((v) => v[0])
    ) as unknown) as S;
  }

  private getTriaxial(data: number[]): Triaxial {
    return {
      x: int(data.slice(0, 2)),
      y: int(data.slice(2, 4)),
      z: int(data.slice(4, 6)),
    };
  }
}

export abstract class ObnizPartsBleConnectable<S, T> extends ObnizPartsBle<S> {
  constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode) {
    super(peripheral, mode);

    this.peripheral.ondisconnect = async (reason: unknown) => {
      await this.beforeOnDisconnectWait(reason);
      if (this.ondisconnect) await this.ondisconnect(reason);
    };
  }

  /**
   * Connect to peripherals with validation.
   *
   * バリデーションのあるペリフェラルへの接続
   *
   * @param keys: Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
   */
  public async connectWait(keys?: string): Promise<void> {
    // TODO: Enable Validation
    // if (this.mode !== 'Connectable')
    //   throw new Error(
    //     `Connection can only be used in connectable mode, the current mode is ${this.mode}`
    //   );
    await this.peripheral.connectWait({
      pairingOption: {
        keys,
      },
    });
  }

  /**
   * Disconnect from peripheral.
   *
   * ペリフェラルから切断
   */
  public async disconnectWait(): Promise<void> {
    await this.peripheral.disconnectWait();
  }

  /**
   * Get data during connection.
   *
   * 接続中にデータを取得
   */
  public abstract getDataWait(): Promise<T>;

  /**
   * onDisconnect callback function.
   *
   * 切断された時に呼ばれるコールバック関数
   *
   * @param reason Reason for being disconnected 切断された理由
   */
  public ondisconnect?: (reason: unknown) => void | Promise<void>;

  /**
   * Initialization processing before calling this.ondisconnect().
   *
   * this.ondisconnect()を呼ぶ前の初期化処理
   *
   * @param reason Reason for being disconnected
   */
  protected abstract beforeOnDisconnectWait(reason: unknown): Promise<void>;

  /**
   * Check if connected.
   *
   * 接続しているかどうかチェック
   *
   * @param connected Connection status (default: true)
   */
  protected checkConnected(connected = true): void {
    if (this.peripheral.connected !== connected)
      throw new Error(
        connected
          ? 'Peripheral is NOT connected!!'
          : 'Peripheral IS connected!!'
      );
  }

  /**
   * Get any characteristic from any service.
   *
   * 任意のサービスから任意のキャラクタリスティックを取得
   *
   * @param serviceUuid Service UUID
   * @param characteristicUuid Characteristic UUID
   * @returns Instance of BleRemoteCharacteristic
   */
  protected getChar(
    serviceUuid: string,
    characteristicUuid: string
  ): BleRemoteCharacteristic {
    const service = this.peripheral.getService(serviceUuid);
    if (!service)
      throw new ObnizBleUnknownServiceError(
        this.peripheral.address,
        serviceUuid
      );
    const char = service.getCharacteristic(characteristicUuid);
    if (!char)
      throw new ObnizBleUnknownCharacteristicError(
        this.peripheral.address,
        serviceUuid,
        characteristicUuid
      );
    return char;
  }

  /**
   * Read data from any characteristic of any service.
   *
   * 任意のサービスの任意のキャラクタリスティックからデータを読み取り
   *
   * @param serviceUuid Service UUID
   * @param characteristicUuid Characteristic UUID
   * @returns Data read result データ読み取り結果
   */
  protected async readCharWait(
    serviceUuid: string,
    characteristicUuid: string
  ): Promise<number[]> {
    const char = this.getChar(serviceUuid, characteristicUuid);
    return await char.readWait();
  }

  /**
   * Write data to any characteristic of any service.
   *
   * 任意のサービスの任意のキャラクタリスティックへデータを書き込み
   *
   * @param serviceUuid Service UUID
   * @param characteristicUuid Characteristic UUID
   * @param data Write data
   * @returns Data write result
   */
  protected async writeCharWait(
    serviceUuid: string,
    characteristicUuid: string,
    data?: number[],
    needResponse?: boolean
  ): Promise<boolean> {
    const characteristic = this.getChar(serviceUuid, characteristicUuid);
    return await characteristic.writeWait(data, needResponse);
  }

  /**
   * Register notification to any characteristic of any service.
   *
   * 任意のサービスの任意のキャラクタリスティックへ通知を登録
   *
   * @param serviceUuid Service UUID
   * @param characteristicUuid Characteristic UUID
   * @param callback It is called when data comes
   */
  protected async subscribeWait(
    serviceUuid: string,
    characteristicUuid: string,
    callback?: (data: number[]) => void | Promise<void>
  ): Promise<void> {
    const characteristic = this.getChar(serviceUuid, characteristicUuid);
    await characteristic.registerNotifyWait(
      callback ??
        (() => {
          // do nothing.
        })
    );
  }
}

type NumberType = 'numLE' | 'numBE' | 'unsignedNumLE' | 'unsignedNumBE';
type BoolType =
  | 'bool0001'
  | 'bool0010'
  | 'bool0100'
  | 'bool1000'
  | 'bool00010000'
  | 'bool00100000'
  | 'bool01000000'
  | 'bool10000000';
type OtherType = 'string' | 'xyz';
type CustomType = 'custom';
type CheckType = 'check';

type NormalValueType = NumberType | BoolType | OtherType | CustomType;

type ValueType = NormalValueType | CheckType;

export type ObnizBleBeaconStruct<S> = {
  [key in keyof S]: ObnizBleBeaconStructNormal<S, key>;
} &
  { [key in string]: ObnizBleBeaconStructCheck };

interface ObnizBleBeaconStructStandard<S> {
  /** Value type */
  type: S;
  /** Start position (ex: 5.625 -> 46bit\~) */
  index: number;
  /** Default: 1byte = 8bit (ex: 1.875 -> 15bit) */
  length?: number;
  /** Be sure to use scan response data */
  scanResponse?: boolean;
}

export type ObnizBleBeaconStructNormal<
  S,
  key extends keyof S
> = ObnizBleBeaconStructStandard<NormalValueType> & {
  /** Default: 1 (ex: parseInt() * multiple) */
  multiple?: number;
  /** Required in array type, Only in xyz */
  // repeat?: number;
  /** Used only 'custom' */
  func?: (data: number[], peripheral: BleRemotePeripheral) => S[key];
};

export type ObnizBleBeaconStructCheck = ObnizBleBeaconStructStandard<ValueType> & {
  /** Compare data value, Used only 'check' */
  data?: number | number[];
};

export const iBeaconCompanyID = [0x4c, 0x00];

export const iBeaconData: ObnizBleBeaconStruct<IBeacon> =
  // length !== 25
  {
    type: {
      index: 0,
      length: 2,
      type: 'check',
      data: [0x02, 0x15],
    },
    uuid: {
      index: 2,
      length: 16,
      type: 'custom',
      func: (data) =>
        data
          .map(
            (d, i) =>
              ([2, 3, 4, 5].includes(i / 2) ? '-' : '') +
              ('00' + d.toString(16)).slice(-2)
          )
          .join(''),
    },
    major: {
      index: 18,
      length: 2,
      type: 'unsignedNumBE',
    },
    minor: {
      index: 20,
      length: 2,
      type: 'unsignedNumBE',
    },
    power: {
      index: 22,
      type: 'numLE',
    },
    rssi: {
      index: 0,
      type: 'custom',
      func: (d, p) => p.rssi ?? 0,
    },
  };
