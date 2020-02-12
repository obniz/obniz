/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import Builder from "./bleAdvertisementBuilder";
/**
 * @category Use as Peripheral
 */
export default class BleAdvertisement {
    obnizBle: any;
    adv_data: any;
    scan_resp: any;
    Obniz: any;
    constructor(obnizBle: any);
    start(): void;
    end(): void;
    setAdvDataRaw(adv_data: any): void;
    setAdvData(json: any): void;
    advDataBulider(jsonVal: any): Builder;
    scanRespDataBuilder(json: any): Builder;
    setScanRespDataRaw(scan_resp: any): void;
    setScanRespData(json: any): void;
}
