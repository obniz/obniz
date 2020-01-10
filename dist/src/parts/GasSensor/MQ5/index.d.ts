declare class MQ5 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    onchangeanalog: any;
    onchangedigital: any;
    onexceedvoltage: any;
    voltageLimit: any;
    obniz: any;
    vcc: any;
    params: any;
    gnd: any;
    ad: any;
    do: any;
    constructor();
    wired(obniz: any): void;
    startHeating(): void;
    heatWait(seconds: any): Promise<{}>;
}
export default MQ5;
