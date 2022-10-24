/**
 * @packageDocumentation
 * @module Parts.WS2812B
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface WS2812BOptions {
    din: number;
    vcc?: number;
    gnd?: number;
}
export default class WS2812B implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    private static _generateFromByte;
    private static _generateColor;
    private static _generateHsvColor;
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    private spi;
    constructor();
    wired(obniz: Obniz): void;
    rgb(red: number, green: number, blue: number): void;
    hsv(hue: number, saturation: number, value: number): void;
    rgbs(array: [number, number, number][]): void;
    hsvs(array: [number, number, number][]): void;
}
