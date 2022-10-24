/**
 * @packageDocumentation
 * @module Parts..Grove_DistanceSensor
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import GP2Y0A21YK0F from '../../../parts/DistanceSensor/GP2Y0A21YK0F';
interface Grove_DistanceSensorOptionsA {
    gnd?: number;
    vcc?: number;
    signal: number;
}
interface Grove_DistanceSensorOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_DistanceSensorOptions = Grove_DistanceSensorOptionsA | Grove_DistanceSensorOptionsB;
export default class Grove_DistanceSensor extends GP2Y0A21YK0F {
    static info(): ObnizPartsInfo;
    constructor();
    wired(obniz: Obniz): void;
}
export {};
