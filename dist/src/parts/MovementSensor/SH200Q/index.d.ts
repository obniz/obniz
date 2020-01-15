import i2cParts from "../../i2cParts";
import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface SH200QOptions {
}
declare class SH200Q extends i2cParts implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    commands: any;
    writeFlagWait: any;
    obniz: Obniz;
    clearFlagWait: any;
    write: any;
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
    initWait(): Promise<void>;
    setConfig(accelerometer_range: any, gyroscope_range: any): void;
    resetAdcWait(): Promise<void>;
    getAllDataWait(): Promise<{
        accelerometer: any;
        temperature: any;
        gyroscope: any;
    }>;
    getTempWait(): Promise<number>;
    getAccelWait(): Promise<any>;
    getGyroWait(): Promise<any>;
}
export default SH200Q;
