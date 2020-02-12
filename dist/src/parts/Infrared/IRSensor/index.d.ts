/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface IRSensorOptions {
    output: number;
    vcc?: number;
    gnd?: number;
}
/**
 * @category Parts
 */
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
    start(callback: (array: number[]) => void): void;
}
