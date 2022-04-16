/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

import BleCharacteristic from './bleCharacteristic';
import BleDescriptor from './bleDescriptor';

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
export type BleDeviceAddress = string;
export type Handle = number;

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
