declare class Potentiometer {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    vcc_voltage: any;
    obniz: any;
    params: any;
    ad: any;
    position: any;
    onchange: any;
    constructor();
    wired(obniz: any): void;
}
export default Potentiometer;
