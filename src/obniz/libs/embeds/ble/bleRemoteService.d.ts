// Type definitions for bleRemoteService
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface BleRemoteService {

  /**
   *
   */
  parentName: string;

  /**
   *
   */
  childrenName: string;

  /**
   *
   * @param obj
   */
  new(obj: any): BleRemoteService;

  /**
   *
   * @param params
   */
  addCharacteristic(params: any): void;

  /**
   *
   * @param params
   */
  getCharacteristic(params: any): void;

  /**
   *
   */
  discoverAllCharacteristics(): void;

  /**
   *
   */
  discoverAllCharacteristicsWait(): void;

  /**
   *
   */
  discoverChildren(): void;

  /**
   *
   * @param characteristic
   */
  ondiscover(characteristic: any): void;

  /**
   *
   * @param characteristics
   */
  ondiscoverfinished(characteristics: any): void;

  /**
   *
   */
  ondiscovercharacteristic(): void;

  /**
   *
   */
  ondiscovercharacteristicfinished(): void;
}

declare module "bleRemoteService" {

  export default bleRemoteService;    // es6 style module export
}
