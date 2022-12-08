import EventEmitter from 'eventemitter3';
import { ObnizBLE } from './ble';
import { BleRemotePeripheral } from './bleRemotePeripheral';
import { BleDeviceAddress, UUID } from './bleTypes';
export declare type BleScanMode = 'passive' | 'active';
export declare type BleBinary = number[];
/**
 * All parameters are OR. If you set uuid and localName, obniz find uuid match but localName not match device.
 *
 * If you set BleScanSetting.filterOnDevice 'true', filters are apply on obniz device. So it reduce traffic.
 */
export interface BleScanTarget {
    /**
     * Service UUID for scan. Provide.
     *
     * up to 20 UUIDs (recommended)
     *
     * Attention: iBeacon uuid is not service uuid. If you want to filter iBeacon. use binary filter
     */
    uuids?: UUID[];
    /**
     * scan target device localName. This need perfect matching.
     */
    localName?: string[] | string;
    /**
     * scan target device localName. This need prefix matching.
     */
    localNamePrefix?: string | string[];
    /**
     * device address
     */
    deviceAddress?: BleDeviceAddress[] | BleDeviceAddress;
    /**
     * Advanced search.
     *
     * You need to enable `filterOnDevice:true` to use this filter.
     *
     * Search partially matches advertisement / scan response regarding provided byte array.
     * If advertisement / scan reponse has a matched byte array in the data, then passed.
     */
    binary?: BleBinary[] | BleBinary;
}
/**
 * @ignore
 */
export interface BleScanAdvertisementFilterParam {
    deviceAddress?: BleDeviceAddress;
    localNamePrefix?: string;
    uuid?: UUID;
    binary?: number[];
}
export interface BleScanSetting {
    /**
     * Timeout seconds of scanning. Default is 30 seconds.
     *
     * If set null, scan don't stop automatically.
     */
    duration?: number | null;
    /**
     * (obnizOS 3 or later only)
     *
     * Specifying onfind will be called or not when an advertisement received from already known peripheral. Default is false : never called again.
     */
    duplicate?: boolean;
    /**
     * (obnizOS 3 or later only)
     *
     * Active scan or Passive Scan
     *
     * Default is true : activeScan.
     *
     */
    activeScan?: boolean;
    /**
     * (obnizOS >= 3.2.0 only)
     *
     * filters are apply on obniz device
     *
     * True: filter on device and JavaScript.<br/>
     * False : filter on JavaScript only.
     *
     * Default is false : filter on JavaScript only.
     *
     *
     * ```javascript
     * // Javascript Example
     * var target = {
     *     localName: "obniz-BLE",     //scan only has localName "obniz-BLE"
     * };
     *
     * var setting = {
     *    duration : 10,  //scan duration time in seconds. default is 30 sec.
     *    filterOnDevice: true
     * }
     *
     * await obniz.ble.initWait();
     * await obniz.ble.scan.startWait(target, setting);
     * ```
     *
     *
     */
    filterOnDevice?: boolean;
    /**
     * (ESP32 C3 or ESP32 S3)
     *
     * True: Scan phy<br/>
     * False : Do not scan phy
     *
     * Default is true : Scan phy
     *
     *
     * ```javascript
     * // Javascript Example
     * var target = {
     *     localName: "obniz-BLE",     //scan only has localName "obniz-BLE"
     * };
     *
     * var setting = {
     *    usePhy1m : false,
     *    usePhyCoded: true
     * }
     *
     * await obniz.ble.initWait();
     * await obniz.ble.scan.startWait(target, setting);
     * ```
     *
     *
     */
    usePhy1m?: boolean;
    usePhyCoded?: boolean;
    /**
     * If only one of advertisement and scanResponse is coming, wait until both come.
     *
     * True : wait for other data come until 10 seconds
     * False : don't wait and notify immediately. some parameters will be null.
     *
     * default : true
     */
    waitBothAdvertisementAndScanResponse?: boolean;
}
declare type BleScanState = 'stopped' | 'stopping' | 'started' | 'starting';
/**
 * @category Use as Central
 */
