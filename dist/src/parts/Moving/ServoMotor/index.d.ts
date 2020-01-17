import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface ServoMotorOptions {
}
declare class ServoMotor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    range: any;
    obniz: Obniz;
    params: any;
    io_vcc: any;
    pwm: any;
    pwm_io_num: any;
    constructor();
    wired(obniz: Obniz): void;
    angle(ratio: any): void;
    on(): void;
    off(): void;
}
export default ServoMotor;
