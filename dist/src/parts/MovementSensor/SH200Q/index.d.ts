import i2cParts from "../../i2cParts";
declare class SH200Q extends i2cParts {
    static info(): {
        name: string;
    };
    commands: any;
    readWait: any;
    writeFlagWait: any;
    obniz: any;
    clearFlagWait: any;
    write: any;
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
    initWait(): Promise<void>;
    setConfig(accelerometer_range: any, gyroscope_range: any): void;
    resetAdcWait(): Promise<void>;
    getAllDataWait(): Promise<{
        accelerometer: any;
        temperature: any;
        gyroscope: any;
    }>;
    getTempWait(): Promise<number>;
    getAccelWait(): Promise<any>;
    getGyroWait(): Promise<any>;
}
export default SH200Q;
