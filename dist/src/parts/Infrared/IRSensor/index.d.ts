/**
 * @packageDocumentation
 * @module Parts.IRSensor
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface IRSensorOptions {
    output: number;
    vcc?: number;
    gnd?: number;
}
export default class IRSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    dataSymbolLength: number;
    duration: number;
    dataInverted: boolean;
    triggerSampleCount: number;
    cutTail: boolean;
    output_pullup: boolean;
    ondetect: ((array: number[]) => void) | null;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    start(callback?: (array: number[]) => void): void;
}
