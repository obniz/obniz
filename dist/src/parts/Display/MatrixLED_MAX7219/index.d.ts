/**
 * @packageDocumentation
 * @module Parts.MatrixLED_MAX7219
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { PeripheralSPI } from '../../../obniz/libs/io_peripherals/spi';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface MatrixLED_MAX7219Options {
    clk: number;
    cs: number;
    din: number;
    gnd?: number;
    vcc?: number;
}
export default class MatrixLED_MAX7219 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    cs: PeripheralIO;
    params: any;
    spi: PeripheralSPI;
    obniz: Obniz;
    width: number;
    height: number;
    vram: number[][];
    constructor();
    wired(obniz: Obniz): void;
    init(width: number, height: number): void;
    initModule(): void;
    test(): void;
    passingCommands(): void;
    brightness(val: number): void;
    preparevram(width: number, height: number): void;
    write(data: number[]): void;
    writeVram(): void;
    clear(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
