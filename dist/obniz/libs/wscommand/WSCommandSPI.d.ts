export = WSCommandSPI;
declare const WSCommandSPI_base: typeof import("./WSCommand.js").default;
declare class WSCommandSPI extends WSCommandSPI_base {
    _CommandInit: number;
    _CommandDeinit: number;
    _CommandWriteRead: number;
    _CommandWrite: number;
    initMaster(params: any, module: any): void;
    deinit(params: any, module: any): void;
    write(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
