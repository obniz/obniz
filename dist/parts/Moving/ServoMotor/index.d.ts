export = ServoMotor;
declare class ServoMotor {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: any[];
    range: {
        min: number;
        max: number;
    };
    wired(obniz: any): void;
    obniz: any;
    io_vcc: any;
    pwm: any;
    pwm_io_num: any;
    angle(ratio: any): void;
    on(): void;
    off(): void;
}
