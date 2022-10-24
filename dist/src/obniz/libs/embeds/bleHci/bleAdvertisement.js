"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleAdvertisement = void 0;
const bleAdvertisementBuilder_1 = require("./bleAdvertisementBuilder");
/**
 * @category Use as Peripheral
 */
class BleAdvertisement {
    constructor(obnizBle) {
        this.obnizBle = obnizBle;
        this.adv_data = [];
        this.scan_resp = [];
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.adv_data = [];
        this.scan_resp = [];
    }
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
    async startWait() {
        this.obnizBle.warningIfNotInitialize();
        await this.obnizBle.peripheralBindings.startAdvertisingWithEIRDataWait(Buffer.from(this.adv_data), Buffer.from(this.scan_resp));
    }
    /**
     * @deprecated  replaced by {@link #startWait()}
     */
    start() {
        this.obnizBle.warningIfNotInitialize();
        // noinspection JSIgnoredPromiseFromCall
        this.startWait().catch((e) => {
            // background
            this.obnizBle.Obniz.error(e);
        });
    }
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
    async endWait() {
        await this.obnizBle.peripheralBindings.stopAdvertisingWait();
    }
    /**
     * @deprecated  replaced by {@link #endWait()}
     */
    end() {
        // noinspection JSIgnoredPromiseFromCall
        this.endWait().catch((e) => {
            // background
            this.obnizBle.Obniz.error(e);
        });
    }
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
    setAdvDataRaw(adv_data) {
        this.adv_data = adv_data;
    }
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
    setAdvData(json) {
        const builder = this.advDataBulider(json);
        this.setAdvDataRaw(builder.build());
    }
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
    setScanRespDataRaw(scan_resp) {
        this.scan_resp = scan_resp;
    }
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
    setScanRespData(json) {
        this.setScanRespDataRaw(this.scanRespDataBuilder(json).build());
    }
    advDataBulider(jsonVal) {
        return new bleAdvertisementBuilder_1.BleAdvertisementBuilder(jsonVal);
    }
    scanRespDataBuilder(json) {
        return new bleAdvertisementBuilder_1.BleAdvertisementBuilder(json);
    }
}
exports.BleAdvertisement = BleAdvertisement;
