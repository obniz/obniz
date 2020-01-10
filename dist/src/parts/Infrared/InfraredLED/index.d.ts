declare class InfraredLED {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    dataSymbolLength: any;
    obniz: any;
    params: any;
    io_cathode: any;
    pwm: any;
    constructor();
    wired(obniz: any): void;
    send(arr: any): void;
}
export default InfraredLED;
