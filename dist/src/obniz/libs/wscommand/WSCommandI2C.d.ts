/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandI2C extends WSCommand {
    module: any;
    _CommandInit: any;
    _CommandDeinit: any;
    _CommandWrite: any;
    _CommandRead: any;
    _CommandSlvWritten: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    COMMAND_FUNC_ID_ERROR: any;
    envelopError: any;
    constructor();
    initMaster(params: any, module: any): void;
    initSlave(params: any, module: any): void;
    deinit(params: any, module: any): void;
    write(params: any, module: any): void;
    read(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
export default WSCommandI2C;
