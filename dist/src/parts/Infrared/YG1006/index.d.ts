/**
 * @packageDocumentation
 * @module Parts.YG1006
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface YG1006Options {
    signal: number;
    vcc?: number;
    gnd?: number;
}
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
