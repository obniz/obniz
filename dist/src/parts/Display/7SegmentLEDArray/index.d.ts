declare class _7SegmentLEDArray {
    static info(): {
        name: string;
    };
    identifier: any;
    keys: any;
    requiredKeys: any;
    obniz: any;
    segments: any;
    params: any;
    constructor();
    wired(obniz: any): void;
    print(data: any): void;
    on(): void;
    off(): void;
}
export default _7SegmentLEDArray;
