// Type definitions for bleHciBleAdvertisement
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleAdvertisement.prototype {
  // BleAdvertisement.prototype.setAdvDataRaw.!0
  type SetAdvDataRaw0 = any[];
}
declare namespace BleAdvertisement.prototype {
  // BleAdvertisement.prototype.setScanRespDataRaw.!0
  type SetScanRespDataRaw0 = any[];
}

/**
 *
 */
declare interface BleAdvertisement {

  /**
   *
   * @param obnizBle
   */
  new(obnizBle: any): BleAdvertisement;

  /**
   *
   */
  start(): void;

  /**
   *
   */
  end(): void;

  /**
   *
   * @param adv_data
   */
  setAdvDataRaw(adv_data: BleAdvertisement.prototype.SetAdvDataRaw0): void;

  /**
   *
   * @param json
   */
  setAdvData(json: any): void;

  /**
   *
   * @param jsonVal
   */
  advDataBulider(jsonVal: any): void;

  /**
   *
   * @param json
   */
  scanRespDataBuilder(json: any): void;

  /**
   *
   * @param scan_resp
   */
  setScanRespDataRaw(scan_resp: BleAdvertisement.prototype.SetScanRespDataRaw0): void;

  /**
   *
   * @param json
   */
  setScanRespData(json: any): void;
}

declare module "bleHciBleAdvertisement" {

  export default bleHciBleAdvertisement;    // es6 style module export
}
