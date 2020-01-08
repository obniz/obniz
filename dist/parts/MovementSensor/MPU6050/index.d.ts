export = MPU6050;
declare class MPU6050 {
    static info(): {
        name: string;
    };
    keys: string[];
    required: any[];
    wired(obniz: any): void;
    obniz: any;
    _address: any;
    i2c: any;
    setConfig(accelerometer_range: any, gyroscope_range: any): void;
    _accel_range: any;
    _gyro_range: any;
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
    char2short(valueH: any, valueL: any): number;
}
