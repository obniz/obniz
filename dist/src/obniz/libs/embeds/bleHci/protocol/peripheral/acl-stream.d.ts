declare const events: any;
declare class AclStream extends events.EventEmitter {
    _hci: any;
    _handle: any;
    encypted: any;
    _smp: any;
    emit: any;
    encrypted: any;
    constructor(hci: any, handle: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    rite(cid: any, data: any): void;
    ush(cid: any, data: any): void;
    ushEncrypt(encrypt: any): void;
    ushLtkNegReply(): void;
}
export default AclStream;
