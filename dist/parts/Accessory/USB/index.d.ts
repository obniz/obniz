export = USB;
declare class USB {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    displayIoNames: {
        vcc: string;
        gnd: string;
    };
    wired(obniz: any): void;
    obniz: any;
    io_vdd: any;
    io_gnd: any;
    on(): void;
    off(): void;
}
