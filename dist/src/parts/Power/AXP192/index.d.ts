/**
 * @packageDocumentation
 * @module Parts.AXP192
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../../parts/i2cParts';
export declare type AXP192Options = I2cPartsAbstractOptions;
export default class AXP192 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    protected i2c: any;
    constructor();
    wired(obniz: Obniz): void;
    set(address: number, data: number): void;
    getWait(address: number): Promise<any>;
    /**
     * @deprecated
     * @param voltage
     */
    setLDO2Voltage(voltage: number): Promise<void>;
    setLDO2VoltageWait(voltage: number): Promise<void>;
    /**
     * @deprecated
     * @param voltage
     */
    setLDO3Voltage(voltage: number): void;
    setLDO3VoltageWait(voltage: number): Promise<void>;
    set3VLDO2_3(): void;
    enableLDO2_3(): void;
    /**
     * @deprecated
     * @param val
     */
    toggleLDO2(val: number): Promise<void>;
    toggleLDO2Wait(val: number): Promise<void>;
    /**
     * @deprecated
     * @param val
     */
    toggleLDO3(val: number): Promise<void>;
    toggleLDO3Wait(val: number): Promise<void>;
    initM5StickC(): void;
    getVbat(): Promise<any>;
    getVbatWait(): Promise<any>;
}
