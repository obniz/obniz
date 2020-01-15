import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface WS2812Options {
}
declare class WS2812 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    static _generateFromByte(val: any): any;
    static _generateColor(r: any, g: any, b: any): any;
    static _generateHsvColor(h: any, s: any, v: any): any;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    spi: any;
    constructor();
    wired(obniz: Obniz): void;
    rgb(r: any, g: any, b: any): void;
    hsv(h: any, s: any, v: any): void;
    rgbs(array: any): void;
    hsvs(array: any): void;
}
export default WS2812;
