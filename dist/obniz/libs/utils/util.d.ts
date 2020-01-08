declare class ObnizUtil {
    static _keyFilter(params: any, keys: any): {};
    /**
     *
     * @return {String} key name of not found.
     */
    static _requiredKeys(params: any, keys: any): any;
    static dataArray2string(data: number[]): any;
    static string2dataArray(str: string): number[];
    obniz: any;
    width: any;
    height: any;
    createCanvas: any;
    constructor(obniz: any);
    createCanvasContext(width: number, height: number): any;
}
