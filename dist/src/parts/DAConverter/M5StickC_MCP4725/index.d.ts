import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface M5StickC_MCP4725Options {
    vcc?: number;
    gnd?: number;
    sda: number;
    scl: number;
}
export default class M5StickC_AMDP4725 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    address: number;
    cmd: {
        WRITEDAC: number;
        WRITEDACEEPROM: number;
    };
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    setVoltage(voltage: number, writeEEPROM?: boolean): void;
}
