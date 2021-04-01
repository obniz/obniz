/// <reference types="node" />
/**
 * @packageDocumentation
 * @ignore
 */
import EventEmitter from "eventemitter3";
import ObnizBLEHci from "../hci";
import { BleDeviceAddress, BleDeviceAddressType, Handle } from "../bleTypes";
declare type HciEventTypes = "leAdvertisingReport" | "leConnComplete" | "stateChange" | "leConnUpdateComplete" | "disconnComplete" | "encryptChange" | "aclDataPkt";
declare type HciState = "poweredOn" | "poweredOff";
/**
 * @ignore
 */
declare class Hci extends EventEmitter<HciEventTypes> {
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
    setEventMask(): void;
    resetWait(): Promise<void>;
    resetBuffers(): void;
    readLocalVersionWait(): Promise<{
        hciVer: number;
        hciRev: number;
        lmpVer: number;
        manufacturer: number;
        lmpSubVer: number;
    }>;
    readBdAddrWait(): Promise<any>;
    setLeEventMask(): void;
    readLeHostSupportedWait(): Promise<{
        eventType: number;
        subEventType: number;
        ncmd: number;
        cmd: number;
        status: number;
        result: Buffer;
    }>;
    writeLeHostSupported(): void;
    setScanParametersWait(isActiveScan: boolean): Promise<number>;
    setScanEnabledWait(enabled: boolean, filterDuplicates: boolean): Promise<number>;
    createLeConnWait(address: BleDeviceAddress, addressType: BleDeviceAddressType, timeout: number | undefined, onConnectCallback: any): Promise<{
        status: any;
        handle: number;
        role: number;
        addressType: string;
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
    longTermKeyRequestNegativeReply(handle: Handle): Promise<number>;
    processLeMetaEvent(eventType: any, status: any, data: any): void;
    processLeConnComplete(status: any, data: Buffer, onConnectCallback: any): {
        status: any;
        handle: number;
        role: number;
        addressType: string;
        address: string;
        interval: number;
        latency: number;
        supervisionTimeout: number;
        masterClockAccuracy: number;
    };
    processLeAdvertisingReport(count: number, data: Buffer): void;
    processCmdStatusEvent(cmd: any, status: any): void;
    processLeReadBufferSizeWait(result: any): Promise<{
        aclMtu: number;
        aclMaxInProgress: number;
    } | null | undefined>;
    stateChange(state: HciState): void;
    readAclStreamWait(handle: Handle, cid: number, firstData: number, timeout?: number): Promise<Buffer>;
    protected readLeMetaEventWait(eventType: number, options?: any): Promise<{
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
}
export default Hci;
