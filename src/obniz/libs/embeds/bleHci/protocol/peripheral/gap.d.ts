// Type definitions for bleHciProtocolPeripheralGap
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * var debug = require('debug')('gap');
 */
declare function debug(): void;

/**
 *
 */
export declare var isLinux: any;

/**
 *
 */
export declare var isIntelEdison: any;

/**
 *
 */
export declare var isYocto: any;

/**
 *
 */
declare interface Gap {

  /**
   *
   * @param hci
   */
  new(hci: any): Gap;

  /**
   *
   * @param name
   * @param serviceUuids
   */
  startAdvertising(name: any, serviceUuids: any): void;

  /**
   *
   * @param data
   */
  startAdvertisingIBeacon(data: any): void;

  /**
   *
   * @param advertisementData
   * @param scanData
   */
  startAdvertisingWithEIRData(advertisementData: any, scanData: any): void;

  /**
   *
   */
  restartAdvertising(): void;

  /**
   *
   */
  stopAdvertising(): void;

  /**
   *
   * @param error
   */
  onHciError(error: any): void;

  /**
   *
   * @param status
   */
  onHciLeAdvertisingParametersSet(status: any): void;

  /**
   *
   * @param status
   */
  onHciLeAdvertisingDataSet(status: any): void;

  /**
   *
   * @param status
   */
  onHciLeScanResponseDataSet(status: any): void;

  /**
   *
   * @param status
   */
  onHciLeAdvertiseEnableSet(status: any): void;
}

declare module "bleHciProtocolPeripheralGap" {

  export default bleHciProtocolPeripheralGap;    // es6 style module export
}