export declare class BleScan {
    /**
     * This function gets called when obniz Board finishes scanning.
     *
     * ```javascript
     * // Javascript Example
     *
     * obniz.ble.scan.onfind = function(peripheral){
     *   console.log(peripheral)
     * };
     *
     * obniz.ble.scan.onfinish = function(peripherals){
     *    console.log("scan timeout!")
     * };
     *
     * await obniz.ble.initWait();
     * await obniz.ble.scan.startWait();
     * ```
     *
     */
    onfinish?: (peripherals: BleRemotePeripheral[], error?: Error) => void;
    /**
     * This function gets called when obniz Board finds a new peripheral.
     *
     * ```javascript
     * // Javascript Example
     *
     * obniz.ble.scan.onfind = function(peripheral){
     *  console.log(peripheral)
     * };
     *
     * await obniz.ble.initWait();
     * await obniz.ble.scan.startWait();
     * ```
     */
    onfind?: (peripheral: BleRemotePeripheral) => void;
    state: BleScanState;
    protected scanTarget: BleScanTarget;
    protected scanSettings: BleScanSetting;
    protected obnizBle: ObnizBLE;
    protected emitter: EventEmitter<'onfind' | 'onfinish'>;
    protected scanedPeripherals: BleRemotePeripheral[];
    private _timeoutTimer?;
    private _delayNotifyTimers;
    constructor(obnizBle: ObnizBLE);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    /**
     * Use startWait() instead.
     *
     * @deprecated
     */
    start(target?: BleScanTarget | null, settings?: BleScanSetting): void;
    /**
     * This starts scanning BLE.
     *
     * You can filter uuids or localName using the target param.
     *
     * ```javascript
     * // Javascript Example
     * var target = {
     *     uuids: ["fff0","FFF1"],     //scan only has uuids "fff0" and "FFF1"
     *     localName: "obniz-BLE",     //scan only has localName "obniz-BLE"
     * };
     *
     * var setting = {
     *    duration : 10  //scan duration time in seconds. default is 30 sec.
     * }
     *
     * await obniz.ble.initWait();
     * await obniz.ble.scan.startWait(target, setting);
     * ```
     *
     * This is also possible without params being valid.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.scan.startWait();
     * ```
     *
     * Scanning starts with no error and results with not advertisement found while a device is trying to connect a peripheral.
     * Before start scannnig. Establishing connection must be completed or canceled.
     *
     * @param target
     * @param settings
     */
    startWait(target?: BleScanTarget | null, settings?: BleScanSetting): Promise<void>;
    /**
     * This scans and returns the first peripheral that was found among the objects specified in the target.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     *
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * console.log(peripheral);
     * ```
     *
     * @param target
     * @param settings
     */
    startOneWait(target: BleScanTarget, settings?: BleScanSetting): Promise<BleRemotePeripheral | null>;
    /**
     * This scans and returns all the peripherals found.
     *
     * This function does not return until scanning gets timed out.(default 30sec)
     * If you want to change the default duration, you can do so with the duration param.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *  uuids: ["fff0"],
     * };
     * var setting = {
     *   duration : 10
     * }
     *
     * var peripherals = await obniz.ble.scan.startAllWait(target,setting);
     *
     * for(var peripheral of peripherals){
     *   console.log(peripheral);
     * }
     * ```
     *
     * @param target
     * @param settings
     */
    startAllWait(target: BleScanTarget, settings: BleScanSetting): Promise<BleRemotePeripheral[]>;
    /**
     * Use endWait() instead
     *
     * @deprecated
     */
    end(): void;
    /**
     * This stops scanning BLE.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * await obniz.ble.scan.startWait();
     * await obniz.wait(5000);
     * await obniz.ble.scan.endWait();
     * ```
     */
    endWait(): Promise<void>;
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName: string, params: any): void;
    /**
     * Clear advertisement filter.
     */
    clearAdvertisementFilter(): void;
    protected _setAdvertisementFilter(filterVals: BleScanAdvertisementFilterParam[]): void;
    protected _arrayWrapper<T>(val: T | T[]): T[];
    protected _setTargetFilterOnDevice(scanTarget: BleScanTarget): void;
    protected isTarget(peripheral: BleRemotePeripheral): boolean;
    protected clearTimeoutTimer(): void;
    private finish;
    private _notifyOnFind;
    private isLocalNameTarget;
    private isLocalNamePrefixTarget;
    private isBinaryTarget;
    private isUuidTarget;
    private isDeviceAddressTarget;
    private isContainingBleScanSettingProperty;
    private _clearDelayNotifyTimer;
    private _removeDelayNotifyTimer;
}
export {};
