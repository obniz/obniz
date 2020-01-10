declare class HCSR04 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    _unit: any;
    reset_alltime: any;
    temp: any;
    obniz: any;
    params: any;
    vccIO: any;
    trigger: any;
    echo: any;
    constructor();
    wired(obniz: any): void;
    measure(callback: any): void;
    measureWait(): Promise<unknown>;
    unit(unit: any): void;
}
export default HCSR04;
