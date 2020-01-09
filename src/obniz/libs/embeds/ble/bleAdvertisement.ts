const Builder: any = require("./bleAdvertisementBuilder");

class BleAdvertisement {
  public Obniz: any;
  public adv_data: any;
  public scan_resp: any;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
    this.adv_data = [];
    this.scan_resp = [];
  }

  public start() {
    const obj: any = {};
    obj.ble = {};
    obj.ble.advertisement = {
      adv_data: this.adv_data,
    };

    if (this.scan_resp.length > 0) {
      obj.ble.advertisement.scan_resp = this.scan_resp;
    }

    this.Obniz.send(obj);
  }

  public end() {
    const obj: any = {};
    obj.ble = {};
    obj.ble.advertisement = null;
    this.Obniz.send(obj);
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

module.exports = BleAdvertisement;
