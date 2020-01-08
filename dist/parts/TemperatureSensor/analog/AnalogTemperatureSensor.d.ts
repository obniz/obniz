export = AnalogTemperatureSensor;
declare class AnalogTemperatureSensor {
    keys: string[];
    requiredKeys: string[];
    drive: string;
    wired(obniz: any): void;
    obniz: any;
    ad: any;
    getWait(): Promise<number>;
    temp: number | undefined;
    onchange(temp: any): void;
    calc(voltage: any): number;
}
