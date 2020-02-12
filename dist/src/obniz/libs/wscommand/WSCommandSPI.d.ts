/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandSPI extends WSCommand {
    module: any;
    _CommandInit: any;
    _CommandDeinit: any;
    _CommandWriteRead: any;
    _CommandWrite: any;
    ioNotUsed: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    constructor();
    initMaster(params: any, module: any): void;
    deinit(params: any, module: any): void;
    write(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
export default WSCommandSPI;
