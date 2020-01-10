declare class FSR40X {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    io_pwr: any;
    params: any;
    ad: any;
    press: any;
    onchange: any;
    constructor();
    wired(obniz: any): void;
    getWait(): Promise<any>;
}
export default FSR40X;
