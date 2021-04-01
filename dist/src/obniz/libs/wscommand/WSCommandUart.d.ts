/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandUart extends WSCommand {
    module: any;
    _CommandInit: any;
    _CommandDeinit: any;
    _CommandSend: any;
    _CommandRecv: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    constructor();
    init(params: any, module: any): void;
    deinit(params: any, module: any): void;
    send(params: any, module: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
export default WSCommandUart;
