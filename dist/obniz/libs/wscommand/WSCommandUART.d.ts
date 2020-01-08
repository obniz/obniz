export = WSCommandUart;
declare const WSCommandUart_base: typeof import("./WSCommand.js").default;
declare class WSCommandUart extends WSCommandUart_base {
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandSend: number;
    _CommandRecv: number;
    init(params: any, module: any): void;
    deinit(params: any, module: any): void;
    send(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
