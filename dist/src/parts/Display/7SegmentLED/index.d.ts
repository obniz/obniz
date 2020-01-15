import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface _7SegmentLEDOptions {
}
declare class _7SegmentLED implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    digits: any;
    displayIoNames: any;
    obniz: Obniz;
    ios: any;
    params: any;
    isCathodeCommon: any;
    dp: any;
    common: any;
    constructor();
    wired(obniz: Obniz): void;
    print(data: any): void;
    printRaw(data: any): void;
    dpState(show: any): void;
    on(): void;
    off(): void;
}
export default _7SegmentLED;
