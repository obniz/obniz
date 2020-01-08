export = SH200Q;
declare class SH200Q {
    static info(): {
        name: string;
    };
    commands: {};
    wired(obniz: any): void;
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    whoamiWait(): any;
    initWait(): Promise<void>;
    setConfig(accelerometer_range: any, gyroscope_range: any): void;
    _accel_range: any;
    _gyro_range: any;
    resetAdcWait(): Promise<void>;
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
