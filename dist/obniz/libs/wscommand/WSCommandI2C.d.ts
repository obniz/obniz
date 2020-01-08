export = WSCommandI2C;
declare const WSCommandI2C_base: typeof import("./WSCommand.js").default;
declare class WSCommandI2C extends WSCommandI2C_base {
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandWrite: number;
    _CommandRead: number;
    _CommandSlvWritten: number;
    initMaster(params: any, module: any): void;
    initSlave(params: any, module: any): void;
    deinit(params: any, module: any): void;
    write(params: any, module: any): void;
    read(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
