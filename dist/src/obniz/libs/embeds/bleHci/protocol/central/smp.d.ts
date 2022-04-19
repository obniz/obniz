/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import { BleDeviceAddress, BleDeviceAddressType } from '../../bleTypes';
import AclStream from './acl-stream';
/**
 * @ignore
 */
declare type SmpEventTypes = 'masterIdent' | 'ltk' | 'fail' | 'end';
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
declare class Smp extends EventEmitter<SmpEventTypes> {
    private _aclStream;
    private _iat;
    private _ia;
    private _rat;
    private _ra;
    private onAclStreamDataBinded;
    private onAclStreamEndBinded;
    private _preq;
    private _pres;
    private _tk;
    private _r;
    private _rand;
    private _ediv;
    private _pcnf;
    private _stk;
    private _ltk;
    private _options?;
    constructor(aclStream: AclStream, localAddressType: BleDeviceAddressType, localAddress: BleDeviceAddress, remoteAddressType: BleDeviceAddressType, remoteAddress: BleDeviceAddress);
    debugHandler: any;
    pairingWithKeyWait(key: string): Promise<number | "refresh">;
    setPairingOption(options: SmpEncryptOptions): void;
    pairingWait(options?: SmpEncryptOptions): Promise<number | "refresh" | undefined>;
    onAclStreamData(cid: number, data: Buffer): void;
    onAclStreamEnd(): void;
    handlePairingResponseLegacyPairingWait(): Promise<void>;
    handlePairingResponseSecureConnectionWait(): Promise<Buffer>;
    handlePairingConfirm(data: Buffer): void;
    handlePairingRandomWait(data: any): Promise<string | number>;
    handlePairingFailed(data: Buffer): void;
    handleEncryptInfo(data: any): void;
    handleMasterIdent(data: any): void;
    write(data: any): void;
    handleSecurityRequest(data: any): void;
    setKeys(keyStringBase64: string): void;
    getKeys(): string;
    private _generateAuthenticationRequirementsFlags;
    private sendPairingRequestWait;
    private isPasskeyMode;
    private isSecureConnectionMode;
    private _readWait;
    private _pairingFailReject;
    private debug;
    private parsePairingReqRsp;
    private ioCapability2value;
    private value2ioCapability;
}
export default Smp;
