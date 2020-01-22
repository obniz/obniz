import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstructOptions } from "../../i2cParts";
import BMP280 from "../../PressureSensor/BMP280";
import SHT20 from "../../TemperatureSensor/i2c/SHT20";
export interface YunHatOptions extends I2cPartsAbstructOptions {
}
export default class YunHat implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    private static _generateHsvColor;
    requiredKeys: string[];
    keys: string[];
    params: any;
    ioKeys: string[];
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    protected sht20: SHT20;
    protected bmp280: BMP280;
    private LED_LEN;
    constructor();
    wired(obniz: Obniz): void;
    rgb(red: number, green: number, blue: number): void;
    hsv(hue: number, saturation: number, value: number): void;
    rgbs(array: Array<[number, number, number]>): void;
    hsvs(array: Array<[number, number, number]>): void;
    getLightWait(): Promise<number>;
    getTempWait(): Promise<number>;
    getHumidWait(): Promise<number>;
    getPressureWait(): Promise<number>;
}
