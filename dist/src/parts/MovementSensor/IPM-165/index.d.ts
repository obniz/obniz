/**
 * @packageDocumentation
 * @module Parts.IPM-165
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface IPM_165Options {
    signal: number;
    vcc?: number;
    gnd?: number;
}
export default class IPM_165 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    signal: PeripheralAD;
    onchange?: (value: number) => void;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<number>;
}
