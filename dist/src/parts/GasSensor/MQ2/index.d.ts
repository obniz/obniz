declare class MQ2 {
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
    heatWait(seconds: any): Promise<unknown>;
}
export default MQ2;
