/**
 * @packageDocumentation
 * @module Parts.Grove_EarHeartRate
 */
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Grove_EarHeartRateOptions {
    gnd: number;
    vcc: number;
    signal?: number;
}
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
    interval: number;
    duration: number;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    start(callback: (rate: number) => void): void;
    getWait(): Promise<number>;
}
