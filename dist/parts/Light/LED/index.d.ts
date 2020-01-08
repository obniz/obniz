export = LED;
declare class LED {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    io_anode: any;
    io_cathode: any;
    animationName: string | undefined;
    on(): void;
    off(): void;
    output(value: any): void;
    endBlink(): void;
    blink(interval: any): void;
}
