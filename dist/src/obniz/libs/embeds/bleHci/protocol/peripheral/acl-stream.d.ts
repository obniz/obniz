/// <reference types="node" />
import events from "events";
/**
 * @ignore
 */
declare class AclStream extends events.EventEmitter {
    _hci: any;
    _handle: any;
    encypted: any;
    _smp: any;
    encrypted: any;
    constructor(hci: any, handle: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    write(cid: any, data: any): void;
    push(cid: any, data: any): void;
    pushEncrypt(encrypt: any): void;
    pushLtkNegReply(): void;
}
export default AclStream;
