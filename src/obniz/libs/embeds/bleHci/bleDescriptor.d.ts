// Type definitions for bleHciBleDescriptor
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleDescriptor.prototype {
  // BleDescriptor.prototype.toJSON.!ret

  /**
   *
   */
  interface ToJSONRet {

    /**
     *
     */
    permissions: /* BleDescriptor.permissions */ any;
  }
}
declare namespace BleDescriptor.prototype {
  // BleDescriptor.prototype.addPermission.!0

  /**
   *
   */
  interface AddPermission0 {
  }
}

/**
 *
 */
declare interface BleDescriptor {

  /**
   *
   */
  parentName: string;

  /**
   *
   */
  permissions: any[];

  /**
   *
   * @param obj
   */
  new(obj: any): BleDescriptor;

  /**
   *
   * @param param
   */
  addPermission(param: BleDescriptor.prototype.AddPermission0): void;

  /**
   *
   * @param param
   */
  removePermission(param: any): void;

  /**
   *
   * @return
   */
  toJSON(): BleDescriptor.prototype.ToJSONRet;
}

declare module "bleHciBleDescriptor" {

  export default bleHciBleDescriptor;    // es6 style module export
}
