import i2cParts, { I2cPartsAbstructOptions } from "../../i2cParts";
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface MPU6886Options extends I2cPartsAbstructOptions {
}
export default class MPU6886 extends i2cParts implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    commands: any;
    write: any;
    params: any;
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
    init(): void;
    setConfig(accelerometer_range: number, gyroscope_range: number): void;
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
