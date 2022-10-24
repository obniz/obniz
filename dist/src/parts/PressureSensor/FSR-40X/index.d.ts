/**
 * @packageDocumentation
 * @module Parts.FSR40X
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface FSR40XOptions {
    pin0: number;
    pin1: number;
}
export default class FSR40X implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    pressure: number;
    onchange?: (temp: number) => void;
    protected obniz: Obniz;
    private io_pwr;
    private ad;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<number>;
}
