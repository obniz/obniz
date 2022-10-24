/**
 * @packageDocumentation
 * @module Parts.Grove_SHT35Sensor
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Grove_SHT35SensorOptionsA {
    gnd?: number;
    vcc?: number;
    sda: number;
    scl: number;
}
interface Grove_SHT35SensorOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_SHT35SensorOptions = Grove_SHT35SensorOptionsA | Grove_SHT35SensorOptionsB;
export default class Grove_SHT35Sensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: any;
    displayIoNames: any;
    params: any;
    protected obniz: Obniz;
    private vcc?;
    private gnd?;
    private i2c;
    private SHT35_IIC_ADDR;
    private CMD_SOFT_RST;
    private HIGH_REP_WITH_STRCH;
    private NO_ERROR;
    private ERROR_PARAM;
    private ERROR_COMM;
    private ERROR_OTHERS;
    private launched;
    constructor();
    wired(obniz: Obniz): void;
    readMeasDataSingleShotWait(cfg_cmd: any): Promise<{
        temperature: number;
        humidity: number;
    }>;
    sendCommandWait(cmd: any): Promise<void>;
    getAllWait(): Promise<{
        temperature: number;
        humidity: number;
    }>;
}
export {};
