/**
 * @packageDocumentation
 * @module Parts.Grove_SoilMoistureSensor
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
interface Grove_SoilMoistureSensorOptionsA {
    vcc?: number;
    gnd?: number;
    signal: number;
}
interface Grove_SoilMoistureSensorOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_SoilMoistureSensorOptions = Grove_SoilMoistureSensorOptionsA | Grove_SoilMoistureSensorOptionsB;
export default class Grove_SoilMoistureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    ad: PeripheralAD;
    protected obniz: Obniz;
    constructor();
    onchange(value: number): void;
    wired(obniz: Obniz): void;
    getWait(): Promise<number>;
}
export {};
