// Type definitions for bleHciBlePeripheral
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare namespace BlePeripheral.prototype {
  // BlePeripheral.prototype.addService.!0

  /**
   *
   */
  interface AddService0 {

    /**
     *
     */
    peripheral: BlePeripheral;
  }
}

/**
 *
 */
declare interface BlePeripheral {

  /**
   *
   */
  _services: any[];

  /**
   *
   * @param obnizBle
   */
  new(obnizBle: any): BlePeripheral;

  /**
   *
   */
  _updateServices(): void;

  /**
   *
   * @param obj
   */
  addService(obj: BlePeripheral.prototype.AddService0): void;

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
   * @return
   */
  toJSON(): /* BlePeripheral.prototype.setJson.!0 */ any;

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

declare module "bleHciBlePeripheral" {

  export default bleHciBlePeripheral;    // es6 style module export
}
