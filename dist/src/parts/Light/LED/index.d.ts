declare class LED {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    io_anode: any;
    params: any;
    io_cathode: any;
    animationName: any;
    constructor();
    wired(obniz: any): void;
    on(): void;
    off(): void;
    output(value: any): void;
    endBlink(): void;
    blink(interval: any): void;
}
export default LED;
