/**
 * @packageDocumentation
 * @module Parts.HC-SR505
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface HCSR505Options {
    signal: number;
    vcc?: number;
    gnd?: number;
}
export default class HCSR505 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    io_signal: PeripheralIO;
    onchange?: (value: boolean) => void;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<boolean>;
}
