/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { ObnizBLE } from './ble';
import { BleAdvertisementBuilder } from './bleAdvertisementBuilder';
import { BleAdvertisementData, BleExtendedAdvertisementMode, BleScanResponseData } from './bleTypes';
import { BleAdvertisement } from './bleAdvertisement';
/**
 * @category Use as Peripheral
 */
export declare class BleExtendedAdvertisement extends BleAdvertisement {
    private mode;
    constructor(obnizBle: ObnizBLE);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    /**
     * AdvertiseMode can be changed
     *
     * broadcast   MAX advData     1650Byte
     * connectable MAX advData      242Byte default
     * scannable   MAX scanRspData 1650Byte
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * obniz.ble.extendedAdvertisement.setMode(broadcast);
     * obniz.ble.extendedAdvertisement.setAdvData({
     *   localName: "test_obniz",
     *   serviceData:[{
     *     uuid:0x2534,
     *     data:[0x55,0x55,0x55,0x55,0x55,0x65,0x65,0x65,5,0x55,0x55,0x65,0x55,0x55,0x65,0x65,0x55,0x55,0x55,0x55,]
     *   },{
     *     uuid:0x3544,
     *     data:[0x55,0x55,0x55,0x55,0x55,0x65,0x65,0x65,0x65,0x55,0x55,0x55,0x65,0x55,0x55,0x65,0x65,0x55,0x55,0x55,0x55,]
     *   }]
     * })
     * await obniz.ble.extendedAdvertisement.startWait();
     * ```
     *
     * @param mode BleExtendedAdvertisementMode
     */
    setMode(mode: BleExtendedAdvertisementMode): void;
    /**
     * This starts advertisement of BLE.
     *
     * Before calling this function, you should call [[setAdvData]] or [[setAdvDataRaw]] to set data.
     * advertisement interval is 1.28sec fixed.
     *
     * primaryPhy: 'PHY_1m' or 'PHY_Coded'
     * secondaryPhy: 'PHY_1m' or 'PHY_2m' or 'PHY_Coded'
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     *   var service = new obniz.ble.service({
     *  uuid : "fff0"
     * });
     * obniz.ble.peripheral.addService(service);
     * obniz.ble.extendedAdvertisement.setAdvData({
     *   flags:service.advData.flags,
     *   serviceUuids:service.advData.serviceUuids,
     *   localName: "test_obniz",
     *   serviceData:[{
     *     uuid:0x3544,
     *     data:[0x55,0x55,0x55,0x55,0x55,0x65,0x65,0x65,0x65,0x55,0x55,0x55,0x65,0x55,0x55,0x65,0x65,0x55,0x55,0x55,0x55,]
     *   }]
     * })
     * await obniz.ble.extendedAdvertisement.startWait('PHY_1m','PHY_2m');
     * ```
     */
    startWait(primaryPhy?: 'PHY_1m' | 'PHY_Coded', secondaryPhy?: 'PHY_1m' | 'PHY_2m' | 'PHY_Coded'): Promise<void>;
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
     * await obniz.ble.extendedAdvertisement.startWait();
     * await obniz.ble.extendedAdvertisement.endWait();
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
     * obniz.ble.extendedAdvertisement.setAdvDataRaw([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
     * //0x02, 0x01, 0x1A  => BLE type for
     * //0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name
     *
     * await obniz.ble.extendedAdvertisement.startWait();
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
     * obniz.ble.extendedAdvertisement.setAdvData({
     *   flags: ["general_discoverable_mode","br_edr_not_supported"],
     *   manufacturerData:{
     *     companyCode : 0x004C,
     *     serviceUuids: ["fff0"],
     *     data : [0x02,0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb,0x10,0x00,0x00,0x10,0xFF],
     *   }
     * });
     *
     * await obniz.ble.extendedAdvertisement.startWait();
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
     * obniz.ble.extendedAdvertisement.setScanRespDataRaw([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
     * //0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name
     *
     * await obniz.ble.advertisement.startWait();
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
     * obniz.ble.extendedAdvertisement.setScanRespData({
     *   localName : "obniz BLE",
     * });
     *
     * await obniz.ble.advertisement.startWait();
     * ```
     *
     * @param json
     */
    setScanRespData(json: BleScanResponseData): void;
    protected advDataBulider(jsonVal: BleAdvertisementData): BleAdvertisementBuilder;
    protected scanRespDataBuilder(json: BleScanResponseData): BleAdvertisementBuilder;
}
