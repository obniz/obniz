/**
 * @packageDocumentation
 * @module Parts.Grove_EARTHOptionsA
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Grove_EARTHOptionsA {
    vcc?: number;
    aout: number;
    dout: number;
    gnd?: number;
}
interface Grove_EARTHOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_EARTHOptions = Grove_EARTHOptionsA | Grove_EARTHOptionsB;
export default class Grove_EARTH implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    value: any;
    onchange?: (value: number) => void;
    protected obniz: Obniz;
    private ad;
    private io;
    constructor();
    wired(obniz: Obniz): void;
    getHumidityWait(): Promise<number>;
    getDigitalHumidityWait(): Promise<boolean>;
}
export {};
