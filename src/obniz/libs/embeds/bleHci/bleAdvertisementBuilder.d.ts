// Type definitions for bleHciBleAdvertisementBuilder
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

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
  getRow(type: number): number[];

  /**
   *
   * @return
   */
  build(): any;

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
  setManufacturerSpecificData(companyCode: number, data: number[]): void;

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
  convertUuid(uuid: any): any;

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
