import WSCommand from "./WSCommand";
declare class WSCommandDisplay extends WSCommand {
    module: any;
    _CommandClear: any;
    _CommandPrint: any;
    _CommandDrawCampusVerticalBytes: any;
    _CommandDrawCampusHorizonalBytes: any;
    _CommandDrawIOState: any;
    _CommandSetPinName: any;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    constructor();
    clear(params: any): void;
    print(buf: any): void;
    printText(text: any): void;
    text(params: any): void;
    raw(params: any): void;
    qr(params: any): void;
    pinName(params: any): void;
    drawVertically(buf: any): void;
    drawHorizonally(buf: any): void;
    drawIOState(val: boolean): void;
    setPinName(no: any, moduleName: any, pinName: any): void;
    parseFromJson(json: any): void;
}
export default WSCommandDisplay;
