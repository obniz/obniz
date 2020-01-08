export = Solenoid;
declare class Solenoid {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    io_gnd: any;
    io_signal: any;
    on(): void;
    off(): void;
    click(time_msec: any): void;
    doubleClick(time_msec: any): void;
}
