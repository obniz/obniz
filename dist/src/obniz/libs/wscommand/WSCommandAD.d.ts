/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandAD extends WSCommandAbstract {
    module: number;
    _CommandInitNormalInterval: number;
    _CommandDeinit: number;
    _CommandNotifyValue: number;
    _CommandDoOnece: number;
    get(params: any, no: any): void;
    deinit(params: any, no: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
