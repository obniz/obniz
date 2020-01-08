export = OMRON_2JCIE;
declare class OMRON_2JCIE {
    static info(): {
        name: string;
    };
    keys: any[];
    requiredKeys: any[];
    periperal: any;
    wired(obniz: any): void;
    obniz: any;
    findWait(): Promise<any>;
    omron_uuid(uuid: any): string;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    signedNumberFromBinary(data: any): number;
    unsignedNumberFromBinary(data: any): any;
    getLatestData(): Promise<{
        row_number: any;
        temperature: number;
        relative_humidity: number;
        light: number;
        uv_index: number;
        barometric_pressure: number;
        soud_noise: number;
        discomfort_index: number;
        heatstroke_risk_factor: number;
        battery_voltage: number;
    }>;
}
