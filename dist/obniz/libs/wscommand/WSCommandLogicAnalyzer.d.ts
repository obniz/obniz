export = WSCommandLogicAnalyzer;
declare const WSCommandLogicAnalyzer_base: typeof import("./WSCommand.js").default;
declare class WSCommandLogicAnalyzer extends WSCommandLogicAnalyzer_base {
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandRecv: number;
    init(params: any): void;
    deinit(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
