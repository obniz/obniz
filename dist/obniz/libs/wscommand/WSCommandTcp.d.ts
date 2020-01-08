export = WSCommandTcp;
declare const WSCommandTcp_base: typeof import("./WSCommand.js").default;
declare class WSCommandTcp extends WSCommandTcp_base {
    _MaxPort: number;
    _CommandConnect: number;
    _CommandClose: number;
    _CommandConnection: number;
    _CommandWrite: number;
    _CommandRead: number;
    connect(params: any, index: any): void;
    disconnect(params: any, index: any): void;
    write(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
