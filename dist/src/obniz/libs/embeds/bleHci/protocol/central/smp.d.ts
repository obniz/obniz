/// <reference types="node" />
/**
 * @packageDocumentation
 *
 * @ignore
 */
import events from "events";
/**
 * @ignore
 */
declare class Smp extends events.EventEmitter {
    _aclStream: any;
    _iat: any;
    _ia: any;
    _rat: any;
    _ra: any;
    onAclStreamDataBinded: any;
    onAclStreamEndBinded: any;
    _preq: any;
    _pres: any;
    _tk: any;
    _r: any;
    _pcnf: any;
    constructor(aclStream: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    sendPairingRequest(): void;
    onAclStreamData(cid: any, data?: any): void;
    onAclStreamEnd(): void;
    handlePairingResponse(data: any): void;
    handlePairingConfirm(data: any): void;
    handlePairingRandom(data: any): void;
    handlePairingFailed(data: any): void;
    handleEncryptInfo(data: any): void;
    handleMasterIdent(data: any): void;
    write(data: any): void;
}
export default Smp;
