import i2cParts, { I2cPartsAbstractOptions } from "./i2cParts";

export type accelRange = "2g" | "4g" | "8g" | "16g";
export type gyroRange = "250dps" | "500dps" | "1000dps" | "2000dps";
export type accelUnit = "g" | "mg" | "m_s2";
export type gyroUnit = "dps" | "rps";

export interface Xyz { x: number; y: number; z: number; }
export interface Inertia6 { accel: Xyz; gyro: Xyz; compass?: Xyz; temp?: number; }

export interface I2cImu6AbstractOptions extends I2cPartsAbstractOptions {
}

export default abstract class I2cImu6Abstract extends i2cParts {

    public static _accelS(value: number, accel_so: accelRange, accel_sf: accelUnit): number {
        return value / I2cImu6Abstract.scales.accel.so[accel_so] * I2cImu6Abstract.scales.accel.sf[accel_sf];
    }

    public static _gyroS(value: number, gyro_so: gyroRange, gyro_sf: gyroUnit): number {
        return value / I2cImu6Abstract.scales.gyro.so[gyro_so] * I2cImu6Abstract.scales.gyro.sf[gyro_sf];
    }
    // d/so*sf
    protected static scales = {
        accel: {
            so: {
                "2g": 16384,  // 1 / 16384 ie. 0.061 mg / digit
                "4g": 8192,   //  1 / 8192 ie. 0.122 mg / digit
                "8g": 4096,   // 1 / 4096 ie. 0.244 mg / digit
                "16g": 2048,  // 1 / 2048 ie. 0.488 mg / digit
            },
            sf: {
                m_s2: 9.80665,
                g: 1,
                mg: 1000,
            },
        },
        gyro: {
            so: {
                "125dps": 262.144, // 32768/125
                "250dps": 131.072, // 32768/250
                "500dps": 65.536,
                "1000dps": 32.768,
                "2000dps": 16.384,
            },
            sf: {
                dps: 1,
                rps: 0.01745329251, // 1 rad/s is 57.295779578552 deg/s
            },
        },
    };

    protected accel_so: accelRange = "2g";
    protected gyro_so: gyroRange = "250dps";
    protected accel_sf: accelUnit = "g";
    protected gyro_sf: gyroUnit = "dps";
    public abstract async whoamiWait(): Promise<number>;
    public abstract async getAccelWait(): Promise<Xyz>;
    public abstract async getGyroWait(): Promise<Xyz>;
    public abstract async getAllWait(): Promise<Inertia6>;
    public abstract async getTempWait(): Promise<number>;

    public abstract setAccelRange(accel_range: accelRange): void;
    public abstract setGyroRange(gyro_range: gyroRange): void;

    public getAccelRange(): accelRange {
        return this.accel_so;
    } public getGyroRange(): gyroRange {
        return this.gyro_so;
    } public getAccelUnit(): accelUnit {
        return this.accel_sf;
    } public getGyroUnit(): gyroUnit {
        return this.gyro_sf;
    } public setAccelUnit(accel_unit: accelUnit): void {
        if (accel_unit in I2cImu6Abstract.scales.accel.sf) {
            this.accel_sf = accel_unit;
        } else {
            throw new Error(`Invalid accel unit. Valid values are: ${Object.keys(I2cImu6Abstract.scales.accel.sf).join()}`);
        }
    }
    public setGyroUnit(gyro_unit: gyroUnit): void {
        if (gyro_unit in I2cImu6Abstract.scales.gyro.sf) {
            this.gyro_sf = gyro_unit;
        } else {
            throw new Error(`Invalid gyro unit. Valid values are: ${Object.keys(I2cImu6Abstract.scales.gyro.sf).join()}`);
        }
    }
}
