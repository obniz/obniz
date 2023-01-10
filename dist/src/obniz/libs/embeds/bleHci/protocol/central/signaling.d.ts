import EventEmitter from 'eventemitter3';
declare type SignalingEventTypes = 'connectionParameterUpdateRequest';
/**
 * @ignore
 */
export declare class Signaling extends EventEmitter<SignalingEventTypes> {
    _handle: any;
    _aclStream: any;
    onAclStreamDataBinded: any;
    onAclStreamEndBinded: any;
    constructor(handle: any, aclStream: any);
    onAclStreamData(cid: any, data?: any): void;
    onAclStreamEnd(): void;
    private processConnectionParameterUpdateRequest;
}
export {};
