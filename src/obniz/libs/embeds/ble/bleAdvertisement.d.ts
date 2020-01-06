// Type definitions for bleAdvertisement
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface BleAdvertisement {

  /**
   *
   * @param Obniz
   */
  new(Obniz: any): BleAdvertisement;

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

declare module "bleAdvertisement" {

  export default bleAdvertisement;    // es6 style module export
}
