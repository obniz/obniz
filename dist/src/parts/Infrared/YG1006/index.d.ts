/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface YG1006Options {
    signal: number;
    vcc?: number;
    gnd?: number;
}
/**
 * @category Parts
 */
export default class YG1006 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onchange: ((value: number) => void) | null;
    protected obniz: Obniz;
    private signal;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<number>;
}
