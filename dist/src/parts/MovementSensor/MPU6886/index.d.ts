import i2cParts from "../../i2cParts";
declare class MPU6886 extends i2cParts {
    static info(): {
        name: string;
    };
    commands: any;
    readWait: any;
    write: any;
    obniz: any;
    params: any;
    _accel_range: any;
    _gyro_range: any;
    char2short: any;
    constructor();
    wired(obniz: any): void;
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    whoamiWait(): any;
    init(): void;
    setConfig(accelerometer_range: any, gyroscope_range: any): void;
    getAllDataWait(): Promise<{
        accelerometer: any;
        temperature: any;
        gyroscope: any;
    }>;
    getTempWait(): Promise<any>;
    getAccelWait(): Promise<any>;
    getGyroWait(): Promise<any>;
}
export default MPU6886;
