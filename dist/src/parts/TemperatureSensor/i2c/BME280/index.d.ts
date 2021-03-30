/**
 * @packageDocumentation
 * @module Parts.BME280
 */
import Obniz from "../../../../obniz";
import PeripheralI2C from "../../../../obniz/libs/io_peripherals/i2c";
import PeripheralIO from "../../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
export interface BME280Options {
    vio?: number;
    vcore?: number;
    gnd?: number;
    csb?: number;
    sdi?: number;
    sck?: number;
    sdo?: number;
    address?: number;
    i2c?: any;
}
export default class BME280 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    ioKeys: string[];
    configration: any;
    commands: any;
    params: any;
    io_csb?: PeripheralIO;
    address: any;
    io_sdo?: PeripheralIO;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    private _calibrated;
    private _t_fine;
    constructor();
    wired(obniz: Obniz): void;
    config(): Promise<void>;
    setIIRStrength(strengh: any): Promise<void>;
    applyCalibration(): Promise<void>;
    _readSigned16(value: number): number;
    _readSigned8(value: number): number;
    write(data: any): void;
    getData(): Promise<number[]>;
    getAllWait(): Promise<{
        temperature: number;
        humidity: number;
        pressure: number;
    }>;
    calibration_T(adc_T: any): any;
    calibration_P(adc_P: any): any;
    calibration_H(adc_H: any): any;
    getTempWait(): Promise<number>;
    getHumdWait(): Promise<number>;
    getHumidWait(): Promise<number>;
    getPressureWait(): Promise<number>;
    getAltitudeWait(): Promise<number>;
    calcAltitude(pressure: number, seaPressure?: number): number;
}
