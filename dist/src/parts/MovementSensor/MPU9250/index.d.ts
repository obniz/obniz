declare class MPU9250 {
    static info(): {
        name: string;
    };
    keys: any;
    required: any;
    obniz: any;
    params: any;
    _address: any;
    i2c: any;
    mpu6050: any;
    ak8963: any;
    constructor(obniz: any);
    wired(obniz: any): void;
    setConfig(accel_range: any, gyro_range: any, ADC_cycle: any): void;
    _getAK8963Wait(): Promise<any>;
    getAllWait(): Promise<any>;
    getCompassWait(): Promise<any>;
    getAccelerometerWait(): Promise<any>;
    getGyroscopeWait(): Promise<any>;
}
export default MPU9250;
