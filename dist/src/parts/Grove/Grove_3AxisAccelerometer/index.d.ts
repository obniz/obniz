declare class Grove_3AxisAccelerometer {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    ioKeys: any;
    displayName: any;
    displayIoNames: any;
    address: any;
    regAdrs: any;
    constVal: any;
    obniz: any;
    vcc: any;
    params: any;
    gnd: any;
    i2c: any;
    etRegisterBit: any;
    constructor();
    wired(obniz: any): Promise<void>;
    setRegisterBit(regAddr: any, bitPos: any, state: any): Promise<void>;
    setInterruptMapping(interruptBit: any, interruptPin: any): Promise<void>;
    setInterrupt(interruptBit: any, state: any): Promise<void>;
    signHandling(val: any): any;
    getRawVal(): Promise<any>;
    getWait(): Promise<any>;
}
export default Grove_3AxisAccelerometer;
