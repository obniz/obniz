/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
/// <reference types="node" />
/// <reference types="node" />
import { BleCharacteristic } from './bleCharacteristic';
import { BleDescriptor } from './bleDescriptor';
import { Brand } from '../../utils/brand';
/**
 * BLE UUID. Case is ignored. So aa00 and AA00 are the same.
 */
declare type HexDecimal1 = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
declare type HexDecimal4 = `${HexDecimal1}${HexDecimal1}${HexDecimal1}${HexDecimal1}`;
export declare type UUID16 = Brand<`${HexDecimal4}`, 'UUID16'>;
export declare type UUID32 = Brand<string, 'UUID32'>;
export declare type UUID128 = Brand<string, 'UUID128'>;
export declare type UUID = UUID16 | UUID32 | UUID128;
export declare type BleUUIDBuffer = Brand<Buffer, 'BleUUIDBuffer'>;
/**
 * 人間がみるデバイスアドレス
 * 00112233445566
 */
export declare type BleDeviceAddress = Brand<string, 'BleDeviceAddress'>;
/**
 * 00:11:22:33:44:55:66
 */
export declare type BleDeviceColonSeparatedAddress = Brand<`${string}:${string}:${string}:${string}:${string}:${string}`, 'BleDeviceColonSeparatedAddress'>;
/**
 * 機械が見るデバイスアドレス
 * 66554433221100
 */
export declare type BleDeviceAddressReversed = Brand<string, 'BleDeviceAddressReversed'>;
/**
 * 機械が見るデバイスアドレスのバッファ
 * 66554433221100
 */
export declare type BleDeviceAddressReversedBuffer = Brand<Buffer, 'BleDeviceAddressReversedBuffer'>;
export declare type BleDeviceAddressUUID = BleDeviceAddressReversed;
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
export {};
