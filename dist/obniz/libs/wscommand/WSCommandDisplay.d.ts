export = WSCommandDisplay;
declare const WSCommandDisplay_base: typeof import("./WSCommand.js").default;
declare class WSCommandDisplay extends WSCommandDisplay_base {
    _CommandClear: number;
    _CommandPrint: number;
    _CommandDrawCampusVerticalBytes: number;
    _CommandDrawCampusHorizonalBytes: number;
    _CommandDrawIOState: number;
    _CommandSetPinName: number;
    clear(params: any): void;
    print(buf: any): void;
    printText(text: any): void;
    text(params: any): void;
    raw(params: any): void;
    qr(params: any): void;
    pinName(params: any): void;
    drawVertically(buf: any): void;
    drawHorizonally(buf: any): void;
    drawIOState(val: any): void;
    setPinName(no: any, moduleName: any, pinName: any): void;
    parseFromJson(json: any): void;
}
