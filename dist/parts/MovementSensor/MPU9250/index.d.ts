export = MPU9250;
declare class MPU9250 {
    static info(): {
        name: string;
    };
    constructor(obniz: any);
    keys: string[];
    required: any[];
    wired(obniz: any): void;
    obniz: any;
    _address: any;
    i2c: any;
    mpu6050: any;
    ak8963: any;
    setConfig(accel_range: any, gyro_range: any, ADC_cycle: any): void;
    _getAK8963Wait(): Promise<any>;
    getAllWait(): Promise<any>;
    getCompassWait(): Promise<any>;
    getAccelerometerWait(): Promise<any>;
    getGyroscopeWait(): Promise<any>;
}
