declare const events: any;
declare class AclStream extends events.EventEmitter {
    _hci: any;
    _handle: any;
    _smp: any;
    onSmpStkBinded: any;
    onSmpFailBinded: any;
    onSmpEndBinded: any;
    emit: any;
    constructor(hci: any, handle: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    encrypt(): void;
    write(cid: any, data: any): void;
    push(cid: any, data: any): void;
    pushEncrypt(encrypt: any): void;
    onSmpStk(stk: any): void;
    onSmpFail(): void;
    onSmpEnd(): void;
}
export default AclStream;