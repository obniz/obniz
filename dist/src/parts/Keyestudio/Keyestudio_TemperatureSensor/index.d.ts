/**
 * @packageDocumentation
 * @module Parts.Keyestudio_TemperatureSensor
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Keyestudio_TemperatureSensorOptions {
    vcc?: number;
    signal: number;
    gnd?: number;
}
export default class Keyestudio_TemperatureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    drive: any;
    params: any;
    protected obniz: Obniz;
    protected ad: PeripheralAD;
    private temp;
    private temperature;
    private tempArray;
    private sum;
    private init_count;
    private count;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<number>;
    onchange(temp: number): void;
    protected calc(voltage: any): number;
}
