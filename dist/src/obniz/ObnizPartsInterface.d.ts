/**
 * @packageDocumentation
 * @module ObnizCore
 */
import Obniz from './index';
import { PartsType } from './ObnizPartsList';
export interface ObnizPartsInfo {
    name: string;
    datasheet?: any;
}
export interface ObnizPartsProps {
    info(): ObnizPartsInfo;
    PartsName: PartsType;
}
export declare abstract class ObnizPartsInterface {
    static info: () => ObnizPartsInfo;
    abstract keys: string[];
    abstract requiredKeys: string[];
    abstract ioKeys?: string[];
    params: any;
    abstract wired(obniz: Obniz): void;
}
