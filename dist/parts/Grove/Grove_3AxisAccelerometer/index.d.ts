export = Grove_3AxisAccelerometer;
declare class Grove_3AxisAccelerometer {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    displayIoNames: {
        sda: string;
        scl: string;
    };
    address: number;
    regAdrs: {};
    constVal: {};
    wired(obniz: any): Promise<void>;
    obniz: any;
    vcc: any;
    gnd: any;
    i2c: any;
    setRegisterBit(regAddr: any, bitPos: any, state: any): Promise<void>;
    setInterruptMapping(interruptBit: any, interruptPin: any): Promise<void>;
    setInterrupt(interruptBit: any, state: any): Promise<void>;
    signHandling(val: any): any;
    getRawVal(): Promise<number[]>;
    getWait(): Promise<number[]>;
}
