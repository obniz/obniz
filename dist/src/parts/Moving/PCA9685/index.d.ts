import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface PCA9685Options {
}
declare class PCA9685 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    address: any;
    _commands: any;
    _regs: any;
    pwmNum: any;
    pwms: any;
    obniz: Obniz;
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
    wired(obniz: Obniz): void;
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
