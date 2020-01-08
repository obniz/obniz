export = HCSR04;
declare class HCSR04 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    _unit: string;
    reset_alltime: boolean;
    temp: number;
    wired(obniz: any): void;
    obniz: any;
    vccIO: any;
    trigger: any;
    echo: any;
    measure(callback: any): void;
    measureWait(): Promise<any>;
    unit(unit: any): void;
}
