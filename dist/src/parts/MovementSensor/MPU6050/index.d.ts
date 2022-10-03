/**
 * @packageDocumentation
 * @module Parts.MPU6050
 */
import Obniz from '../../../obniz';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import I2cImu6, { accelRange, gyroRange, I2cImu6AbstractOptions, Inertia6, Xyz } from '../../i2cImu6';
import { I2cInfo } from '../../i2cParts';
export declare type MPU6050Options = I2cImu6AbstractOptions;
export default class MPU6050 extends I2cImu6 {
    static info(): ObnizPartsInfo;
    protected static commands: any;
    i2cinfo: I2cInfo;
    constructor();
    calcTemp(data?: number | null): number | null;
    wired(obniz: Obniz): void;
    init(): void;
    sleepWait(): Promise<void>;
    wakeWait(): Promise<void>;
    resetWait(): Promise<void>;
    configDlpfWait(): Promise<void>;
    bypassMagnetometerWait(flag?: boolean): Promise<void>;
    whoamiWait(): Promise<number>;
    getAccelAdcWait(): Promise<Xyz>;
    getGyroAdcWait(): Promise<Xyz>;
    getTempAdcWait(): Promise<number>;
    getAllAdcWait(): Promise<Inertia6>;
    setAccelRange(accel_range: accelRange): void;
    setGyroRange(gyro_range: gyroRange): void;
    setConfig(accelerometer_range: number, gyroscope_range: number, ADC_cycle?: any): void;
}
