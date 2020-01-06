const Builder = require('./bleAdvertisementBuilder');

class BleAdvertisement {
  constructor(obnizBle) {
    this.obnizBle = obnizBle;
    this.adv_data = [];
    this.scan_resp = [];
  }

  start() {
    this.obnizBle.warningIfNotInitialize();
    this.obnizBle.peripheralBindings.startAdvertisingWithEIRData(
      Buffer.from(this.adv_data),
      Buffer.from(this.scan_resp)
    );
  }

  end() {
    this.obnizBle.peripheralBindings.stopAdvertising();
  }

  setAdvDataRaw(adv_data) {
    this.adv_data = adv_data;
  }

  setAdvData(json) {
    let builder = this.advDataBulider(json);
    this.setAdvDataRaw(builder.build());
  }

  advDataBulider(jsonVal) {
    return new Builder(this.Obniz, jsonVal);
  }

  scanRespDataBuilder(json) {
    return new Builder(this.Obniz, json);
  }

  setScanRespDataRaw(scan_resp) {
    this.scan_resp = scan_resp;
  }

  setScanRespData(json) {
    this.setScanRespDataRaw(this.scanRespDataBuilder(json).build());
  }
}

module.exports = BleAdvertisement;
