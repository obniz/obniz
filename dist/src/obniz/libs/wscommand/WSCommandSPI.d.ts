/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandSPI extends WSCommandAbstract {
    module: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandWriteRead: number;
    _CommandWrite: number;
    initMaster(params: any, module: any): void;
    deinit(params: any, module: any): void;
    write(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
