/**
 * @packageDocumentation
 * @module Parts.AnalogTemperatureSensor
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { ObnizPartsInterface } from '../../../obniz/ObnizPartsInterface';
export interface AnalogTemperatureSensorOptions {
    vcc?: number;
    output: number;
    gnd?: number;
}
export default class AnalogTemperatureSensor implements ObnizPartsInterface {
    keys: string[];
    requiredKeys: string[];
    drive: any;
    params: any;
    temp: number;
    protected obniz: Obniz;
    protected ad: PeripheralAD;
    constructor();
    wired(obniz: Obniz): void;
    getWait(): Promise<number>;
    onchange(temp: number): void;
    calc(voltage: any): number;
}
