export = PCA9685;
declare class PCA9685 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: any[];
    address: number;
    _commands: {
        MODE1: number;
        MODE2: number;
        SUBADR1: number;
        SUBADR2: number;
        SUBADR3: number;
        PRESCALE: number;
        LED0_ON_L: number;
        ALL_LED_ON_L: number;
        bits: {
            ALLCALL: number;
            SLEEP_ENABLE: number;
            AUTO_INCREMENT_ENABLED: number;
            RESTART: number;
            OUTDRV: number;
            INVRT: number;
        };
    };
    _regs: any[];
    pwmNum: number;
    pwms: any[];
    wired(obniz: any): void;
    obniz: any;
    io_oe: any;
    i2c: any;
    io_srclr: any;
    _preparePWM(num: any): void;
    isValidPWM(id: any): boolean;
    getPWM(id: any): any;
    freq(frequency: any): void;
    _freq: any;
    pulse(id: any, pulse_width: any): void;
    duty(id: any, duty: any): void;
    writeSingleONOFF(id: any, on: any, off: any): void;
    setEnable(enable: any): void;
}
