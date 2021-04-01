/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandTcp extends WSCommand {
    module: any;
    _MaxPort: any;
    _CommandConnect: any;
    _CommandClose: any;
    _CommandConnection: any;
    _CommandWrite: any;
    _CommandRead: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    constructor();
    connect(params: any, index: any): void;
    disconnect(params: any, index: any): void;
    write(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
export default WSCommandTcp;
