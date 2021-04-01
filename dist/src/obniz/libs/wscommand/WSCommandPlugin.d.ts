/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandPlugin extends WSCommand {
    module: any;
    _CommandReceive: any;
    _CommandSend: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    constructor();
    send(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
export default WSCommandPlugin;
