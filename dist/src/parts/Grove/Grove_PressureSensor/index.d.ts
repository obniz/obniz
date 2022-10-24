/**
 * @packageDocumentation
 * @module Parts.Grove_PressureSensor
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
interface Grove_PressureSensorOptionsA {
    vcc?: number;
    gnd?: number;
    output: number;
}
interface Grove_PressureSensorOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_PressureSensorOptions = Grove_PressureSensorOptionsA | Grove_PressureSensorOptionsB;
export default class Grove_PressureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    ad: PeripheralAD;
    value?: number;
    protected obniz: Obniz;
    constructor();
    onchange(value: number): void;
    wired(obniz: Obniz): void;
    getWait(): Promise<number>;
}
export {};
