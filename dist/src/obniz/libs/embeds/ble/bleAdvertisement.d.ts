import Builder from "./bleAdvertisementBuilder";
declare class BleAdvertisement {
    Obniz: any;
    adv_data: any;
    scan_resp: any;
    constructor(Obniz: any);
    start(): void;
    end(): void;
    setAdvDataRaw(adv_data: any): void;
    setAdvData(json: any): void;
    advDataBulider(jsonVal: any): Builder;
    scanRespDataBuilder(json: any): Builder;
    setScanRespDataRaw(scan_resp: any): void;
    setScanRespData(json: any): void;
}
export default BleAdvertisement;
