/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandIO extends WSCommandAbstract {
    module: number;
    _CommandOutput: number;
    _CommandInputStream: number;
    _CommandInputOnece: number;
    _CommandOutputType: number;
    _CommandPullResisterType: number;
    _CommandEnd: number;
    output(value: any, id: number): void;
    outputDetail(params: any, id: number): void;
    input(params: any, id: number): void;
    inputDetail(params: any, id: number): void;
    outputType(params: any, id: number): string | undefined;
    pullType(params: any, id: any): string | undefined;
    deinit(params: any, id: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
