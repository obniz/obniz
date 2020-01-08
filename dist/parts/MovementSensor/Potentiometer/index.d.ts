export = Potentiometer;
declare class Potentiometer {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    vcc_voltage: number;
    wired(obniz: any): void;
    ad: any;
}
