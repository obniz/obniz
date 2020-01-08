export = BME280;
declare class BME280 {
    static info(): {
        name: string;
        datasheet: string;
    };
    requiredKeys: any[];
    keys: string[];
    ioKeys: string[];
    configration: {
        sampling: {
            temp: number;
            hum: number;
            pres: number;
        };
        interval: number;
        iir_strength: number;
        mode: number;
        Modes: {
            sleep: number;
            forced: number;
            normal: number;
        };
    };
    commands: {};
    wired(obniz: any): void;
    obniz: any;
    io_csb: any;
    address: number | undefined;
    io_sdo: any;
    i2c: any;
    config(): Promise<void>;
    setIIRStrength(strengh: any): Promise<void>;
    applyCalibration(): Promise<void>;
    _calibrated: {
        dig_T1: number;
        dig_T2: any;
        dig_T3: any;
        dig_P1: number;
        dig_P2: any;
        dig_P3: any;
        dig_P4: any;
        dig_P5: any;
        dig_P6: any;
        dig_P7: any;
        dig_P8: any;
        dig_P9: any;
        dig_H1: any;
        dig_H2: any;
        dig_H3: any;
        dig_H4: any;
        dig_H5: any;
        dig_H6: any;
    } | undefined;
    _t_fine: number | undefined;
    _readSigned16(value: any): any;
    _readSigned8(value: any): any;
    write(data: any): void;
    getData(): Promise<any>;
    getAllWait(): Promise<{
        temperature: number;
        humidity: number;
        pressure: number;
    }>;
    calibration_T(adc_T: any): number;
    calibration_P(adc_P: any): number;
    calibration_H(adc_H: any): number;
    getTempWait(): Promise<number>;
    getHumdWait(): Promise<number>;
    getPressureWait(): Promise<number>;
    getAltitudeWait(): Promise<number>;
    calcAltitude(pressure: any, seaLevel?: number): number;
}
