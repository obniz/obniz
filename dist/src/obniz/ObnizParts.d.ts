/**
 * @packageDocumentation
 * @module ObnizCore
 */
import ObnizConnection from "./ObnizConnection";
import { ObnizOptions } from "./ObnizOptions";
import ObnizPartsInterface from "./ObnizPartsInterface";
import { PartsList } from "./ObnizPartsList";
export default abstract class ObnizParts extends ObnizConnection {
    /**
     * @ignore
     * @private
     */
    static _parts(): any;
    /**
     * Register Parts class
     * @param arg0 Parts class
     * @param arg1 param for parts
     */
    static PartsRegistrate(arg0: typeof ObnizPartsInterface, arg1?: any): void;
    /**
     * Get parts class.
     * @param name string
     * @constructor
     */
    static getPartsClass<K extends keyof PartsList>(name: K): any;
    constructor(id: string, options?: ObnizOptions);
    /**
     * Check the param is valid io pin no.
     * @param io
     */
    isValidIO(io: any): boolean;
    /**
     * Check the param is valid ad pin no.
     * @param ad
     */
    isValidAD(ad: any): boolean;
    /**
     * Setup Parts of parts library
     *
     * @param partsName
     * @param options
     */
    wired<K extends keyof PartsList>(partsName: K, options?: PartsList[K]["options"]): PartsList[K]["class"];
}
