/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandLogicAnalyzer extends WSCommandAbstract {
    module: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandRecv: number;
    init(params: any): void;
    deinit(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
