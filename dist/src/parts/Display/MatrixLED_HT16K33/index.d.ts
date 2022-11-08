/**
 * @packageDocumentation
 * @module Parts.MatrixLED_HT16K33
 */
import Obniz from '../../../obniz';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../i2cParts';
export declare type MatrixLED_HT16K33Options = I2cPartsAbstractOptions;
export default class MatrixLED_HT16K33 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    address: any;
    width: number;
    height: number;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    protected vram: number[];
    private command;
    private blink_mode;
    constructor();
    wired(obniz: Obniz): void;
    init(width: number): void;
    blinkRate(val: number): void;
    brightness(val: number): void;
    clear(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    dots(data: number[]): void;
    protected writeVram(): void;
    private prepareVram;
}
