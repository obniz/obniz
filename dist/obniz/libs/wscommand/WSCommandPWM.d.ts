export = WSCommandPWM;
declare const WSCommandPWM_base: typeof import("./WSCommand.js").default;
declare class WSCommandPWM extends WSCommandPWM_base {
    ModuleNum: number;
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandSetFreq: number;
    _CommandSetDuty: number;
    _CommandAMModulate: number;
    resetInternalStatus(): void;
    pwms: any[] | undefined;
    init(params: any, module: any): void;
    deinit(params: any, module: any): void;
    freq(params: any, module: any): void;
    pulse(params: any, module: any): void;
    amModulate(params: any, module: any): void;
    parseFromJson(json: any): void;
}
