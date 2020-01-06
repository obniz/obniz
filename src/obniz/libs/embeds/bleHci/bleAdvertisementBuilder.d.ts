// Type definitions for bleHciBleAdvertisementBuilder
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleAdvertisementBuilder.prototype {
  // BleAdvertisementBuilder.prototype.getRow.!ret
  type GetRowRet = number[];
}
declare namespace BleAdvertisementBuilder.prototype {
  // BleAdvertisementBuilder.prototype.build.!ret
  type BuildRet = number[];
}
declare namespace BleAdvertisementBuilder.prototype {
  // BleAdvertisementBuilder.prototype.setManufacturerSpecificData.!1
  type SetManufacturerSpecificData1 = number[];
}
declare namespace BleAdvertisementBuilder.prototype {
  // BleAdvertisementBuilder.prototype.convertUuid.!ret
  type ConvertUuidRet = number[];
}

/**
 *
 */
declare interface BleAdvertisementBuilder {

  /**
   *
   * @param Obniz
   * @param json
   */
  new(Obniz: any, json: any): BleAdvertisementBuilder;

  /**
   *
   * @param type
   * @param data
   */
  setRow(type: number, data: any[] | {}): void;

  /**
   *
   * @param type
   * @return
   */
  getRow(type: number): BleAdvertisementBuilder.prototype.GetRowRet;

  /**
   *
   * @return
   */
  build(): BleAdvertisementBuilder.prototype.BuildRet;

  /**
   *
   * @param type
   * @param string
   */
  setStringData(type: number, string: any): void;

  /**
   *
   * @param name
   */
  setShortenedLocalName(name: any): void;

  /**
   *
   * @param name
   */
  setCompleteLocalName(name: any): void;

  /**
   *
   * @param companyCode
   * @param data
   */
  setManufacturerSpecificData(companyCode: number, data: BleAdvertisementBuilder.prototype.SetManufacturerSpecificData1): void;

  /**
   *
   * @param uuid
   */
  setUuid(uuid: any): void;

  /**
   *
   * @param uuid
   * @return
   */
  convertUuid(uuid: any): BleAdvertisementBuilder.prototype.ConvertUuidRet;

  /**
   *
   * @param uuid
   * @param major
   * @param minor
   * @param txPower
   */
  setIbeaconData(uuid: any, major: any, minor: any, txPower: any): void;

  /**
   *
   * @param json
   */
  extendEvalJson(json: any): void;

  /**
   *
   * @param flag
   */
  setFlags(flag: number): void;

  /**
   *
   */
  setLeLimitedDiscoverableModeFlag(): void;

  /**
   *
   */
  setLeGeneralDiscoverableModeFlag(): void;

  /**
   *
   */
  setBrEdrNotSupportedFlag(): void;

  /**
   *
   */
  setLeBrEdrControllerFlag(): void;

  /**
   *
   */
  setLeBrEdrHostFlag(): void;
}

declare module "bleHciBleAdvertisementBuilder" {

  export default bleHciBleAdvertisementBuilder;    // es6 style module export
}
