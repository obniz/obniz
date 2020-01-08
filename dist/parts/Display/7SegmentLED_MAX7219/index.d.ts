export = _7SegmentLED_MAX7219;
declare class _7SegmentLED_MAX7219 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    cs: any;
    spi: any;
    init(numOfDisplay: any, digits: any): void;
    numOfDisp: any;
    digits: any;
    clear(disp: any): void;
    clearAll(): void;
    test(): void;
    brightness(disp: any, val: any): void;
    brightnessAll(val: any): void;
    writeAllDisp(data: any): void;
    writeOneDisp(disp: any, data: any): void;
    setNumber(disp: any, digit: any, number: any, dp: any): void;
    encodeBCD(decimal: any, dp: any): number;
}
