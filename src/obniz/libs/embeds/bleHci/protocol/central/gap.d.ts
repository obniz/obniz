// Type definitions for bleHciProtocolCentralGap
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * let debug = require('debug')('gap');
 */
declare function debug(): void;

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
   * @param allowDuplicates
   */
  startScanning(allowDuplicates: any): void;

  /**
   *
   */
  stopScanning(): void;

  /**
   *
   * @param error
   */
  onHciError(error: any): void;

  /**
   *
   */
  onHciLeScanParametersSet(): void;

  /**
   * Called when receive an event "Command Complete" for "LE Set Scan Enable"
   * @param status
   */
  onHciLeScanEnableSet(status: any): void;

  /**
   * Called when we see the actual command "LE Set Scan Enable"
   * @param enable
   * @param filterDuplicates
   */
  onLeScanEnableSetCmd(enable: any, filterDuplicates: any): void;

  /**
   *
   * @param status
   * @param type
   * @param address
   * @param addressType
   * @param eir
   * @param rssi
   */
  onHciLeAdvertisingReport(status: any, type: any, address: any, addressType: any, eir: any, rssi: any): void;

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

declare module "bleHciProtocolCentralGap" {

  export default bleHciProtocolCentralGap;    // es6 style module export
}
