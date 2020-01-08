export = _7SegmentLED;
declare class _7SegmentLED {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    digits: number[];
    displayIoNames: {
        a: string;
        b: string;
        c: string;
        d: string;
        e: string;
        f: string;
        g: string;
        dp: string;
        common: string;
    };
    wired(obniz: any): void;
    obniz: any;
    ios: any[] | undefined;
    isCathodeCommon: boolean | undefined;
    dp: any;
    common: any;
    print(data: any): void;
    printRaw(data: any): void;
    dpState(show: any): void;
    on(): void;
    off(): void;
}
