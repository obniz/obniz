declare const events: any;
declare class Signaling extends events.EventEmitter {
    _handle: any;
    _aclStream: any;
    onAclStreamDataBinded: any;
    onAclStreamEndBinded: any;
    emit: any;
    constructor(handle: any, aclStream: any);
    onAclStreamData(cid: any, data?: any): void;
    onAclStreamEnd(): void;
    processConnectionParameterUpdateRequest(identifier: any, data: any): void;
}
export default Signaling;