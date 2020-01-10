declare class OMRON_2JCIE {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    periperal: any;
    obniz: any;
    constructor();
    wired(obniz: any): void;
    findWait(): Promise<any>;
    omron_uuid(uuid: any): string;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    signedNumberFromBinary(data: any): any;
    unsignedNumberFromBinary(data: any): any;
    getLatestData(): Promise<any>;
}
export default OMRON_2JCIE;
