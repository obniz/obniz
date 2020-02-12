/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandPWM extends WSCommand {
    module: any;
    ModuleNum: any;
    _CommandInit: any;
    _CommandDeinit: any;
    _CommandSetFreq: any;
    _CommandSetDuty: any;
    _CommandAMModulate: any;
    pwms: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
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
