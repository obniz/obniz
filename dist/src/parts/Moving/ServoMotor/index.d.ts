declare class ServoMotor {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    range: any;
    obniz: any;
    params: any;
    io_vcc: any;
    pwm: any;
    pwm_io_num: any;
    constructor();
    wired(obniz: any): void;
    angle(ratio: any): void;
    on(): void;
    off(): void;
}
export default ServoMotor;
