export = BleAdvertisement;
declare class BleAdvertisement {
    constructor(Obniz: any);
    Obniz: any;
    adv_data: any[];
    scan_resp: any[];
    start(): void;
    end(): void;
    setAdvDataRaw(adv_data: any): void;
    setAdvData(json: any): void;
    advDataBulider(jsonVal: any): any;
    scanRespDataBuilder(json: any): any;
    setScanRespDataRaw(scan_resp: any): void;
    setScanRespData(json: any): void;
}
