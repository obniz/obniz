declare class AK8963 {
    static info(): {
        name: string;
    };
    keys: any;
    required: any;
    obniz: any;
    params: any;
    _address: any;
    i2c: any;
    _adc_cycle: any;
    constructor();
    wired(obniz: any): void;
    setConfig(ADC_cycle: any): void;
    getWait(): Promise<{
        x: any;
        y: any;
        z: any;
    }>;
    char2short(valueH: any, valueL: any): any;
}
export default AK8963;
