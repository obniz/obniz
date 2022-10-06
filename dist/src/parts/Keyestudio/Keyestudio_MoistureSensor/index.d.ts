/**
 * @packageDocumentation
 * @module Parts.Keyestudio_MoistureSensor
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Keyestudio_MoistureSensorOptions {
    vcc?: number;
    signal: number;
    gnd?: number;
}
export default class Keyestudio_MoistureSensor implements ObnizPartsInterface {
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
