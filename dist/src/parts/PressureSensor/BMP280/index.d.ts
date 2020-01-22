import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface BMP280Options {
    vio?: number;
    vcore?: number;
    gnd?: number;
    csb?: number;
    sdi?: number;
    sck?: number;
    sdo?: number;
    address?: number;
    i2c?: PeripheralI2C;
}
export default class BMP280 implements ObnizPartsInterface {
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
    setIIRStrength(strengh: any): Promise<void>;
    applyCalibration(): Promise<void>;
    getAllWait(): Promise<{
        temperature: number;
        pressure: number;
    }>;
    getTempWait(): Promise<number>;
    getPressureWait(): Promise<number>;
    getAltitudeWait(): Promise<number>;
    calcAltitude(pressure: number, seaPressure?: number): number;
    private config;
    private _readSigned16;
    private _readSigned8;
    private write;
    private getData;
    private calibration_T;
    private calibration_P;
}
