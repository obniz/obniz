/// <reference types="node" />
/// <reference types="node" />
/**
 * @packageDocumentation
 * @ignore
 */
import EventEmitter from 'eventemitter3';
import { ObnizBLEHci } from '../hci';
import { BleDeviceAddress, BleDeviceAddressType, BleExtendedAdvertisingEnable, Handle } from '../bleTypes';
declare type HciEventTypes = 'leAdvertisingReport' | 'leExtendedAdvertisingReport' | 'leConnComplete' | 'stateChange' | 'leConnUpdateComplete' | 'disconnComplete' | 'encryptChange' | 'aclDataPkt' | 'updatePhy';
export declare type HciState = 'poweredOn' | 'poweredOff';
export declare type HciPhy = 'noPhy' | '1m' | '2m' | 'coded' | 'error';
/**
 * @ignore
 */
export declare class Hci extends EventEmitter<HciEventTypes> {
    static STATUS_MAPPER: any;
    _obnizHci: ObnizBLEHci;
    _handleBuffers: any;
    _handleAclsInProgress: any;
    _aclOutQueue: any;
    addressType: any;
    address: any;
    private _aclMtu;
    private _aclMaxInProgress;
    private _socket;
    private _state;
    private _aclStreamObservers;
    private _extendedAdvertiseJoinData;
    constructor(obnizHci: any);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    /**
     * @ignore
     * @private
     */
    debugHandler: any;
    initWait(): Promise<void>;
    setEventMaskCommand(mask: string): void;
    resetWait(): Promise<void>;
    resetForNrf52832Wait(): Promise<void>;
    resetForOldObnizjsWait(): Promise<void>;
    resetForEsp32Wait(): Promise<void>;
    resetCommandWait(): Promise<{
        eventType: number;
        subEventType: number;
        ncmd: number;
        cmd: number;
        status: number;
        result: Buffer;
    }>;
    setRandomDeviceAddressWait(): Promise<void>;
    leEncryptWait(key: Buffer, plainTextData: Buffer): Promise<{
        encryptedData: Buffer;
    }>;
    leRandWait(): Promise<{
        randomNumber: Buffer;
    }>;
    leSetRandomAddressWait(randomAddress: Buffer): Promise<void>;
    writeDefaultLinkPolicyCommandWait(mode: ('enableRoleSwitch' | 'enableHoldMode' | 'enableSniffMode')[]): Promise<void>;
    resetBuffers(): void;
    readLocalVersionCommandWait(): Promise<{
        hciVer: number;
        hciRev: number;
        lmpVer: number;
        manufacturer: number;
        lmpSubVer: number;
    }>;
    readLocalNameCommandWait(): Promise<string>;
    writePageTimeoutCommandWait(pageTimeout?: number): Promise<void>;
    writeClassOfDeviceCommandWait(classOfDevice: number): Promise<void>;
    writeInquiryScanTypeCommandWait(scanType: 'standardScan' | 'interlacedScan'): Promise<void>;
    writeInquiryModeCommandWait(inquiryMode: 'standardInquiryResultEventFormat' | 'inquiryResultFormatWithRSSI' | 'inquiryResultWithRSSIFormatOrExtendedInquiryResultFormat'): Promise<void>;
    writePageScanTypeCommandWait(pageScanType: 'standardScan' | 'interlacedScan'): Promise<void>;
    writeSimplePairingModeCommandWait(simplePairingMode: 'disabled' | 'enabled'): Promise<void>;
    setEventMaskPage2(mask: string): void;
    readLocalSupportedCommandWait(): Promise<Buffer>;
    readLocalSupportedFeaturesCommandWait(): Promise<Buffer>;
    readLocalExtendedFeaturesCommandWait(page: number): Promise<{
        pageNumber: number;
        maximumPageNumber: number;
        extendedLmpFeatures: Buffer;
    }>;
    leClearWhiteListCommandWait(): Promise<Buffer>;
    leReadSupportedStatesCommandWait(): Promise<Buffer>;
    leReadSuggestedDefaultDataLengthCommandWait(): Promise<{
        suggestedMaxTxOctets: number;
        suggestedMaxTxTime: number;
    }>;
    leWriteSuggestedDefaultDataLengthCommandWait(suggestedMaxTxOctets: number, suggestedMaxTxTime: number): Promise<void>;
    leClearResolvingListCommandWait(): Promise<void>;
    leReadResolvingListSizeCommandWait(): Promise<number>;
    leSetResolvablePrivateAddressTimeoutCommandWait(rpaTimeout: number): Promise<void>;
    leReadMaximumDataLengthCommandWait(): Promise<{
        supportedMaxTxOctets: number;
        supportedMaxTxTime: number;
        supportedMaxRxOctets: number;
        supportedMaxRxTime: number;
    }>;
    leReadLocalSupportedFeaturesCommandWait(): Promise<Buffer>;
    leReadPhyCommandWait(connectionHandle: number): Promise<{
        status: number;
        connectionHandle: number;
        txPhy: number;
        rxPhy: number;
    }>;
    leSetPhyCommandWait(connectionHandle: number, allPhys: number, txPhys: number, rxPhys: number, options: number): Promise<void>;
    setExtendedAdvertisingParametersWait(handle: number, eventProperties: number, primaryAdvertisingPhy: number, secondaryAdvertisingPhy: number, txPower: number): Promise<{
        status: number;
        txPower: number;
    }>;
    private extendedAdvertiseOperation;
    setExtendedAdvertisingDataWait(handle: number, data: Buffer): Promise<number>;
    setExtendedAdvertisingScanResponseDataWait(handle: number, data: Buffer): Promise<number>;
    setExtendedAdvertisingEnableWait(enabled: boolean, enableList: BleExtendedAdvertisingEnable[]): Promise<number>;
    leReadMaximumAdvertisingDataLengthWait(): Promise<number>;
    leClearAdvertisingSetWait(): Promise<number>;
    setExtendedScanParametersWait(isActiveScan: boolean, usePhy1m?: boolean, usePhyCoded?: boolean): Promise<number>;
    setExtendedScanEnabledWait(enabled: boolean, filterDuplicates: boolean): Promise<number>;
    createLeExtendedConnWait(address: BleDeviceAddress, addressType: BleDeviceAddressType, timeout: number | undefined, onConnectCallback: any, pyh1m?: boolean, pyh2m?: boolean, pyhCoded?: boolean): Promise<{
        status: any;
        handle: number;
        role: number;
        addressType: BleDeviceAddressType;
        address: string;
        interval: number;
        latency: number;
        supervisionTimeout: number;
        masterClockAccuracy: number;
    }>;
    leSetDefaultPhyCommandWait(allPhys: number, txPhys: number, rxPhys: number): Promise<number>;
    leReadAdvertisingPhysicalChannelTxPowerCommandWait(): Promise<number>;
    leReadWhiteListSizeWait(): Promise<number>;
    readBdAddrWait(): Promise<any>;
    setLeEventMaskCommand(mask: string): void;
    readLeHostSupportedWait(): Promise<{
        eventType: number;
        subEventType: number;
        ncmd: number;
        cmd: number;
        status: number;
        result: Buffer;
    }>;
    writeLeHostSupportedCommand(): void;
    setScanParametersWait(isActiveScan: boolean): Promise<number>;
    setScanEnabledWait(enabled: boolean, filterDuplicates: boolean): Promise<number>;
    createLeConnWait(address: BleDeviceAddress, addressType: BleDeviceAddressType, timeout: number | undefined, onConnectCallback: any, parameterType?: 'obnizjs<3_18_0' | 'esp32'): Promise<{
        status: any;
        handle: number;
        role: number;
        addressType: BleDeviceAddressType;
        address: string;
        interval: number;
        latency: number;
        supervisionTimeout: number;
        masterClockAccuracy: number;
    }>;
    createLeConnCancelWait(): Promise<void>;
    connUpdateLeWait(handle: Handle, minInterval: number, maxInterval: number, latency: number, supervisionTimeout: number): Promise<{
        status: any;
        handle: number;
        interval: number;
        latency: any;
        supervisionTimeout: number;
    }>;
    processLeConnUpdateComplete(status: any, data: any): {
        status: any;
        handle: number;
        interval: number;
        latency: any;
        supervisionTimeout: number;
    };
    startLeEncryptionWait(handle: Handle, random: Buffer, diversifier: Buffer, key: Buffer): Promise<number | "refresh">;
    disconnect(handle: Handle, reason?: number): void;
    readRssiWait(handle: Handle): Promise<number>;
    setAdvertisingParametersWait(): Promise<number>;
    setAdvertisingDataWait(data: any): Promise<number>;
    setScanResponseDataWait(data: any): Promise<number>;
    setAdvertiseEnableWait(enabled: any): Promise<number>;
    leReadBufferSizeWait(): Promise<{
        aclMtu: number;
        aclMaxInProgress: number;
    } | null | undefined>;
    readBufferSizeWait(): Promise<{
        aclMtu: number;
        aclMaxInProgress: number;
    } | null>;
    queueAclDataPkt(handle: Handle, cid: any, data: any): void;
    pushAclOutQueue(): void;
    writeOneAclDataPkt(): void;
    writeAclDataPkt(handle: Handle, cid: any, data: any): void;
    longTermKeyRequestNegativeReplyWait(handle: Handle): Promise<void>;
    processLeMetaEvent(eventType: any, status: any, data: Buffer): void;
    private parseConnectionCompleteEventData;
    private parseLeConnectionCompleteEventData;
    processLeConnComplete(status: any, data: ReturnType<Hci['parseConnectionCompleteEventData']> | ReturnType<Hci['parseLeConnectionCompleteEventData']>, onConnectCallback: any): {
        status: any;
        handle: number;
        role: number;
        addressType: BleDeviceAddressType;
        address: string;
        interval: number;
        latency: number;
        supervisionTimeout: number;
        masterClockAccuracy: number;
    };
    private phyToStr;
    processLeExtendedAdvertisingReport(count: number, data: Buffer): void;
    processLeAdvertisingReport(count: number, data: Buffer): void;
    processCmdStatusEvent(cmd: any, status: any): void;
    processLeReadBufferSizeWait(result: any): Promise<{
        aclMtu: number;
        aclMaxInProgress: number;
    } | null | undefined>;
    stateChange(state: HciState): void;
    readAclStreamWait(handle: Handle, cid: number, firstData: number, timeout?: number): Promise<Buffer>;
    protected readLeMetaEventWait(eventType: number, options: {
        timeout?: number | null;
        waitingFor: string;
        onTimeout?: () => Promise<void>;
    }): Promise<{
        type: number;
        status: number;
        data: Buffer;
    }>;
    protected createLeMetaEventFilter(eventType: number): number[];
    protected readCmdCompleteEventWait(requestCmd: number, additionalResultFilter?: number[]): Promise<{
        eventType: number;
        subEventType: number;
        ncmd: number;
        cmd: number;
        status: number;
        result: Buffer;
    }>;
    protected createCmdCompleteEventFilter(cmd: number): number[];
    private debug;
    private onHciAclData;
    private onHciEventData;
    private onSocketData;
    private writeNoParamCommandWait;
    private writeSingleParamCommandWait;
}
export {};
