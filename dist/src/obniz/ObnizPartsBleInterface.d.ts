/**
 * @packageDocumentation
 * @module ObnizCore
 */
import BleRemotePeripheral from './libs/embeds/bleHci/bleRemotePeripheral';
import { Obniz } from './Obniz';
import ObnizPartsInterface from './ObnizPartsInterface';
export interface ObnizPartsBleInfo {
    name: string;
    datasheet?: any;
}
export default class ObnizPartsBleInterface extends ObnizPartsInterface {
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    wired(obniz: Obniz): void;
    /**
     * Information of parts.
     * name: key name of parts
     */
    static info: () => ObnizPartsBleInfo;
    /**
     * Check founded BleRemotePeripheral is kind of this parts or not
     */
    static isDevice: (peripheral: BleRemotePeripheral) => boolean;
    /**
     * Utility function for reading 2 byte to signed number.
     */
    static signed16FromBinary(high: number, low: number): number;
    /**
     * Utility function for reading 4 byte to signed number.
     */
    static signed32FromBinary(byte3: number, byte2: number, byte1: number, byte0: number): number;
    /**
     * Utility function for reading 1byte fixed point number
     */
    static readFraction(byte: number): number;
    /**
     * Internally Used function for connection required devices
     */
    _peripheral: BleRemotePeripheral | null;
    /**
     * ondisconnect callback function.
     */
    ondisconnect?: (reason: any) => void;
}
