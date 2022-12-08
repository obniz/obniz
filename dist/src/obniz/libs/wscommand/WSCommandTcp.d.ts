/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandTcp extends WSCommandAbstract {
    module: number;
    _MaxPort: number;
    _CommandConnect: number;
    _CommandClose: number;
    _CommandConnection: number;
    _CommandWrite: number;
    _CommandRead: number;
    connect(params: any, index: any): void;
    disconnect(params: any, index: any): void;
    write(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
