// Type definitions for bleSecurity
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BleSecurity.prototype {
  // BleSecurity.prototype.setAuth.!0
  type SetAuth0 = any[];
}
declare namespace BleSecurity.prototype {
  // BleSecurity.prototype.setEnableKeyTypes.!0
  type SetEnableKeyTypes0 = any[];
}

/**
 *
 */
declare interface BleSecurity {

  /**
   *
   * @param Obniz
   */
  new(Obniz: any): BleSecurity;

  /**
   *
   * @param mode
   * @param level
   */
  setModeLevel(mode: any, level: any): void;

  /**
   *
   * @param introducedVersion
   * @param functionName
   */
  checkIntroducedFirmware(introducedVersion: string, functionName: string): void;

  /**
   *
   * @param authTypes
   */
  setAuth(authTypes: BleSecurity.prototype.SetAuth0): void;

  /**
   *
   * @param level
   */
  setIndicateSecurityLevel(level: number): void;

  /**
   *
   * @param keyTypes
   */
  setEnableKeyTypes(keyTypes: BleSecurity.prototype.SetEnableKeyTypes0): void;

  /**
   *
   * @param size
   */
  setKeyMaxSize(size: any): void;

  /**
   *
   */
  clearBondingDevicesList(): void;

  /**
   *
   */
  onerror(): void;

  /**
   *
   * @param notifyName
   * @param params
   */
  notifyFromServer(notifyName: any, params: any): void;
}

declare module "bleSecurity" {

  export default bleSecurity;    // es6 style module export
}
