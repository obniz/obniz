import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface AXP192Options {
}
declare class AXP192 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    requiredKeys: string[];
    keys: string[];
    params: any;
    i2c: any;
    constructor();
    wired(obniz: Obniz): void;
    set(address: any, data: any): void;
    getWait(address: any): Promise<any>;
    setLDO2Voltage(voltage: any): Promise<void>;
    setLDO3Voltage(voltage: any): Promise<void>;
    set3VLDO2_3(): void;
    enableLDO2_3(): void;
    toggleLDO2(val: any): Promise<void>;
    toggleLDO3(val: any): Promise<void>;
    initM5StickC(): void;
    getVbat(): Promise<any>;
}
export default AXP192;
