/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

import BleCharacteristic from "./bleCharacteristic";
import BleDescriptor from "./bleDescriptor";

/**
 * BLE UUID. Case is ignored. So aa00 and AA00 are the same.
 */
export type UUID = string;
export type BleDeviceAddress = string;
export type Handle = number;

export type BleDeviceType = "ble" | "dumo" | "breder";
export type BleDeviceAddressType = "public" | "random" | "rpa_public" | "rpa_random";
export type BleEventType =
  | "connectable_advertisemnt"
  | "connectable_directed_advertisemnt"
  | "scannable_advertising"
  | "non_connectable_advertising"
  | "scan_response";

export type BleAttributePropery = "broadcast" | "notify" | "read" | "write" | "write_without_response" | "indicate";

export type BleAdvertisementFlag =
  | "limited_discoverable_mode"
  | "general_discoverable_mode"
  | "br_edr_not_supported"
  | "le_br_edr_controller"
  | "le_br_edr_host";

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

  descriptors?: Array<BleDescriptorDefine | BleDescriptor>;
}

export interface BleServiceDefine {
  /**
   * UUID
   */
  uuid: UUID;

  characteristics?: Array<BleCharacteristicDefine | BleCharacteristic>;
}

export interface BlePeripheralDefine {}
