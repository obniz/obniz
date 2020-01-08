export = AK8963;
declare class AK8963 {
    static info(): {
        name: string;
    };
    keys: string[];
    required: any[];
    wired(obniz: any): void;
    obniz: any;
    _address: any;
    i2c: any;
    setConfig(ADC_cycle: any): void;
    _adc_cycle: any;
    getWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
    char2short(valueH: any, valueL: any): number;
}
