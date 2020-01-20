declare const events: any;
export default class Smp extends events.EventEmitter {
    _aclStream: any;
    _mgmt: any;
    _iat: any;
    _ia: any;
    _rat: any;
    _ra: any;
    _stk: any;
    _random: any;
    _diversifier: any;
    _preq: any;
    _pres: any;
    _pcnf: any;
    _tk: any;
    _r: any;
    constructor(aclStream: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any, hciProtocol: any);
    onAclStreamData(cid: any, data: any): void;
    onAclStreamEncryptChange(encrypted: any): void;
    onAclStreamLtkNegReply(): void;
    onAclStreamEnd(): void;
    handlePairingRequest(data: any): void;
    handlePairingConfirm(data: any): void;
    handlePairingRandom(data: any): void;
    handlePairingFailed(data: any): void;
    write(data: any): void;
}
export {};
