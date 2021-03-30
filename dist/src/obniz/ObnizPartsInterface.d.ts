/**
 * @packageDocumentation
 * @module ObnizCore
 */
import Obniz from "./index";
export interface ObnizPartsInfo {
    name: string;
    datasheet?: any;
}
export default abstract class ObnizPartsInterface {
    static info: () => ObnizPartsInfo;
    abstract keys: string[];
    abstract requiredKeys: string[];
    abstract ioKeys?: string[];
    params: any;
    abstract wired(obniz: Obniz): void;
}
