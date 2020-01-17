import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface _7SegmentLEDArrayOptions {
}
declare class _7SegmentLEDArray implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    identifier: any;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    segments: any;
    params: any;
    constructor();
    wired(obniz: Obniz): void;
    print(data: any): void;
    on(): void;
    off(): void;
}
export default _7SegmentLEDArray;
