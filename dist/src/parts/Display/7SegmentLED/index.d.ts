declare class _7SegmentLED {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    digits: any;
    displayIoNames: any;
    obniz: any;
    ios: any;
    params: any;
    isCathodeCommon: any;
    dp: any;
    common: any;
    constructor();
    wired(obniz: any): void;
    print(data: any): void;
    printRaw(data: any): void;
    dpState(show: any): void;
    on(): void;
    off(): void;
}
export default _7SegmentLED;
