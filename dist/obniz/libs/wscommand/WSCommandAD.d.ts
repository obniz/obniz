export = WSCommandAD;
declare const WSCommandAD_base: typeof import("./WSCommand.js").default;
declare class WSCommandAD extends WSCommandAD_base {
    _CommandInitNormalInterval: number;
    _CommandDeinit: number;
    _CommandNotifyValue: number;
    _CommandDoOnece: number;
    get(params: any, no: any): void;
    deinit(params: any, no: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
