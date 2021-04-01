/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandAD extends WSCommand {
    module: any;
    _CommandInitNormalInterval: any;
    _CommandDeinit: any;
    _CommandNotifyValue: any;
    _CommandDoOnece: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    constructor();
    get(params: any, no: any): void;
    deinit(params: any, no: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
export default WSCommandAD;
