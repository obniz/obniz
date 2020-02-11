import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface AK8963Options {
    gnd?: number;
    vcc?: number;
    sda?: number;
    scl?: number;
    i2c?: PeripheralI2C;
    address?: number;
    adb_cycle?: number;
}
/**
 * @category Parts
 */
export default class AK8963 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    private _address;
    private i2c;
    private _adc_cycle;
    constructor();
    wired(obniz: Obniz): void;
    setConfig(ADC_cycle: number): void;
    getWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
    char2short(valueH: number, valueL: number): number;
}
