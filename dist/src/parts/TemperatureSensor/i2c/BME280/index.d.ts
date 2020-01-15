import Obniz from "../../../../obniz";
import ObnizPartsInterface from "../../../../obniz/ObnizPartsInterface";
export interface BME280Options {
}
declare class BME280 implements ObnizPartsInterface {
    static info(): {
        name: string;
        datasheet: string;
    };
    requiredKeys: string[];
    keys: string[];
    ioKeys: string[];
    configration: any;
    commands: any;
    obniz: Obniz;
    params: any;
    io_csb: any;
    address: any;
    io_sdo: any;
    i2c: any;
    _calibrated: any;
    _t_fine: any;
    constructor();
    wired(obniz: Obniz): void;
    config(): Promise<void>;
    setIIRStrength(strengh: any): Promise<void>;
    applyCalibration(): Promise<void>;
    _readSigned16(value: any): any;
    _readSigned8(value: any): any;
    write(data: any): void;
    getData(): Promise<any>;
    getAllWait(): Promise<{
        temperature: any;
        humidity: any;
        pressure: any;
    }>;
    calibration_T(adc_T: any): any;
    calibration_P(adc_P: any): any;
    calibration_H(adc_H: any): any;
    getTempWait(): Promise<any>;
    getHumdWait(): Promise<any>;
    getPressureWait(): Promise<any>;
    getAltitudeWait(): Promise<number>;
    calcAltitude(pressure: any, seaLevel?: any): number;
}
export default BME280;
