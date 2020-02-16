/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import Builder from "./bleAdvertisementBuilder";

/**
 * @category Use as Peripheral
 */
export default class BleAdvertisement {
  protected obnizBle: any;
  protected adv_data: any;
  protected scan_resp: any;
  protected Obniz: any;

  constructor(obnizBle: any) {
    this.obnizBle = obnizBle;
    this.adv_data = [];
    this.scan_resp = [];
  }

  public start() {
    this.obnizBle.warningIfNotInitialize();
    this.obnizBle.peripheralBindings.startAdvertisingWithEIRData(
      Buffer.from(this.adv_data),
      Buffer.from(this.scan_resp),
    );
  }

  public end() {
    this.obnizBle.peripheralBindings.stopAdvertising();
  }

  public setAdvDataRaw(adv_data: any) {
    this.adv_data = adv_data;
  }

  public setAdvData(json: any) {
    const builder: any = this.advDataBulider(json);
    this.setAdvDataRaw(builder.build());
  }

  public advDataBulider(jsonVal: any) {
    return new Builder(this.Obniz, jsonVal);
  }

  public scanRespDataBuilder(json: any) {
    return new Builder(this.Obniz, json);
  }

  public setScanRespDataRaw(scan_resp: any) {
    this.scan_resp = scan_resp;
  }

  public setScanRespData(json: any) {
    this.setScanRespDataRaw(this.scanRespDataBuilder(json).build());
  }
}
