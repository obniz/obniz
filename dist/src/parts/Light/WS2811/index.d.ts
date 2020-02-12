/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../obniz";
import PeripheralSPI from "../../../obniz/libs/io_peripherals/spi";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface WS2811Options {
    gnd?: number;
    vcc?: number;
    din: number;
}
/**
 * @category Parts
 */
export default class WS2811 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    private static _generateFromByte;
    private static _generateColor;
    private static _generateHsvColor;
    keys: string[];
    requiredKeys: string[];
    params: any;
    spi: PeripheralSPI;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    rgb(red: number, green: number, blue: number): void;
    hsv(hue: number, saturation: number, value: number): void;
    rgbs(array: Array<[number, number, number]>): void;
    hsvs(array: Array<[number, number, number]>): void;
}
