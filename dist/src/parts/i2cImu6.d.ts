/**
 * @packageDocumentation
 * @module Parts
 */
import i2cParts, { I2cPartsAbstractOptions } from './i2cParts';
export declare type accelRange = '2g' | '4g' | '8g' | '16g';
export declare type gyroRange = '250dps' | '500dps' | '1000dps' | '2000dps';
export declare type accelUnit = 'g' | 'mg' | 'm_s2';
export declare type gyroUnit = 'dps' | 'rps';
export interface Xyz {
    x: number;
    y: number;
    z: number;
}
export interface Inertia6 {
    accelerometer: Xyz;
    gyroscope: Xyz;
    compass?: Xyz;
    temperature?: number | null;
}
export declare type I2cImu6AbstractOptions = I2cPartsAbstractOptions;
export default abstract class I2cImu6Abstract extends i2cParts {
    protected static scales: {
        accel: {
            so: {
                '2g': number;
                '4g': number;
                '8g': number;
                '16g': number;
            };
            sf: {
                m_s2: number;
                g: number;
                mg: number;
            };
        };
        gyro: {
            so: {
                '125dps': number;
                '250dps': number;
                '500dps': number;
                '1000dps': number;
                '2000dps': number;
            };
            sf: {
                dps: number;
                rps: number;
            };
        };
    };
    private static _accelS;
    private static _gyroS;
    protected accel_so: accelRange;
    protected gyro_so: gyroRange;
    protected accel_sf: accelUnit;
    protected gyro_sf: gyroUnit;
    abstract whoamiWait(): Promise<number>;
    abstract calcTemp(data?: number | null): number | null;
    abstract getAccelAdcWait(): Promise<Xyz>;
    abstract getGyroAdcWait(): Promise<Xyz>;
    abstract getTempAdcWait(): Promise<number>;
    abstract getAllAdcWait(): Promise<Inertia6>;
    getAccelWait(): Promise<Xyz>;
    getGyroWait(): Promise<Xyz>;
    getTempWait(): Promise<number | null>;
    getAllWait(): Promise<Inertia6>;
    getAccelArrayWait(): Promise<number[]>;
    getGyroArrayWait(): Promise<number[]>;
    getAllArrayWait(): Promise<any[]>;
    getAccelAdcArrayWait(): Promise<number[]>;
    getGyroAdcArrayWait(): Promise<number[]>;
    getAllAdcArrayWait(): Promise<any[]>;
    abstract setAccelRange(accel_range: accelRange): void;
    abstract setGyroRange(gyro_range: gyroRange): void;
    getAccelerometerWait(): Promise<Xyz>;
    getGyroscopeWait(): Promise<Xyz>;
    getWait(): Promise<Inertia6>;
    getAllDataWait(): Promise<Inertia6>;
    getAccelRange(): accelRange;
    getGyroRange(): gyroRange;
    getAccelUnit(): accelUnit;
    getGyroUnit(): gyroUnit;
    setAccelUnit(accel_unit: accelUnit): void;
    setGyroUnit(gyro_unit: gyroUnit): void;
    private calcAccel;
    private calcGyro;
}
