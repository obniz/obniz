/**
 * @packageDocumentation
 * @ignore
 */
/// <reference types="node" />
/// <reference types="node" />
import { HandleIndex } from '../peripheral/gatt';
export declare class GattCommon {
    write(): void;
    errorResponse(opcode: number, handle: HandleIndex, status: number): Buffer;
    mtuRequest(mtu: number): Buffer;
    mtuResponse(mtu: number): Buffer;
    readByGroupRequest(startHandle: number, endHandle: number, groupUuid: number): Buffer;
    readByTypeRequest(startHandle: number, endHandle: number, groupUuid: number): Buffer;
    readRequest(handle: HandleIndex): Buffer;
    readBlobRequest(handle: HandleIndex, offset: number): Buffer;
    findInfoRequest(startHandle: HandleIndex, endHandle: HandleIndex): Buffer;
    writeRequest(handle: HandleIndex, data: Buffer, withoutResponse: boolean): Buffer;
    prepareWriteRequest(handle: HandleIndex, offset: number, data: Buffer): Buffer;
    executeWriteRequest(handle: HandleIndex, cancelPreparedWrites?: boolean): Buffer;
    handleConfirmation(): Buffer;
}
