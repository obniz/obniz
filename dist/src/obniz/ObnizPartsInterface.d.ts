import Obniz = require("./index");
/**
 * @category Parts
 */
export interface ObnizPartsInfo {
    name: string;
    datasheet?: any;
}
/**
 * @category Parts
 */
export default abstract class ObnizPartsInterface {
    static info: (() => ObnizPartsInfo);
    abstract keys: string[];
    abstract requiredKeys: string[];
    abstract ioKeys?: string[];
    abstract wired(obniz: Obniz): void;
}
