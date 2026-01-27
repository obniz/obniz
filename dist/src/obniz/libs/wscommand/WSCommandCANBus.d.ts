/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandCANBus extends WSCommandAbstract {
    module: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandWrite: number;
    _CommandRead: number;
    init(params: any, module: any): void;
    deinit(params: any, module: number): void;
    send(params: any, module: number): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
