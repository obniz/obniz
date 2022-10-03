/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandPWM extends WSCommand {
    module: number;
    ModuleNum: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandSetFreq: number;
    _CommandSetDuty: number;
    _CommandAMModulate: number;
    pwms: any;
    constructor();
    resetInternalStatus(): void;
    init(params: any, module: any): void;
    deinit(params: any, module: any): void;
    freq(params: any, module: any): void;
    pulse(params: any, module: any): void;
    amModulate(params: any, module: any): void;
    parseFromJson(json: any): void;
}
export default WSCommandPWM;
