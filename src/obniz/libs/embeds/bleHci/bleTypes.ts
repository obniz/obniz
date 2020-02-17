/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

/**
 * BLE UUID. Case is ignored. So aa00 and AA00 are the same.
 */
export type UUID = string;
export type BleDeviceAddress = string;

export type BleDeviceType = "ble" | "dumo" | "breder";
export type BleDeviceAddressType = "public" | "random" | "rpa_public" | "rpa_random";
export type BleEventType =
  "connectable_advertisemnt"
  | "connectable_directed_advertisemnt"
  | "scannable_advertising"
  | "non_connectable_advertising"
  | "scan_response";

export type BleAttributePropery = "broadcast" | "notify" | "read" | "write" | "write_without_response" | "indicate";

export type BleAdvertisementFlag =
  "limited_discoverable_mode"
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
