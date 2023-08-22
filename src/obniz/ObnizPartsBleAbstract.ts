/**
 * @packageDocumentation
 * @module ObnizCore
 */
/* eslint-disable rulesdir/non-ascii */
/* eslint-disable max-classes-per-file */

import roundTo from 'round-to';
import { BleRemoteCharacteristic } from './libs/embeds/bleHci/bleRemoteCharacteristic';
import {
  BleConnectSetting,
  BleRemotePeripheral,
  IBeacon,
} from './libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleUnknownCharacteristicError,
  ObnizBleUnknownServiceError,
} from './ObnizError';
import { Triaxial } from './ObnizParts';
import { ObnizPartsInfo, ObnizPartsProps } from './ObnizPartsInterface';
import { PartsType } from './ObnizPartsList';

const debugFlag = false;

const debug = (...objects: unknown[]) => {
  if (!debugFlag) return;
  console.debug(...objects);
};

const ObnizPartsBleModeList = ['Beacon', 'Connectable', 'Pairing'] as const;

export type ObnizPartsBleMode = typeof ObnizPartsBleModeList[number];

type ObnizPartsBleCompareByMode<S> = {
  [key in ObnizPartsBleMode]?: S;
};

export type ObnizPartsBleCompareWithNonNull<S> =
  | ObnizPartsBleCompareByMode<S>
  | S;

export type ObnizPartsBleCompare<S> = ObnizPartsBleCompareByMode<S | null> | S;

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

export type NormalValueType = NumberType | BoolType | OtherType;

export type ObnizBleBeaconStruct<S> =
  | {
      [key in keyof S]: ObnizBleBeaconStructNormal<S, key>;
    }
  | {
      [key in Exclude<string, keyof S>]: ObnizBleBeaconStructCheck;
    };

type ObnizBleBeaconStructStrict<S, T extends string> = {
  [key in keyof S | T]: key extends keyof S
    ? ObnizBleBeaconStructNormal<S, key>
    : ObnizBleBeaconStructCheck;
};

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

export type ObnizBleBeaconStructNormal<S, key extends keyof S> =
  | (ObnizBleBeaconStructStandard<NormalValueType> & {
      /** Default: 0 (def: base + parseInt() * multiple) */
      base?: number;
      /** Default: 1 (def: base + parseInt() * multiple) */
      multiple?: number;
      /** Default: none (ex: 0.1234 --(round: 2)-> 0.12) */
      round?: number;
      /** Number of bytes in the integer part with fixed point */
      fixedIntegerBytes?: number;
      /** Required in array type, Only in xyz */
      // repeat?: number;
    })
  | (ObnizBleBeaconStructStandard<CustomType> & {
      /** Used only 'custom' */
      func: (data: number[], peripheral: BleRemotePeripheral) => S[key];
    });

export type ObnizBleBeaconStructCheck =
  | ObnizBleBeaconStructCheckWithData
  | ObnizBleBeaconStructCheckWithFunc;

type ObnizBleBeaconStructCheckWithData = ObnizBleBeaconStructStandard<CheckType> & {
  /** Compare data value, Used only 'check' */
  data: number | number[];
};

type ObnizBleBeaconStructCheckWithFunc = ObnizBleBeaconStructStandard<CheckType> & {
  /** Compare function with data value, Used only 'check' */
  func: (data: Uint8Array) => boolean;
};

export const notMatchDeviceError = new Error('Is NOT target device.');

export const fixedPoint = (
  value: number[] | Uint8Array,
  integerBytes: number
): number => {
  const positive = value[0] >> 7 === 0;
  if (!positive) {
    value = value.map((n, i) => (n ^ 0xff) + (i === value.length - 1 ? 1 : 0));
  }
  const val =
    (positive ? 1 : -1) *
    (uint(value.slice(0, integerBytes)) +
      uint(value.slice(integerBytes)) /
        (1 << (8 * (value.length - integerBytes))));
  return val;
};

