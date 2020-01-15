import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface _7SegmentLED_MAX7219Options {
}
declare class _7SegmentLED_MAX7219 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    cs: any;
    params: any;
    spi: any;
    obniz: Obniz;
    numOfDisp: any;
    digits: any;
    constructor();
    wired(obniz: Obniz): void;
    init(numOfDisplay: any, digits: any): void;
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
export default _7SegmentLED_MAX7219;
