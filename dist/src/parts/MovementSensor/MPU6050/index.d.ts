import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface MPU6050Options {
    gnd?: number;
    vcc?: number;
    sda?: number;
    scl?: number;
    i2c?: PeripheralI2C;
    address?: number;
    accelerometer_range?: number;
    gyroscope_range?: number;
}
/**
 * @category Parts
 */
export default class MPU6050 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    private i2c;
    private _address;
    private _accel_range;
    private _gyro_range;
    constructor();
    wired(obniz: Obniz): void;
    setConfig(accelerometer_range: number, gyroscope_range: number): void;
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
    char2short(valueH: number, valueL: number): number;
}