export const uint = (value: number[] | Uint8Array): number => {
  let val = 0;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#bitwise_logical_operators
  // eslint-disable-next-line prettier/prettier
  value.forEach((v, i) => (val += v * (2 ** (i * 8))));
  return val;
};

export const int = (value: number[] | Uint8Array): number => {
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

export const uintBE = (value: number[] | Uint8Array): number =>
  uint(value.reverse());

export const intBE = (value: number[] | Uint8Array): number =>
  int(value.reverse());

export const uintToArray = (value: number, length = 2): Uint8Array =>
  new Uint8Array(length)
    .fill(0)
    .map((v, i) => value % (1 << ((i + 1) * 8)) >> (i * 8));

export const uintToArrayWithBE = (value: number, length = 2): Uint8Array =>
  uintToArray(value, length).reverse();

export const fixByRange = (
  name: string,
  value: number,
  min: number,
  max: number
): number => {
  if (value < min) {
    console.warn(`Since ${name} ranges from ${min} to ${max}, ${min} is used.`);
    return min;
  }
  if (value > max) {
    console.warn(`Since ${name} ranges from ${min} to ${max}, ${max} is used.`);
    return max;
  }
  return value;
};

export const checkEquals = (
  base: number[] | Uint8Array,
  target: number[] | Uint8Array
): boolean => base.filter((v, i) => v !== target[i]).length === 0;

export interface ObnizPartsBleProps extends ObnizPartsProps {
  readonly PartsName: PartsType;
  readonly AvailableBleMode: ObnizPartsBleMode | ObnizPartsBleMode[];
  readonly Address?: ObnizPartsBleCompareWithNonNull<RegExp>;
  readonly LocalName?: ObnizPartsBleCompareWithNonNull<RegExp>;
  readonly ServiceUuids?: ObnizPartsBleCompare<string | string[]>;
  readonly BeaconDataLength?: ObnizPartsBleCompare<number>;
  readonly BeaconDataLength_ScanResponse?: ObnizPartsBleCompare<number>;
  readonly CompanyID?: ObnizPartsBleCompare<number[]>;
  readonly CompanyID_ScanResponse?: ObnizPartsBleCompare<number[]>;
  readonly BeaconDataStruct?: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<unknown>
  >;
  readonly ServiceDataLength?: ObnizPartsBleCompare<number>;
  readonly ServiceUUID?: ObnizPartsBleCompare<number[]>;
  readonly ServiceDataStruct?: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<unknown>
  >;

  getServiceUuids(mode: ObnizPartsBleMode): string[] | null | undefined;

  getDeviceMode(peripheral: BleRemotePeripheral): ObnizPartsBleMode | null;

  new (
    peripheral: BleRemotePeripheral,
    mode: ObnizPartsBleMode
  ): ObnizPartsBle<unknown>;
}

export abstract class ObnizPartsBle<S> {
  /**
   * Information of parts.
   * name: PartsName
   */
  public static info(): ObnizPartsInfo {
    return { name: ((this as unknown) as ObnizPartsBleProps).PartsName };
  }

  /**
   * Available BLE modes (Beacon | Connectable | Pairing)
   *
   * 利用可能なBLEのモード (Beacon | Connectable | Pairing)
   */
  public static getAvailableBleMode(): ObnizPartsBleMode[] {
    const availableBleMode = ((this as unknown) as ObnizPartsBleProps)
      .AvailableBleMode;
    return availableBleMode instanceof Array
      ? availableBleMode
      : [availableBleMode];
  }

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  public static readonly Address?: ObnizPartsBleCompareWithNonNull<RegExp> = undefined;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  public static readonly LocalName?: ObnizPartsBleCompareWithNonNull<RegExp> = undefined;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  public static readonly ServiceUuids?: ObnizPartsBleCompare<
    string | string[]
  > = undefined;

  public static getServiceUuids(
    mode: ObnizPartsBleMode
  ): string[] | null | undefined {
    const uuids =
      this.ServiceUuids instanceof Array ||
      typeof this.ServiceUuids === 'string' ||
      this.ServiceUuids === null ||
      this.ServiceUuids === undefined
        ? this.ServiceUuids
        : this.ServiceUuids[mode];
    return typeof uuids === 'string' ? [uuids] : uuids;
  }

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  public static readonly BeaconDataLength?: ObnizPartsBleCompare<number> = undefined;

  /**
   * Overall length of manufacturer-specific data.
   * Used as a condition of isDevice() by default.
   *
   * 製造者固有データ全体の長さ
   * 標準でisDevice()の条件として使用
   */
  public static readonly BeaconDataLength_ScanResponse?: ObnizPartsBleCompare<number> = undefined;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  public static readonly CompanyID?: ObnizPartsBleCompare<number[]> = undefined;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  public static readonly CompanyID_ScanResponse?: ObnizPartsBleCompare<
    number[]
  > = undefined;

  /**
   * Used as a condition of isDevice() by default.
   * Compare with data after Company ID.
   *
   * 標準でisDevice()の条件として使用
   * CompanyID以降のデータと比較
   */
  public static readonly BeaconDataStruct?: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<unknown>
  >;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  public static readonly ServiceDataLength?: ObnizPartsBleCompare<number> = undefined;

  /**
   * Used as a condition of isDevice() by default.
   *
   * 標準でisDevice()の条件として使用
   */
  public static readonly ServiceDataUUID?: ObnizPartsBleCompare<
    number[]
  > = undefined;

  /**
   * Used as a condition of isDevice() by default.
   * Compare with data after Service UUID.
   *
   * 標準でisDevice()の条件として使用
   * ServiceUUID以降のデータと比較
   */
  public static readonly ServiceDataStruct?: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<unknown>
  >;

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
    debug('getAvailableBleMode()', this.getAvailableBleMode());
    for (const mode of this.getAvailableBleMode()) {
      const check = this.isDeviceWithMode(peripheral, mode);
      if (check) {
        debug(`getDeviceMode(p) => ${mode}`, peripheral.address);
        return mode;
      }
    }
    debug('getDeviceMode(p) => null', peripheral.address);
    return null;
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
    debug(`isDeviceWithMode(peripheral, ${mode})`);
    if (!this.getAvailableBleMode().includes(mode)) return false;

    if (this.Address) {
      const defaultAddress =
        this.Address instanceof RegExp ? this.Address : this.Address[mode];
      debug('defaultAddress', defaultAddress);
      if (
        defaultAddress !== undefined &&
        !defaultAddress.test(peripheral.address)
      ) {
        debug(`defaultAddress.test(${peripheral.address}) === false`);
        return false;
      }
    }

    if (this.LocalName) {
      const defaultLocalName =
        this.LocalName instanceof RegExp
          ? this.LocalName
          : this.LocalName[mode];
      debug('defaultLocalName', defaultLocalName);
      if (
        defaultLocalName !== undefined &&
        !defaultLocalName.test(peripheral.localName ?? 'null')
      ) {
        debug(
          `defaultLocalName.test(${peripheral.localName} ?? 'null') === false`
        );
        return false;
      }
    }

    if (this.ServiceUuids) {
      const defaultServiceUuids = this.getServiceUuids(mode);
      debug('defaultServiceUuids', defaultServiceUuids);
      if (defaultServiceUuids !== undefined) {
        const uuids = peripheral.advertisementServiceUuids();
        debug('uuids', uuids);
        if (defaultServiceUuids === null && uuids.length !== 0) return false;
        if (defaultServiceUuids !== null && uuids.length === 0) return false;
        if (
          defaultServiceUuids !== null &&
          defaultServiceUuids.some((u) => !uuids.includes(u.toLowerCase()))
        ) {
          debug(
            'defaultServiceUuids.some((u) => !uuids.includes(u.toLowerCase())) === true'
          );
          return false;
        }
      }
    }

    if (
      !this.checkCustomData(
        mode,
        peripheral.address,
        peripheral.manufacturerSpecificData,
        this.BeaconDataLength,
        this.CompanyID,
        this.BeaconDataStruct
      )
    ) {
      debug(
        'this.checkCustomData(mode, p.address, p.manufacturerSpecificData, this.BeaconDataLength, this.CompanyID, this.BeaconDataStruct) === false'
      );
      return false;
    }

    if (
      !this.checkCustomData(
        mode,
        peripheral.address,
        peripheral.manufacturerSpecificDataInScanResponse,
        this.BeaconDataLength_ScanResponse,
        this.CompanyID_ScanResponse,
        this.BeaconDataStruct,
        true
      )
    ) {
      debug(
        'this.checkCustomData(mode, p.address, p.manufacturerSpecificDataInScanResponse, this.BeaconDataLength_ScanResponse, this.CompanyID_ScanResponse, this.BeaconDataStruct, true) === false'
      );
      return false;
    }

    if (
      !this.checkCustomData(
        mode,
        peripheral.address,
        peripheral.serviceData,
        this.ServiceDataLength,
        this.ServiceDataUUID,
        this.ServiceDataStruct
      )
    ) {
      debug(
        'this.checkCustomData(mode, p.address, p.serviceData, this.ServiceDataLength, this.ServiceDataUUID, this.ServiceDataStruct) === false'
      );
      return false;
    }

    return true;
  }

  private static checkCustomData(
    mode: ObnizPartsBleMode,
    address: string,
    rawData: number[] | null,
    dataLength?: ObnizPartsBleCompare<number>,
    headID?: ObnizPartsBleCompare<number[]>,
    dataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown>>,
    inScanResponse = false
  ): boolean {
    debug(
      `checkCustomData(mode, address, ${rawData}, ${dataLength}, ${headID}, ${dataStruct}, ${inScanResponse})`
    );
    const data = rawData ? new Uint8Array(rawData) : null;

    if (headID !== undefined) {
      const defHeadID =
        headID instanceof Array || headID === null || headID === undefined
          ? headID
          : headID[mode];
      if (defHeadID !== undefined) {
        if (defHeadID === null && data !== null) return false;
        if (defHeadID !== null && data === null) return false;
        if (
          defHeadID !== null &&
          data !== null &&
          (defHeadID[0] !== data[0] || defHeadID[1] !== data[1])
        )
          return false;
      }
    }

    if (dataLength !== undefined) {
      const defDataLength =
        typeof dataLength === 'number' ||
        dataLength === null ||
        dataLength === undefined
          ? dataLength
          : dataLength[mode];
      if (defDataLength !== undefined) {
        if (defDataLength === null && data !== null) return false;
        if (defDataLength !== null && data === null) return false;
        if (
          defDataLength !== null &&
          data !== null &&
          data.length + 1 !== defDataLength
        )
          return false;
      }
    }

    if (typeof dataStruct === 'object' && dataStruct !== null) {
      // ひとまずモードで選択してみる
      const defDataStructByMode = (dataStruct as ObnizPartsBleCompareByMode<
        ObnizBleBeaconStruct<unknown>
      >)[mode];
      // モードで選択した変数がオブジェクトまたはnullならばそのまま使い、そうでなければモードで選択せずに使用
      const defDataStruct = (typeof defDataStructByMode === 'object'
        ? defDataStructByMode
        : dataStruct) as ObnizBleBeaconStruct<
        Record<'macAddress_', unknown>
      > | null;
      if (defDataStruct !== undefined) {
        // TODO: macAddress_ -> macAddress
        if (defDataStruct && defDataStruct.macAddress_?.type === 'check') {
          defDataStruct.macAddress_ = {
            ...defDataStruct.macAddress_,
            data: new Array(6)
              .fill(0)
              .map((v, i) => parseInt(address.slice(i * 2, (i + 1) * 2), 16))
              .reverse(),
          };
        }

        if (defDataStruct === null && data === null) {
          // OK
        } else if (defDataStruct !== null && data === null) {
          // defDataStructではNULLであるべきかどうかを
          // AdvertisementDataとScanResponseData別に明記できないため、判定をスキップ
        } else if (defDataStruct === null && data !== null) {
          // どちらかが明示的に空なのに存在するため、ミスマッチ
          return false;
        } else if (defDataStruct !== null && data !== null) {
          // チェック対象となる設定を抽出
          const configs: (ObnizBleBeaconStructCheckWithData &
            ObnizBleBeaconStructCheckWithFunc)[] = Object.values(
            defDataStruct
          ).filter(
            (config) =>
              inScanResponse === (config.scanResponse ?? false) &&
              config.type === 'check'
          );

          for (const config of configs) {
            // チェック対象となるバイト列
            const targetData = data.slice(
              2 + config.index,
              2 + config.index + (config.length ?? 1)
            );
            if (typeof config.func === 'function') {
              // funcが関数ならば、実行して確認
              const result = config.func(targetData);
              if (!result) {
                return false;
              }
            } else if (
              typeof config.data === 'number' ||
              Array.isArray(config.data)
            ) {
              // dataに値や配列があれば、それらを比較
              const baseData =
                typeof config.data === 'number'
                  ? [config.data]
                  : config.data ?? [];
              if (!checkEquals(baseData, targetData)) {
                return false;
              }
            }
          }
        }
      }
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
    const lib = new ((this as unknown) as ObnizPartsBleProps)(peripheral, mode);
    try {
      return lib.getData();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public readonly peripheral: BleRemotePeripheral;

  public readonly address: string;

  public readonly beaconData: number[] | null;

  public readonly beaconDataInScanResponse: number[] | null;

  public readonly serviceData: number[] | null;

  protected _mode: ObnizPartsBleMode;

  public get mode(): ObnizPartsBleMode {
    return this._mode;
  }

  /**
   * NEED IMPLEMENTATION
   */
  protected abstract readonly staticClass: ObnizPartsBleProps;

  constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode) {
    this._mode = mode;
    this.peripheral = peripheral;
    this.address = peripheral.address;
    this.beaconData = this.peripheral.manufacturerSpecificData;
    if (this.beaconData) this.beaconData = this.beaconData.slice(2);
    this.beaconDataInScanResponse = this.peripheral.manufacturerSpecificDataInScanResponse;
    if (this.beaconDataInScanResponse)
      this.beaconDataInScanResponse = this.beaconDataInScanResponse.slice(2);
    this.serviceData = this.peripheral.serviceData;
    if (this.serviceData) this.serviceData = this.serviceData.slice(2);
  }

  public checkMode(force = false): ObnizPartsBleMode {
    if (this.mode && !force) return this.mode;
    const mode = this.staticClass.getDeviceMode(this.peripheral);
    if (!mode) throw notMatchDeviceError;
    return (this._mode = mode);
  }

  /**
   * アドバタイジングデータを連想配列に成形
   *
   * 利用可能なモード: Beacon, Connectable(一部のみ)
   *
   * Form advertising data into an associative array
   *
   * Available modes: Beacon, Connectable(only part)
   */
  public getData(): S {
    this.checkMode();
    const dataStruct: typeof this.staticClass.BeaconDataStruct =
      this.staticClass.BeaconDataStruct ?? this.staticClass.ServiceDataStruct;
    if (!dataStruct) throw new Error('Data analysis is not defined.');

    const data = this.staticClass.BeaconDataStruct
      ? this.beaconData
      : this.staticClass.ServiceDataStruct
      ? this.serviceData
      : null;
    if (!data) throw new Error('Manufacturer specific data is null.');

    // ひとまずモードで選択してみる
    const defDataStructByMode = (dataStruct as ObnizPartsBleCompareByMode<
      ObnizBleBeaconStruct<S>
    >)[this.mode];
    // モードで選択した変数がオブジェクトまたはnullならばそのまま使い、そうでなければモードで選択せずに使用
    const defDataStruct = (typeof defDataStructByMode === 'object'
      ? defDataStructByMode
      : dataStruct) as ObnizBleBeaconStruct<S> | null;
    if (defDataStruct === null)
      throw new Error('Data analysis is not defined.');

    return (Object.fromEntries(
      (Object.entries(defDataStruct) as [
        string,
        ObnizBleBeaconStructNormal<unknown, never> | ObnizBleBeaconStructCheck
      ][])
        .map(([name, config]) => {
          if (config.type === 'check') return [];
          if (!(config.scanResponse ? this.beaconDataInScanResponse : data))
            throw new Error('manufacturerSpecificData is null.');
          const vals = (
            (config.scanResponse ? this.beaconDataInScanResponse : data) ?? []
          ).slice(config.index, config.index + (config.length ?? 1));
          if (config.type.indexOf('bool') === 0)
            return [name, (vals[0] & parseInt(config.type.slice(4), 2)) > 0];
          else if (config.type === 'string')
            return [
              name,
              Buffer.from(vals.slice(0, vals.indexOf(0))).toString(),
            ];
          else if (config.type === 'xyz') {
            if (!config.length) config.length = 6;
            if (config.length % 6 !== 0) return [];
            else if (config.length === 6)
              return [
                name,
                this.getTriaxial(vals, config.fixedIntegerBytes, config.round),
              ];
            else
              return [
                name,
                [...Array(config.length / 6).keys()].map((v) =>
                  this.getTriaxial(
                    vals.slice(v * 6, (v + 1) * 6),
                    config.fixedIntegerBytes,
                    config.round
                  )
                ),
              ];
          } else if (config.type === 'custom')
            if (!config.func) return [];
            else return [name, config.func(vals, this.peripheral)];
          else {
            const base = config.base ?? 0;
            const multi = config.multiple ?? 1;
            const f = (d: number[]): number =>
              config.fixedIntegerBytes !== undefined
                ? fixedPoint(d, config.fixedIntegerBytes)
                : (config.type.indexOf('u') === 0 ? uint : int)(
                    config.type.indexOf('BE') >= 0 ? d.reverse() : d
                  );
            const num = base + f(vals) * multi;
            return [
              name,
              config.round !== undefined ? roundTo(num, config.round) : num,
            ];
          }
        })
        .filter((v) => v[0])
    ) as unknown) as S;
  }

  private getTriaxial(
    data: number[],
    fixedIntegerBytes?: number,
    round?: number
  ): Triaxial {
    const f = (d: number[]): number =>
      fixedIntegerBytes !== undefined
        ? fixedPoint(d, fixedIntegerBytes)
        : int(d);
    const ff = (d: number[]): number =>
      round !== undefined ? roundTo(f(d), round) : f(d);
    return {
      x: ff(data.slice(0, 2)),
      y: ff(data.slice(2, 4)),
      z: ff(data.slice(4, 6)),
    };
  }
}

export abstract class ObnizPartsBleConnectable<S, T> extends ObnizPartsBle<S> {
  constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode) {
    super(peripheral, mode);

    this.peripheral.ondisconnect = (reason: unknown) => {
      this.disconnectedListeners.forEach((func) => func(reason));
      if (this.ondisconnect) this.ondisconnect(reason);
    };
  }

  protected readonly disconnectedListeners: ((
    reason: unknown
  ) => void | Promise<void>)[] = [];

  /**
   * Register functions to be called on disconnection.
   *
   * Note: Registration is reset upon connection, so please register after connection.
   *
   * 切断時に呼ばれる関数を登録
   *
   * 注意: 接続時に登録がリセットされるため、接続後に登録してください
   *
   * @param func Function to be registered 登録したい関数
   */
  protected registerDisconnected(func: () => void) {
    this.disconnectedListeners.push(func);
  }

  /**
   * Connect to peripherals with validation.
   *
   * バリデーションのあるペリフェラルへの接続
   *
   * @param keys: Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
   * @param setting: Additional settings when connecting 接続時の追加設定
   */
  public async connectWait(
    keys?: string,
    setting?: BleConnectSetting
  ): Promise<void> {
    if (this.peripheral.connected) {
      return;
    }

    // 切断時に呼ぶ関数一覧を全て削除
    this.disconnectedListeners.splice(0);

    // TODO: Enable Validation
    // if (this.mode !== 'Connectable')
    //   throw new Error(
    //     `Connection can only be used in connectable mode, the current mode is ${this.mode}`
    //   );
    await this.peripheral.connectWait({
      pairingOption: {
        keys,
        ...(setting?.pairingOption ?? {}),
      },
      ...(setting ?? {}),
    });
  }

  /**
   * Disconnect from peripheral.
   *
   * ペリフェラルから切断
   */
  public async disconnectWait(): Promise<void> {
    if (!this.peripheral.connected) {
      return;
    }

    await this.peripheral.disconnectWait();

    // 切断時に呼ぶ関数一覧を全て削除
    this.disconnectedListeners.splice(0);
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
   * @param data Write data 書き込むデータ
   * @returns Data write result データ書き込み結果
   */
  protected async writeCharWait(
    serviceUuid: string,
    characteristicUuid: string,
    data?: number[] | Uint8Array,
    needResponse?: boolean
  ): Promise<boolean> {
    const characteristic = this.getChar(serviceUuid, characteristicUuid);
    return await characteristic.writeWait(
      data instanceof Uint8Array ? Array.from(data) : data,
      needResponse
    );
  }

  /**
   * Register notification to any characteristic of any service.
   *
   * 任意のサービスの任意のキャラクタリスティックへ通知を登録
   *
   * @param serviceUuid Service UUID
   * @param characteristicUuid Characteristic UUID
   * @param callback Function called when data arrives データが来たときに呼ばれる関数
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

  /**
   * Unregister notification to any characteristic of any service.
   *
   * 任意のサービスの任意のキャラクタリスティックから通知登録を削除
   *
   * @param serviceUuid Service UUID
   * @param characteristicUuid Characteristic UUID
   */
  protected async unsubscribeWait(
    serviceUuid: string,
    characteristicUuid: string
  ): Promise<void> {
    const characteristic = this.getChar(serviceUuid, characteristicUuid);
    await characteristic.unregisterNotifyWait();
  }
}

export abstract class ObnizPartsBlePairable<
  S,
  T
> extends ObnizPartsBleConnectable<S, T> {
  /**
   * Disconnect request after pairing
   *
   * ペアリング後に切断要求を行う
   */
  protected requestDisconnectAfterPairing = true;

  /**
   * Wait for disconnect event at the end of pairing
   *
   * ペアリングの終了時には切断イベントを待つ
   */
  protected waitDisconnectAfterPairing = true;

  /**
   * After pairing and before disconnect
   *
   * ペアリング後、切断前に行う操作
   */
  protected async afterPairingWait(): Promise<void> {
    // do nothing
  }

  /**
   * Perform pairing
   *
   * ペアリングを実行
   *
   * @returns Pairing key ペアリングキー
   */
  public async pairingWait(): Promise<string | null> {
    // 接続と同時にペアリングを実行
    await this.connectWait(undefined, {
      waitUntilPairing: true,
    });

    // ペアリングキーを取得
    const keys = await this.peripheral.getPairingKeysWait();

    /**
      以下の実装と同じ
      await this._peripheral.connectWait({
        pairingOption: {
          onPairedCallback: (keys) => {
            gotKeys = keys;
          },
          onPairingFailed: (e) => {
            throw e;
          },
        },
      });
     */

    // 任意のコードを実行
    await this.afterPairingWait();

    const promise = new Promise<string | null>((resolve) => {
      this.registerDisconnected(() => {
        // ペアリングキーを返す
        resolve(keys);
      });
    });

    // 切断要求を送信
    if (this.requestDisconnectAfterPairing) {
      await this.disconnectWait();
    }

    if (this.waitDisconnectAfterPairing) {
      // 切断完了を待つ
      return await promise;
    } else {
      // 切断完了を待たずにペアリングキーを返す
      return keys;
    }
  }
}

export const iBeaconCompanyID = [0x4c, 0x00];

export const iBeaconDataWithStrict: ObnizBleBeaconStructStrict<
  IBeacon,
  'type'
> =
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

export const iBeaconData: ObnizBleBeaconStruct<IBeacon> = iBeaconDataWithStrict;
