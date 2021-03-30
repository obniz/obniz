import WSCommand from "./WSCommand";
declare class WSCommandDisplay extends WSCommand {
    module: number;
    _CommandClear: number;
    _CommandPrint: number;
    _CommandDrawCampusVerticalBytes: number;
    _CommandDrawCampusHorizonalBytes: number;
    _CommandDrawIOState: number;
    _CommandSetPinName: number;
    _CommandDrawCampusRawColors: number;
    sendCommand: any;
    validateCommandSchema: any;
    WSCommandNotFoundError: any;
    clear(params: any): void;
    print(buf: Uint8Array): void;
    printText(text: any): void;
    text(params: any): void;
    raw(params: any): void;
    qr(params: any): void;
    pinName(params: any): void;
    drawVertically(buf: Uint8Array): void;
    drawHorizonally(buf: Uint8Array): void;
    drawIOState(val: boolean): void;
    setPinName(no: number, moduleName: string, pinName: string): void;
    drawRawColors(raw: number[], colorDepth: number): void;
    parseFromJson(json: any): void;
}
export default WSCommandDisplay;
