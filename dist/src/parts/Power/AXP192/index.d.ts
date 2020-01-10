declare class AXP192 {
    static info(): {
        name: string;
    };
    requiredKeys: any;
    keys: any;
    params: any;
    i2c: any;
    readWait: any;
    constructor();
    wired(obniz: any): void;
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
