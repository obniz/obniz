import WSCommand from "./WSCommand";
declare class WSCommandWiFi extends WSCommand {
    module: any;
    _CommandScan: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    constructor();
    scan(params: any, index: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
}
export default WSCommandWiFi;
