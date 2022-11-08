import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandDisplay extends WSCommandAbstract {
    module: number;
    _CommandClear: number;
    _CommandPrint: number;
    _CommandDrawCampusVerticalBytes: number;
    _CommandDrawCampusHorizonalBytes: number;
    _CommandDrawIOState: number;
    _CommandSetPinName: number;
    _CommandDrawCampusRawColors: number;
    clear(params: any): void;
    print(buf: Uint8Array): void;
    printText(text: string): void;
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
