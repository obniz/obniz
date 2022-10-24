/**
 * @packageDocumentation
 * @module Parts.7SegmentLEDArray
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import _7SegmentLED from '../7SegmentLED';
export interface _7SegmentLEDArrayOptions {
    segments: _7SegmentLED[];
}
export default class _7SegmentLEDArray implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    identifier: string;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    segments: _7SegmentLED[];
    params: any;
    constructor();
    wired(obniz: Obniz): void;
    print(data: number): void;
    on(): void;
    off(): void;
}
