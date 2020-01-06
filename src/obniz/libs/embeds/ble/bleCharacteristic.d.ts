// Type definitions for bleCharacteristic
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleCharacteristic.prototype {
  // BleCharacteristic.prototype.toJSON.!ret

  /**
   *
   */
  interface ToJSONRet {

    /**
     *
     */
    properties: {};

    /**
     *
     */
    permissions: {};
  }
}
declare namespace BleCharacteristic.prototype {
  // BleCharacteristic.prototype.addProperty.!0

  /**
   *
   */
  interface AddProperty0 {
  }
}
declare namespace BleCharacteristic.prototype {
  // BleCharacteristic.prototype.addPermission.!0

  /**
   *
   */
  interface AddPermission0 {
  }
}

/**
 *
 */
declare interface BleCharacteristic {

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
   */
  properties: any[];

  /**
   *
   */
  permissions: any[];

  /**
   *
   * @param obj
   */
  new(obj: any): BleCharacteristic;

  /**
   *
   * @return
   */
  toJSON(): BleCharacteristic.prototype.ToJSONRet;

  /**
   *
   * @param param
   */
  addProperty(param: BleCharacteristic.prototype.AddProperty0): void;

  /**
   *
   * @param param
   */
  removeProperty(param: any): void;

  /**
   *
   * @param param
   */
  addPermission(param: BleCharacteristic.prototype.AddPermission0): void;

  /**
   *
   * @param param
   */
  removePermission(param: any): void;

  /**
   *
   * @param data
   */
  write(data: any): void;

  /**
   *
   */
  read(): void;

  /**
   *
   */
  notify(): void;
}

declare module "bleCharacteristic" {

  export default bleCharacteristic;    // es6 style module export
}
