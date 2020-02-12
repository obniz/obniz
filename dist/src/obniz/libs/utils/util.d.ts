/**
 * @packageDocumentation
 * @ignore
 */
declare class ObnizUtil {
    static _keyFilter(params: any, keys: any): any;
    /**
     *
     * @return {String} key name of not found.
     */
    static _requiredKeys(params: any, keys: any): any;
    static dataArray2string(data: any): any;
    static string2dataArray(str: any): any[];
    obniz: any;
    width: any;
    height: any;
    createCanvas: any;
    constructor(obniz: any);
    createCanvasContext(width: any, height: any): any;
}
export default ObnizUtil;
