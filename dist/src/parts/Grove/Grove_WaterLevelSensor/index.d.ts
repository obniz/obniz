/**
 * @packageDocumentation
 * @module Parts.Grove_WaterLevelSensor
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Grove_WaterLevelSensorOptionsA {
    gnd?: number;
    vcc?: number;
    sda: number;
    scl: number;
}
interface Grove_WaterLevelSensorOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_WaterLevelSensorOptions = Grove_WaterLevelSensorOptionsA | Grove_WaterLevelSensorOptionsB;
export default class Grove_WaterLevelSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: any;
    displayIoNames: any;
    params: any;
    check_interval_ms: number;
    onchange: ((val: number) => void) | null;
    protected obniz: Obniz;
    private vcc?;
    private gnd?;
    private i2c;
    private THRESHOLD;
    private ATTINY1_HIGH_ADDR;
    private ATTINY2_LOW_ADDR;
    private previous_val;
    constructor();
    wired(obniz: Obniz): void;
    initWait(): Promise<void>;
    getWait(): Promise<number>;
}
export {};
