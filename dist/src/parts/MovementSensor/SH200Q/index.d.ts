/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../obniz";
import i2cParts, { I2cPartsAbstructOptions } from "../../i2cParts";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface SH200QOptions extends I2cPartsAbstructOptions {
}
/**
 * @category Parts
 */
export default class SH200Q extends i2cParts implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    commands: any;
    writeFlagWait: any;
    clearFlagWait: any;
    write: any;
    char2short: any;
    protected obniz: Obniz;
    private _accel_range;
    private _gyro_range;
    constructor();
    wired(obniz: Obniz): void;
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    whoamiWait(): Promise<number>;
    initWait(): Promise<void>;
    setConfig(accelerometer_range: number, gyroscope_range: number): void;
    resetAdcWait(): Promise<void>;
    getAllDataWait(): Promise<{
        accelerometer: {
            x: number;
            y: number;
            z: number;
        };
        temperature: number;
        gyroscope: {
            x: number;
            y: number;
            z: number;
        };
    }>;
    getTempWait(): Promise<number>;
    getAccelWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
    getGyroWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
}
