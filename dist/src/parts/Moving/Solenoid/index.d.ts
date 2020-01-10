declare class Solenoid {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    params: any;
    io_gnd: any;
    io_signal: any;
    constructor();
    wired(obniz: any): void;
    on(): void;
    off(): void;
    click(time_msec: any): void;
    doubleClick(time_msec: any): void;
}
export default Solenoid;
