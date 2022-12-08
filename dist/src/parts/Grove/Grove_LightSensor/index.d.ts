/**
 * @packageDocumentation
 * @module Parts.Grove_LightSensor
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
interface Grove_LightSensorOptionsA {
    vcc?: number;
    gnd?: number;
    signal: number;
}
interface Grove_LightSensorOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_LightSensorOptions = Grove_LightSensorOptionsA | Grove_LightSensorOptionsB;
export default class Grove_LightSensor implements ObnizPartsInterface {
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
