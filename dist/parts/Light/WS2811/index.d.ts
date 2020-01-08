export = WS2811;
declare class WS2811 {
    static info(): {
        name: string;
    };
    static _generateFromByte(val: any): number[];
    static _generateColor(r: any, g: any, b: any): number[];
    static _generateHsvColor(h: any, s: any, v: any): number[];
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    spi: any;
    rgb(r: any, g: any, b: any): void;
    hsv(h: any, s: any, v: any): void;
    rgbs(array: any): void;
    hsvs(array: any): void;
}
