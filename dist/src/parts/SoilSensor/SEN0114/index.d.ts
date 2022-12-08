/**
 * @packageDocumentation
 * @module Parts.SEN0114
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface SEN0114Options {
    vcc?: number;
    output: number;
    gnd?: number;
}
export default class SEN0114 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    value: any;
    onchange?: (value: number) => void;
    protected obniz: Obniz;
    private ad;
    constructor();
    wired(obniz: Obniz): void;
    getHumidityWait(): Promise<number>;
}
