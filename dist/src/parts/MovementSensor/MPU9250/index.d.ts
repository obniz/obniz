import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstructOptions } from "../../i2cParts";
import AK8963 from "../AK8963";
import MPU6050 from "../MPU6050";
/**
 * @category Parts
 */
export interface MPU9250Options extends I2cPartsAbstructOptions {
    gnd?: number;
    vcc?: number;
    address?: number;
}
/**
 * @category Parts
 */
declare class MPU9250 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    _address: any;
    mpu6050: MPU6050;
    ak8963: AK8963;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    setConfig(accel_range: any, gyro_range: any, ADC_cycle: any): void;
    _getAK8963Wait(): Promise<{}>;
    getAllWait(): Promise<{
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
        compass: {
            x: number;
            y: number;
            z: number;
        };
    }>;
    getCompassWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
    getAccelerometerWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
    getGyroscopeWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
}
export default MPU9250;
