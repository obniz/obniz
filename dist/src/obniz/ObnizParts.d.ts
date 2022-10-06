/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { BleRemotePeripheral } from './libs/embeds/bleHci/bleRemotePeripheral';
import { Obniz } from './Obniz';
import { ObnizConnection } from './ObnizConnection';
import { ObnizOptions } from './ObnizOptions';
import { ObnizPartsBle } from './ObnizPartsBleAbstract';
import { ObnizPartsInterface } from './ObnizPartsInterface';
import { PartsList, PartsType } from './ObnizPartsList';
import PartsClass = Obniz.PartsClass;
import Parts = Obniz.Parts;
export interface Triaxial {
    x: number;
    y: number;
    z: number;
}
export declare abstract class ObnizParts extends ObnizConnection {
    /**
     * @ignore
     * @private
     */
    static _parts(): any;
    /**
     * Register Parts class
     *
     * @param arg0 Parts class
     * @param arg1 param for parts
     */
    static PartsRegistrate(arg0: typeof ObnizPartsInterface, arg1?: any): void;
    /**
     * Get parts class.
     *
     * @param name string
     * @constructor
     */
    static getPartsClass<K extends PartsType>(name: K): PartsClass<K>;
    constructor(id: string, options?: ObnizOptions);
    /**
     * Check the param is valid io pin no.
     *
     * @param io
     */
    isValidIO(io: any): boolean;
    /**
     * Check the param is valid ad pin no.
     *
     * @param ad
     */
    isValidAD(ad: any): boolean;
    /**
     * Setup Parts of parts library
     *
     * @param partsName
     * @param options
     */
    wired<K extends keyof PartsList>(partsName: K, options?: PartsList[K]['options']): Parts<K>;
    static getBleParts(peripheral: BleRemotePeripheral): ObnizPartsBle<unknown> | null;
}
