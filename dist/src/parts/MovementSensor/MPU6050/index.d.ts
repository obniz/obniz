import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface MPU6050Options {
}
declare class MPU6050 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    _address: any;
    i2c: any;
    _accel_range: any;
    _gyro_range: any;
    constructor();
    wired(obniz: Obniz): void;
    setConfig(accelerometer_range: any, gyroscope_range: any): void;
    getWait(): Promise<{
        accelerometer: {
            x: number;
            y: number;
            z: number;
        };
        temp: number;
        gyroscope: {
            x: number;
            y: number;
            z: number;
        };
    }>;
    char2short(valueH: any, valueL: any): any;
}
export default MPU6050;
