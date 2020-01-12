import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface DCMotorOptions {
    forward: number;
    back: number;
}
declare class DCMotor implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    status: any;
    pwm1_io_num: any;
    params: any;
    pwm2_io_num: any;
    pwm1: any;
    pwm2: any;
    constructor();
    wired(obniz: any): void;
    forward(): void;
    reverse(): void;
    stop(): void;
    move(forward: any): void;
    power(power?: any): any;
}
export default DCMotor;
