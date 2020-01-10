declare class Speaker {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    params: any;
    pwm: any;
    constructor(obniz: any);
    wired(obniz: any): void;
    play(freq: any): void;
    stop(): void;
}
export default Speaker;
