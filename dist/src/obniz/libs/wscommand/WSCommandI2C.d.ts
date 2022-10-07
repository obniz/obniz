/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandI2C extends WSCommandAbstract {
    module: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandWrite: number;
    _CommandRead: number;
    _CommandSlvWritten: number;
    initMaster(params: any, module: any): void;
    initSlave(params: any, module: any): void;
    deinit(params: any, module: any): void;
    write(params: any, module: any): void;
    read(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
