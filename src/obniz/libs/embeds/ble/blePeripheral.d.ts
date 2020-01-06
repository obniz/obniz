// Type definitions for blePeripheral
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface BlePeripheral {

  /**
   *
   */
  services: {};

  /**
   *
   */
  _services: any[];

  /**
   *
   * @param Obniz
   */
  new(Obniz: any): BlePeripheral;

  /**
   *
   * @param obj
   */
  addService(obj: /* BlePeripheral._services.<i> */ any): void;

  /**
   *
   * @param json
   */
  setJson(json: object): void;

  /**
   *
   * @param uuid
   * @return
   */
  getService(uuid: any): /* BlePeripheral._services.<i> */ any;

  /**
   *
   * @param uuid
   */
  removeService(uuid: any): void;

  /**
   *
   */
  stopAllService(): void;

  /**
   *
   * @param param
   */
  findCharacteristic(param: any): void;

  /**
   *
   * @param param
   */
  findDescriptor(param: any): void;

  /**
   *
   */
  end(): void;

  /**
   *
   */
  onconnectionupdates(): void;

  /**
   *
   */
  onerror(): void;
}

declare module "blePeripheral" {

  export default blePeripheral;    // es6 style module export
}
