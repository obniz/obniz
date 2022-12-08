/**
 * @packageDocumentation
 * @module Parts.InfraredLED
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface InfraredLEDOptions {
    anode: number;
    cathode?: number;
}
export default class InfraredLED implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    dataSymbolLength: number;
    params: any;
    protected obniz: Obniz;
    private io_cathode?;
    private pwm;
    constructor();
    wired(obniz: Obniz): void;
    send(data: (0 | 1)[]): void;
}
