/**
 * @packageDocumentation
 * @module Parts.7SegmentLED
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface _7SegmentLEDOptions {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    dp?: number;
    common?: number;
    commonType?: string;
}
declare class _7SegmentLED implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    digits: number[];
    displayIoNames: {
        [key: string]: string;
    };
    obniz: Obniz;
    ios: PeripheralIO[];
    params: any;
    isCathodeCommon: boolean;
    dp?: PeripheralIO;
    common?: PeripheralIO;
    constructor();
    wired(obniz: Obniz): void;
    print(data: number): void;
    printRaw(data: number): void;
    dpState(show: boolean): void;
    on(): void;
    off(): void;
}
export default _7SegmentLED;
