/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

import BleCharacteristic from './bleCharacteristic';
import BleDescriptor from './bleDescriptor';
import { Brand } from '../../utils/brand';

/**
 * BLE UUID. Case is ignored. So aa00 and AA00 are the same.
 */
export type UUID = string;
/**
 * BLE address with colon
 * ex: 01:23:45:67:89:ab
 */
export type BleDeviceAddressWithColon = string;
/**
 * Usually used BLE address
 * ex: 0123456789ab
 */
export type BleDeviceAddress = Brand<string, 'BleDeviceAddress'>;
export type Handle = Brand<number, 'BleHandle'>;

export type BleDeviceType = 'ble' | 'dumo' | 'breder';
export type BleDeviceAddressType =
  | 'public'
  | 'random'
  | 'rpa_public' // Public Identity Address (Corresponds to Resolved Private Address)
  | 'rpa_random'; // Random (static) Identity Address (Corresponds to Resolved Private Address)
export type BleEventType =
  | 'connectable_advertisemnt'
  | 'connectable_directed_advertisemnt'
  | 'scannable_advertising'
  | 'non_connectable_advertising'
  | 'scan_response';

export type BleAttributePropery =
  | 'broadcast'
  | 'notify'
  | 'read'
  | 'write'
  | 'write_without_response'
  | 'indicate';

export type BleAdvertisementFlag =
  | 'limited_discoverable_mode'
  | 'general_discoverable_mode'
  | 'br_edr_not_supported'
  | 'le_br_edr_controller'
  | 'le_br_edr_host';

export interface BleScanResponseData {
  serviceUuids?: UUID[];
  localName?: string;
  manufacturerData?: {
    companyCode?: number;
    data?: number[];
  };
  serviceData?: [{ uuid: number; data: number[] }];
}

export interface BleAdvertisementData extends BleScanResponseData {
  flags?: BleAdvertisementFlag[];
}

export interface BleDiscoveryAdvertisement {
  localName?: string;
  txPowerLevel?: number;
  manufacturerData?: Buffer;
  serviceData: {
    uuid: UUID;
    data: Buffer;
  }[];
  serviceUuids: UUID[];
  serviceSolicitationUuids: UUID[];
  solicitationServiceUuids: UUID[];
  advertisementRaw: unknown[];
  scanResponseRaw: unknown[];
  raw: unknown[];
}

export interface BleDescriptorDefine {
  /**
   * UUID
   */
  uuid: UUID;

  /**
   * Raw data
   *
   * Only one can be specifiedIf [[data]]  or [[text]]
   */
  data?: number[];

  /**
   * String data
   *
   * Only one can be specifiedIf [[data]]  or [[text]]
   */
  text?: string;
}

export interface BleCharacteristicDefine {
  /**
   * UUID
   */
  uuid: UUID;

  /**
   * Raw data
   *
   * Only one can be specifiedIf [[data]]  or [[text]]
   */
  data?: number[];

  /**
   * String data
   *
   * Only one can be specifiedIf [[data]]  or [[text]]
   */
  text?: string;

  properties?: BleAttributePropery[];

  descriptors?: (BleDescriptorDefine | BleDescriptor)[];
}

export interface BleServiceDefine {
  /**
   * UUID
   */
  uuid: UUID;

  characteristics?: (BleCharacteristicDefine | BleCharacteristic)[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BlePeripheralDefine {}

export interface BleExtendedAdvertisingEnable {
  handle: number;
  duration: number;
  events: number;
}

export interface BleCreateConnection {
  phy_1m: BleCreateConnectionParameters;
  phy_2m: BleCreateConnectionParameters;
  phy_coded: BleCreateConnectionParameters;
}
/* eslint rulesdir/non-ascii: 0 */
export interface BleCreateConnectionParameters {
  enable: boolean;
  scanInterval: number; // 次のスキャンを開始するまでの時間間隔
  scanWindow: number; // 主広告チャンネルでのスキャンの持続時間
  connectIntervalMin: number; // 接続間隔
  connectIntervalMax: number; // 接続間隔
  latency: number; // スレーブ接続のレイテンシー
  supervision: number; // LE Link の監視タイムアウト
  eventIntervalMin: number; // LE 接続に必要な接続イベント
  eventIntervalMax: number; // LE 接続に必要な接続イベントの
}

export type BleExtendedAdvertisementMode =
  | 'broadcast' // MAX adv 1650Byte
  | 'connectable' // MAX adv 242Byte
  | 'scannable'; // MAX scanRsp 1650Byte

export interface BleSupportType {
  /**
   * BLE 5.0 AdvertiseExtended Support(ESP32 C3 or ESP32 S3)
   */
  extended?: boolean;
}
