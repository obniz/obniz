import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface MPU9250Options {
}
declare class MPU9250 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    _address: any;
    i2c: any;
    mpu6050: any;
    ak8963: any;
    constructor(obniz: any);
    wired(obniz: Obniz): void;
    setConfig(accel_range: any, gyro_range: any, ADC_cycle: any): void;
    _getAK8963Wait(): Promise<any>;
    getAllWait(): Promise<any>;
    getCompassWait(): Promise<any>;
    getAccelerometerWait(): Promise<any>;
    getGyroscopeWait(): Promise<any>;
}
export default MPU9250;
