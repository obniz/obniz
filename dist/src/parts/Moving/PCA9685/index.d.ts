declare class PCA9685 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    address: any;
    _commands: any;
    _regs: any;
    pwmNum: any;
    pwms: any;
    obniz: any;
    params: any;
    io_oe: any;
    i2c: any;
    io_srclr: any;
    chip: any;
    id: any;
    value: any;
    state: any;
    _freq: any;
    constructor();
    wired(obniz: any): void;
    _preparePWM(num: any): void;
    isValidPWM(id: any): boolean;
    getPWM(id: any): any;
    freq(frequency: any): void;
    pulse(id: any, pulse_width: any): void;
    duty(id: any, duty: any): void;
    writeSingleONOFF(id: any, on: any, off: any): void;
    setEnable(enable: any): void;
}
export default PCA9685;
