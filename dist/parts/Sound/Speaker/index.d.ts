export = Speaker;
declare class Speaker {
    static info(): {
        name: string;
    };
    constructor(obniz: any);
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    pwm: any;
    play(freq: any): void;
    stop(): void;
}
