export = WSCommandIO;
declare const WSCommandIO_base: typeof import("./WSCommand.js").default;
declare class WSCommandIO extends WSCommandIO_base {
    _CommandOutput: number;
    _CommandInputStream: number;
    _CommandInputOnece: number;
    _CommandOutputType: number;
    _CommandPullResisterType: number;
    _CommandEnd: number;
    output(value: any, id: any): void;
    outputDetail(params: any, id: any): void;
    input(params: any, id: any): void;
    inputDetail(params: any, id: any): void;
    outputType(params: any, id: any): string | undefined;
    pullType(params: any, id: any): string | undefined;
    deinit(params: any, id: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
