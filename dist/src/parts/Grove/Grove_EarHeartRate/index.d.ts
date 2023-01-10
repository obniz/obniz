/**
 * @packageDocumentation
 * @module Parts.Grove_EarHeartRate
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Grove_EarHeartRateOptionsA {
    signal: number;
    gnd?: number;
    vcc?: number;
}
interface Grove_EarHeartRateOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_EarHeartRateOptions = Grove_EarHeartRateOptionsA | Grove_EarHeartRateOptionsB;
export default class Grove_EarHeartRate implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    displayIoNames: {
        vcc: string;
        gnd: string;
        signal: string;
    };
    params: any;
    signal: any;
    interval: number;
    duration: number;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    start(callback: (rate: number) => void): void;
    getWait(): Promise<number>;
}
export {};
