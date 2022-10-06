/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { ObnizBLE } from './ble';
import Builder from './bleAdvertisementBuilder';
import BleAdvertisementBuilder from './bleAdvertisementBuilder';
import {
  BleAdvertisementData,
  BleExtendedAdvertisementMode,
  BleScanResponseData,
} from './bleTypes';
import BleAdvertisement from './bleAdvertisement';

/**
 * @category Use as Peripheral
 */
export default class BleExtendedAdvertisement extends BleAdvertisement {
  private mode: BleExtendedAdvertisementMode;

  constructor(obnizBle: ObnizBLE) {
    super(obnizBle);
    this.mode = 'connectable';
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    super._reset();
  }

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
  public setMode(mode: BleExtendedAdvertisementMode) {
    this.mode = mode;
  }

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
  public async startWait(
    primaryPhy: 'PHY_1m' | 'PHY_Coded' = 'PHY_1m',
    secondaryPhy: 'PHY_1m' | 'PHY_2m' | 'PHY_Coded' = 'PHY_1m'
  ) {
    this.obnizBle.warningIfNotInitialize();
    const advertisementData = Buffer.from(this.adv_data);
    const scanData = Buffer.from(this.scan_resp);
    const decodePhy = (phy: 'PHY_1m' | 'PHY_2m' | 'PHY_Coded') => {
      switch (phy) {
        case 'PHY_1m':
          return 1;
        case 'PHY_2m':
          return 2;
        case 'PHY_Coded':
          return 3;
      }
    };
    const primaryAdvertisingPhy = decodePhy(primaryPhy);
    const secondaryAdvertisingPhy = decodePhy(secondaryPhy);
    // ParametersCommand broadcast 0 connectable 1 scannable 2
    // AdvertiseDataCommand or ResponseDataCommand
    switch (this.mode) {
      case 'broadcast':
        if (advertisementData.length > 1650)
          throw new Error(
            'Advertisement data is over maximum limit of 1650 bytes'
          );
        if (advertisementData.length === 0)
          throw new Error('Advertisement data is not found');
        if (scanData.length !== 0)
          throw new Error('Scan data is over maximum limit of 0 bytes');

        await this.obnizBle.peripheralBindings.setExtendedAdvertisingParametersWait(
          0,
          0x00,
          primaryAdvertisingPhy,
          secondaryAdvertisingPhy,
          0
        );
        await this.obnizBle.peripheralBindings.setExtendedAdvertisingDataWait(
          0,
          advertisementData
        );
        break;
      case 'connectable':
        if (advertisementData.length > 242)
          throw new Error(
            'Advertisement data is over maximum limit of 242 bytes'
          );
        if (advertisementData.length === 0)
          throw new Error('Advertisement data is not found');
        if (scanData.length !== 0)
          throw new Error('Scan data is over maximum limit of 0 bytes');

        await this.obnizBle.peripheralBindings.setExtendedAdvertisingParametersWait(
          0,
          0x41,
          primaryAdvertisingPhy,
          secondaryAdvertisingPhy,
          0
        );
        await this.obnizBle.peripheralBindings.setExtendedAdvertisingDataWait(
          0,
          advertisementData
        );
        break;
      case 'scannable':
        if (advertisementData.length !== 0)
          throw new Error(
            'Advertisement data is over maximum limit of 0 bytes'
          );
        if (scanData.length === 0) throw new Error('Scan data is not found');
        if (scanData.length > 1650)
          throw new Error('Scan data is over maximum limit of 1650 bytes');

        await this.obnizBle.peripheralBindings.setExtendedAdvertisingParametersWait(
          0,
          0x42,
          primaryAdvertisingPhy,
          secondaryAdvertisingPhy,
          0
        );
        await this.obnizBle.peripheralBindings.setExtendedAdvertisingScanResponseDataWait(
          0,
          scanData
        );
        break;
    }

    // EnableCommand
    await this.obnizBle.peripheralBindings.startExtendedAdvertisingWait(0);
  }

  /**
   * @deprecated  replaced by {@link #startWait()}
   */
  public start() {
    super.start();
  }

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
  public async endWait() {
    await this.obnizBle.peripheralBindings.stopExtendedAdvertisingWait(0);
  }

  /**
   * @deprecated  replaced by {@link #endWait()}
   */
  public end() {
    super.end();
  }

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
  public setAdvDataRaw(adv_data: number[]) {
    this.adv_data = adv_data;
  }

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
  public setAdvData(json: BleAdvertisementData) {
    const builder = this.advDataBulider(json);
    this.setAdvDataRaw(builder.build());
  }

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
  public setScanRespDataRaw(scan_resp: number[]) {
    this.scan_resp = scan_resp;
  }

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
  public setScanRespData(json: BleScanResponseData) {
    this.setScanRespDataRaw(this.scanRespDataBuilder(json).build());
  }

  protected advDataBulider(
    jsonVal: BleAdvertisementData
  ): BleAdvertisementBuilder {
    return new Builder(jsonVal, true);
  }

  protected scanRespDataBuilder(
    json: BleScanResponseData
  ): BleAdvertisementBuilder {
    return new Builder(json, true);
  }
}
