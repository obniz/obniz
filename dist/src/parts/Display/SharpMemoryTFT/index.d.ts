/**
 * @packageDocumentation
 * @module Parts.SharpMemoryTFT
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { PeripheralSPI } from '../../../obniz/libs/io_peripherals/spi';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface SharpMemoryTFTOptions {
    vcc?: number;
    gnd?: number;
    vcc_a?: number;
    gnd_a?: number;
    sclk: number;
    mosi: number;
    cs: number;
    disp?: number;
    extcomin?: number;
    extmode?: number;
    width: number;
    height: number;
}
export default class SharpMemoryTFT implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    commands: {
        write: number;
        clear: number;
        vcom: number;
    };
    _canvas: any;
    obniz: Obniz;
    io_cs: PeripheralIO;
    params: any;
    io_disp?: PeripheralIO;
    io_extcomin?: PeripheralIO;
    io_extmode?: PeripheralIO;
    spi: PeripheralSPI;
    width: number;
    height: number;
    _pos: {
        x: number;
        y: number;
    };
    autoFlush: boolean;
    fontSize: number;
    createCanvas: any;
    constructor();
    wired(obniz: Obniz): void;
    _reverseBits(data: number): number;
    sendLSB(data: number): void;
    sendClear(): void;
    raw(rawData: number[]): void;
    _reset(): void;
    warnCanvasAvailability(): void;
    _preparedCanvas(): any;
    _ctx(): CanvasRenderingContext2D;
    font(font: string, size: number): void;
    clear(): void;
    pos(x: number, y: number): {
        x: number;
        y: number;
    };
    print(text: string): void;
    line(x_0: number, y_0: number, x_1: number, y_1: number): void;
    rect(x: number, y: number, width: number, height: number, mustFill: boolean): void;
    circle(x: number, y: number, r: number, mustFill: boolean): void;
    draw(ctx: CanvasRenderingContext2D): void;
    drawing(autoFlush: boolean): void;
    private _draw;
}
