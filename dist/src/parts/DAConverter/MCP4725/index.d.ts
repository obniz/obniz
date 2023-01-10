/**
 * @packageDocumentation
 * @module Parts.MCP4725
 */
import Obniz from '../../../obniz';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../i2cParts';
export declare type MCP4725Options = I2cPartsAbstractOptions;
export default class MCP4725 implements ObnizPartsInterface {
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
    private _vcc_voltage;
    constructor();
    wired(obniz: Obniz): void;
    setVCCVoltage(voltage: number): void;
    setVoltage(voltage: number, writeEEPROM?: boolean): void;
}
