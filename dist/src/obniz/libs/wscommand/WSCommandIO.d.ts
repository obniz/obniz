/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandIO extends WSCommand {
    module: any;
    _CommandOutput: any;
    _CommandInputStream: any;
    _CommandInputOnece: any;
    _CommandOutputType: any;
    _CommandPullResisterType: any;
    _CommandEnd: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    COMMAND_FUNC_ID_ERROR: any;
    envelopWarning: any;
    envelopError: any;
    constructor();
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
export default WSCommandIO;
