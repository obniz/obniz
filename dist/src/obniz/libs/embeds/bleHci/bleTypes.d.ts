/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { BleCharacteristic } from './bleCharacteristic';
import { BleDescriptor } from './bleDescriptor';
import { Brand } from '../../utils/brand';
/**
 * BLE UUID. Case is ignored. So aa00 and AA00 are the same.
 */
export declare type UUID = string;
export declare type BleDeviceAddress = Brand<string, 'BleDeviceAddress'>;
export declare type Handle = Brand<number, 'BleHandle'>;
export declare type BleDeviceType = 'ble' | 'dumo' | 'breder';
export declare type BleDeviceAddressType = 'public' | 'random' | 'rpa_public' | 'rpa_random';
export declare type BleEventType = 'connectable_advertisemnt' | 'connectable_directed_advertisemnt' | 'scannable_advertising' | 'non_connectable_advertising' | 'scan_response';
export declare type BleAttributePropery = 'broadcast' | 'notify' | 'read' | 'write' | 'write_without_response' | 'indicate';
export declare type BleAdvertisementFlag = 'limited_discoverable_mode' | 'general_discoverable_mode' | 'br_edr_not_supported' | 'le_br_edr_controller' | 'le_br_edr_host';
export interface BleScanResponseData {
    serviceUuids?: UUID[];
    localName?: string;
    manufacturerData?: {
        companyCode?: number;
        data?: number[];
    };
    serviceData?: [{
        uuid: number;
        data: number[];
    }];
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
    descriptors?: (BleDescriptorDefine | BleDescriptor)[];
}
export interface BleServiceDefine {
    /**
     * UUID
     */
    uuid: UUID;
    characteristics?: (BleCharacteristicDefine | BleCharacteristic)[];
}
export interface BlePeripheralDefine {
}
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
export interface BleCreateConnectionParameters {
    enable: boolean;
    scanInterval: number;
    scanWindow: number;
    connectIntervalMin: number;
    connectIntervalMax: number;
    latency: number;
    supervision: number;
    eventIntervalMin: number;
    eventIntervalMax: number;
}
export declare type BleExtendedAdvertisementMode = 'broadcast' | 'connectable' | 'scannable';
export interface BleSupportType {
    /**
     * BLE 5.0 AdvertiseExtended Support(ESP32 C3 or ESP32 S3)
     */
    extended?: boolean;
}
