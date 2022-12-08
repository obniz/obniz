/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { ObnizBLE } from './ble';
import { BleAdvertisementBuilder } from './bleAdvertisementBuilder';
import { BleAdvertisementData, BleScanResponseData } from './bleTypes';
/**
 * @category Use as Peripheral
 */
export declare class BleAdvertisement {
    protected obnizBle: ObnizBLE;
    protected adv_data: number[];
    protected scan_resp: number[];
    constructor(obnizBle: ObnizBLE);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    /**
     * This starts advertisement of BLE.
     *
     * Before calling this function, you should call [[setAdvData]] or [[setAdvDataRaw]] to set data.
     * advertisement interval is 1.28sec fixed.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     *   var service = new obniz.ble.service({
     *  uuid : "fff0"
     * });
     * obniz.ble.peripheral.addService(service);
     * obniz.ble.advertisement.setAdvData(service.advData);
     * obniz.ble.advertisement.start();
     * ```
     */
    startWait(): Promise<void>;
    /**
     * @deprecated  replaced by {@link #startWait()}
     */
    start(): void;
    /**
     * This stops advertisement of BLE.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * obniz.ble.advertisement.start();
     * obniz.ble.advertisement.end();
     * ```
     *
     */
    endWait(): Promise<void>;
    /**
     * @deprecated  replaced by {@link #endWait()}
     */
    end(): void;
    /**
     * This sets advertise data from data array.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * obniz.ble.advertisement.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
     * //0x02, 0x01, 0x1A  => BLE type for
     * //0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name
     *
     * obniz.ble.advertisement.start();
     * ```
     *
     * @param adv_data
     */
    setAdvDataRaw(adv_data: number[]): void;
    /**
     * This sets advertise data from json.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * obniz.ble.advertisement.setAdvData({
     *   flags: ["general_discoverable_mode","br_edr_not_supported"],
     *   manufacturerData:{
     *     companyCode : 0x004C,
     *     serviceUuids: ["fff0"],
     *     data : [0x02,0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb,0x10,0x00,0x00,0x10,0xFF],
     *   }
     * });
     *
     * obniz.ble.advertisement.start();
     * ```
     *
     * @param json
     */
    setAdvData(json: BleAdvertisementData): void;
    /**
     * This sets scan response data from data array.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * obniz.ble.advertisement.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
     * //0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name
     *
     * obniz.ble.advertisement.start();
     * ```
     *
     * @param scan_resp
     */
    setScanRespDataRaw(scan_resp: number[]): void;
    /**
     * This sets scan response data from json data.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * obniz.ble.advertisement.setScanRespData({
     *   localName : "obniz BLE",
     * });
     *
     * obniz.ble.advertisement.start();
     * ```
     *
     * @param json
     */
    setScanRespData(json: BleScanResponseData): void;
    protected advDataBulider(jsonVal: BleAdvertisementData): BleAdvertisementBuilder;
    protected scanRespDataBuilder(json: BleScanResponseData): BleAdvertisementBuilder;
}
