export = InfraredLED;
declare class InfraredLED {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    dataSymbolLength: number;
    wired(obniz: any): void;
    obniz: any;
    io_cathode: any;
    pwm: any;
    send(arr: any): void;
}
