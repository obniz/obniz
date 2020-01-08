export = DCMotor;
declare class DCMotor {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    status: {
        direction: null;
        power: null;
    } | undefined;
    pwm1_io_num: any;
    pwm2_io_num: any;
    pwm1: any;
    pwm2: any;
    forward(): void;
    reverse(): void;
    stop(): void;
    move(forward: any): void;
    power(power: any): null | undefined;
}
