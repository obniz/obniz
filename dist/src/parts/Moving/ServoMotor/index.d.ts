import Obniz from "../../../obniz";
import PeripheralPWM from "../../../obniz/libs/io_peripherals/pwm";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface ServoMotorOptions {
    vcc?: number;
    gnd?: number;
    signal?: number;
    pwm?: PeripheralPWM;
}
export default class ServoMotor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    range: {
        min: number;
        max: number;
    };
    protected obniz: Obniz;
    private pwm;
    private pwm_io_num?;
    private io_vcc;
    constructor();
    wired(obniz: Obniz): void;
    angle(ratio: number): void;
    on(): void;
    off(): void;
}
