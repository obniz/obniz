/**
 * @packageDocumentation
 * @module ObnizCore
 */
export declare class ObnizUtil {
    /**
     * @ignore
     * @param params
     * @param keys
     * @private
     */
    static _keyFilter(params: any, keys: any): {};
    /**
     * @ignore
     * @return {String} key name of not found.
     */
    static _requiredKeys(params: any, keys: any): any;
    /**
     * convert from data array to string
     *
     * @param data
     */
    static dataArray2string(data: Uint8Array | number[]): string | null;
    /**
     * convert from string to data array
     *
     * @param str
     */
    static string2dataArray(str: string): number[];
    /**
     * @ignore
     * @param data
     * @param reverse
     */
    static hexToBinary(data: string, reverse?: boolean): number[];
    /**
     * @ignore
     * @param min
     * @param max
     * @param variable_name
     * @param variable
     */
    static assertNumber(min: number, max: number, variable_name: string, variable: number): void;
    obniz: any;
    width: any;
    height: any;
    createCanvas: any;
    constructor(obniz: any);
    /**
     * This creates a Canvas context.
     * It will add a canvas dom to body(in html).
     *
     * ```javascript
     * // Example
     * const ctx = obniz.util.createCanvasContext(128, 64);
     * ctx.font = "9px sans-serif";
     * ctx.fillText('Hello', 0, 7);
     * ```
     *
     * @param width
     * @param height
     */
    createCanvasContext(width: number, height: number): any;
}
