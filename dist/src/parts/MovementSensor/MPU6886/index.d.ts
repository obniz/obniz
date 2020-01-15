import i2cParts from "../../i2cParts";
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface MPU6886Options {
}
declare class MPU6886 extends i2cParts implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    commands: any;
    write: any;
    obniz: Obniz;
    params: any;
    _accel_range: any;
    _gyro_range: any;
    char2short: any;
    constructor();
    wired(obniz: Obniz): void;
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    whoamiWait(): Promise<number>;
    init(): void;
    setConfig(accelerometer_range: any, gyroscope_range: any): void;
    getAllDataWait(): Promise<{
        accelerometer: any;
        temperature: any;
        gyroscope: any;
    }>;
    getTempWait(): Promise<any>;
    getAccelWait(): Promise<any>;
    getGyroWait(): Promise<any>;
}
export default MPU6886;
