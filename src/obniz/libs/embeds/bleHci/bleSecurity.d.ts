// Type definitions for bleHciBleSecurity
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

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
  checkIntroducedFirmware(introducedVersion: any, functionName: any): void;

  /**
   *
   * @param authTypes
   */
  setAuth(authTypes: any): void;

  /**
   *
   * @param level
   */
  setIndicateSecurityLevel(level: any): void;

  /**
   *
   * @param keyTypes
   */
  setEnableKeyTypes(keyTypes: any): void;

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

declare module "bleHciBleSecurity" {

  export default bleHciBleSecurity;    // es6 style module export
}
