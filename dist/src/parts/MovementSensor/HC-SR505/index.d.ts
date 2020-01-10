declare class HCSR505 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    io_signal: any;
    params: any;
    onchange: any;
    constructor();
    wired(obniz: any): void;
    getWait(): any;
}
export default HCSR505;
