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
    clear(): void;
    print(buf: Uint8Array): void;
    printText(text: string): void;
    text(params: {
        text: string;
    }): void;
    raw(params: {
        color_depth?: number;
        raw: number[];
    }): void;
    qr(params: {
        qr: {
            text: string;
            correction?: 'L' | 'M' | 'Q' | 'H';
        };
    }): void;
    pinName(params: {
        pin_assign: {
            module_name: string;
            pin_name: string;
        }[];
    }): void;
    drawVertically(buf: Uint8Array): void;
    drawHorizonally(buf: Uint8Array): void;
    drawIOState(val: boolean): void;
    setPinName(no: number, moduleName: string, pinName: string): void;
    drawRawColors(raw: number[], colorDepth: number): void;
    parseFromJson(json: any): void;
}
