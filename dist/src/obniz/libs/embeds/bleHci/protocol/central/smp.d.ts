/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import { BleDeviceAddress, BleDeviceAddressType } from '../../bleTypes';
import { AclStream } from './acl-stream';
import { SmpEventTypes } from '../common/smp';
/**
 * @ignore
 */
export interface SmpEncryptOptions {
    /**
     * Stored pairing keys
     */
    keys?: string;
    secureConnection?: boolean;
    /**
     * Callback function that call on pairing passkey required.
     */
    passkeyCallback?: () => Promise<number>;
    /**
     * Callback function that call on pairing passkey required.
     */
    onPairedCallback?: (keys: string) => void;
    /**
     * Callback function that call on pairing failed internal.
     * Some pairing error may caused internally when peripheral request regardless central side request.
     */
    onPairingFailed?: (e: Error) => void;
}
/**
 * @ignore
 */
export declare class Smp extends EventEmitter<SmpEventTypes> {
    private _aclStream;
    private _iat;
    private _ia;
    private _rat;
    private _ra;
    private onAclStreamDataBinded;
    private onAclStreamEndBinded;
    private _preq;
    private _pres;
    private _pairingFeature;
    private _tk;
    private _r;
    private _rand;
    private _ediv;
    private _pcnf;
    private _stk;
    private _ltk;
    private _options?;
    private _smpCommon;
    private _serialExecutor;
    private _pairingPromise;
    constructor(aclStream: AclStream, localAddressType: BleDeviceAddressType, localAddress: BleDeviceAddress, remoteAddressType: BleDeviceAddressType, remoteAddress: BleDeviceAddress);
    debugHandler: any;
    pairingWithKeyWait(key: string): Promise<number | "refresh">;
    setPairingOption(options: SmpEncryptOptions): void;
    pairingWait(options?: SmpEncryptOptions): Promise<void>;
    pairingSingleQueueWait(options?: SmpEncryptOptions): Promise<void>;
    onAclStreamData(cid: number, data: Buffer): void;
    onAclStreamEnd(): void;
    handlePairingResponseLegacyPairingWait(): Promise<void>;
    handlePairingResponseSecureConnectionWait(): Promise<Buffer>;
    handlePairingConfirm(data: Buffer): void;
    handlePairingRandomWait(data: Buffer): Promise<string | number>;
    handlePairingFailed(data: Buffer): void;
    handleEncryptInfo(data: Buffer): void;
    handleMasterIdent(data: Buffer): void;
    write(data: Buffer): void;
    handleSecurityRequest(data: Buffer): void;
    setKeys(keyStringBase64: string): void;
    hasKeys(): boolean;
    getKeys(): string;
    private _generateAuthenticationRequirementsFlags;
    private sendPairingRequestWait;
    private isPasskeyMode;
    private isSecureConnectionMode;
    private _readWait;
    private _pairingFailReject;
    private debug;
}
