declare class AnalogTemperatureSensor {
    keys: any;
    requiredKeys: any;
    drive: any;
    obniz: any;
    params: any;
    ad: any;
    temp: any;
    constructor();
    wired(obniz: any): void;
    getWait(): Promise<any>;
    onchange(temp: any): void;
    calc(voltage: any): number;
}
export default AnalogTemperatureSensor;
