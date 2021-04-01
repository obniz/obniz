/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";
declare class WSCommandLogicAnalyzer extends WSCommand {
    module: any;
    _CommandInit: any;
    _CommandDeinit: any;
    _CommandRecv: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    constructor();
    init(params: any): void;
    deinit(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
export default WSCommandLogicAnalyzer;
