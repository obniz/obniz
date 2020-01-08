export = MQ6;
declare class MQ6 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: any[];
    onchangeanalog: any;
    onchangedigital: any;
    onexceedvoltage: any;
    voltageLimit: any;
    wired(obniz: any): void;
    obniz: any;
    vcc: any;
    gnd: any;
    ad: any;
    do: any;
    startHeating(): void;
    heatWait(seconds: any): Promise<any>;
}
