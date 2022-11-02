/**
 * @packageDocumentation
 * @module Parts.7SegmentLED_MAX7219
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { PeripheralSPI } from '../../../obniz/libs/io_peripherals/spi';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface _7SegmentLED_MAX7219Options {
    clk: number;
    cs: number;
    din: number;
    gnd?: number;
    vcc?: number;
}
export declare type MAX7219NumberType = 'on' | 'off' | '-' | 'e' | 'h' | 'l' | 'p';
export default class _7SegmentLED_MAX7219 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    cs: PeripheralIO;
    params: any;
    spi: PeripheralSPI;
    obniz: Obniz;
    numOfDisp: number;
    digits: number;
    constructor();
    wired(obniz: Obniz): void;
    init(numberOfDisplays: number, digits: number): void;
    clear(disp: number): void;
    clearAll(): void;
    test(): void;
    brightness(display: number, value: number): void;
    brightnessAll(value: number): void;
    writeAllDisp(data: number[]): void;
    writeOneDisp(disp: number, data: number[]): void;
    setNumber(display: number, digit: number, number: number | MAX7219NumberType, dp: boolean): void;
    encodeBCD(decimal: number | string, dp: any): number;
}
