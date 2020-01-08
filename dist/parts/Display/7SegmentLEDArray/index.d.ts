export = _7SegmentLEDArray;
declare class _7SegmentLEDArray {
    static info(): {
        name: string;
    };
    identifier: string;
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    segments: any;
    print(data: any): void;
    on(): void;
    off(): void;
}
