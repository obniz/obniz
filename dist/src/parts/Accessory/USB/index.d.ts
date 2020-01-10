declare class USB {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    displayIoNames: any;
    obniz: any;
    io_vdd: any;
    params: any;
    io_gnd: any;
    constructor();
    wired(obniz: any): void;
    on(): void;
    off(): void;
}
export default USB;
