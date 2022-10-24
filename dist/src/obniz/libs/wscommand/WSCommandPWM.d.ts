/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandPWM extends WSCommandAbstract {
    module: number;
    ModuleNum: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandSetFreq: number;
    _CommandSetDuty: number;
    _CommandAMModulate: number;
    pwms: any[];
    constructor();
    resetInternalStatus(): void;
    init(params: any, module: any): void;
    deinit(params: any, module: any): void;
    freq(params: any, module: any): void;
    pulse(params: any, module: any): void;
    amModulate(params: any, module: any): void;
    parseFromJson(json: any): void;
}
